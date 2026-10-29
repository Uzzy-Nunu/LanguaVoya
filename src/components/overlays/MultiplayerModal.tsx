"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Copy, Mic, Send, Volume2, X } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { getSupabase } from "@/lib/supabase";
import { SpeechRecorder, audioService } from "@/lib/speech";
import { LOCATIONS } from "@/data/scenarios";
import { LocationId } from "@/types/game";

type RoleplaySession = {
  id: string;
  invite_code: string;
  creator_id: string;
  creator_role: "student" | "tutor";
  student_id: string | null;
  tutor_id: string | null;
  day_number: number;
  location_id: LocationId;
  target_language: "fr" | "es" | "it" | "en";
  status: "waiting" | "active" | "closed";
  created_at: string;
};

type RoleplayMessage = {
  id: string;
  session_id: string;
  sender_id: string;
  content: string;
  input_mode: "text" | "voice";
  created_at: string;
};

export const MultiplayerModal: React.FC = () => {
  const {
    accountEmail,
    setOverlay,
    saveState,
    supabaseConfigured,
    userId,
    setGameMode,
    setRoleplayScene,
  } = useGame();
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [inviteCode, setInviteCode] = useState("");
  const [session, setSession] = useState<RoleplaySession | null>(null);
  const [recentSessions, setRecentSessions] = useState<RoleplaySession[]>([]);
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorder = useRef<SpeechRecorder | null>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const draftRef = useRef("");

  const updateDraft = (value: string) => {
    draftRef.current = value;
    setDraft(value);
  };

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !accountEmail) return;
    let active = true;
    void supabase
      .from("roleplay_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) setError(`Could not load your roleplay sessions: ${loadError.message}`);
        else setRecentSessions((data || []) as RoleplaySession[]);
      });
    return () => {
      active = false;
    };
  }, [accountEmail]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!session || !supabase) return;
    let active = true;
    setMessages([]);
    void supabase
      .from("roleplay_messages")
      .select("*")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true })
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) setError(`Could not load the conversation: ${loadError.message}`);
        else setMessages((data || []) as RoleplayMessage[]);
      });

    const channel = supabase
      .channel(`roleplay-${session.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "roleplay_messages", filter: `session_id=eq.${session.id}` },
        (payload) => {
          const message = payload.new as RoleplayMessage;
          setMessages((current) =>
            current.some((item) => item.id === message.id) ? current : [...current, message]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "roleplay_sessions", filter: `id=eq.${session.id}` },
        (payload) => setSession(payload.new as RoleplaySession)
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setError("Realtime connection failed. Check your connection and Supabase Realtime settings.");
        }
      });

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [session?.id]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => recorder.current?.stop(), []);

  const createSession = async () => {
    const supabase = getSupabase();
    if (!supabase || !userId) return;
    setBusy(true);
    setError(null);
    const targetLocation = saveState.scenarios[saveState.currentDay]?.targetLocation || saveState.currentLocation;
    const code = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
    const { data, error: createError } = await supabase
      .from("roleplay_sessions")
      .insert({
        invite_code: code,
        creator_id: userId,
        creator_role: role,
        student_id: role === "student" ? userId : null,
        tutor_id: role === "tutor" ? userId : null,
        day_number: saveState.currentDay,
        location_id: targetLocation,
        target_language: saveState.targetLanguage,
      })
      .select("*")
      .single();
    setBusy(false);
    if (createError) {
      setError(`Could not create an invitation: ${createError.message}`);
      return;
    }
    setSession(data as RoleplaySession);
    setRecentSessions((items) => [data as RoleplaySession, ...items]);
    setRoleplayScene({ day: saveState.currentDay, locationId: targetLocation });
    setGameMode("world");
  };

  const joinSession = async (event?: FormEvent) => {
    event?.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !inviteCode.trim()) return;
    setBusy(true);
    setError(null);
    const { data: sessionId, error: joinError } = await supabase.rpc("join_roleplay_session", {
      p_invite_code: inviteCode.trim(),
    });
    if (joinError) {
      setBusy(false);
      setError(joinError.message);
      return;
    }
    const { data, error: loadError } = await supabase
      .from("roleplay_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    setBusy(false);
    if (loadError) {
      setError(`Joined, but could not load the session: ${loadError.message}`);
      return;
    }
    setSession(data as RoleplaySession);
    setRecentSessions((items) => [data as RoleplaySession, ...items.filter((item) => item.id !== data.id)]);
    setRoleplayScene({ day: data.day_number, locationId: data.location_id });
    setGameMode("world");
  };

  const sendMessage = async (text = draft, inputMode: "text" | "voice" = "text") => {
    const supabase = getSupabase();
    const content = text.trim();
    if (!supabase || !session || !userId || !content || busy) return;
    setBusy(true);
    setError(null);
    const { data, error: sendError } = await supabase
      .from("roleplay_messages")
      .insert({
        session_id: session.id,
        sender_id: userId,
        content,
        input_mode: inputMode,
      })
      .select("*")
      .single();
    setBusy(false);
    if (sendError) {
      setError(`Message could not be sent: ${sendError.message}`);
      return;
    }
    setMessages((items) =>
      items.some((item) => item.id === data.id) ? items : [...items, data as RoleplayMessage]
    );
    updateDraft("");
  };

  const toggleVoice = () => {
    if (recording) {
      const spokenTurn = draftRef.current;
      recorder.current?.stop();
      setRecording(false);
      if (spokenTurn.trim()) void sendMessage(spokenTurn, "voice");
      return;
    }
    let spoken = "";
    const speechRecorder = new SpeechRecorder(
      session?.target_language || saveState.targetLanguage,
      (transcript) => updateDraft(`${spoken} ${transcript}`.trim()),
      (transcript) => {
        spoken = `${spoken} ${transcript}`.trim();
        updateDraft(spoken);
      },
      (speechError) => {
        setRecording(false);
        setError(speechError);
      }
    );
    recorder.current = speechRecorder;
    speechRecorder.start();
    setRecording(speechRecorder.isRecording);
  };

  const copyInvite = async () => {
    if (!session) return;
    try {
      await navigator.clipboard.writeText(session.invite_code);
      setError(null);
    } catch (copyError) {
      setError(`Could not copy the invite code: ${copyError instanceof Error ? copyError.message : "clipboard unavailable"}`);
    }
  };

  const sessionLocation = session
    ? saveState.scenarios[session.day_number]?.targetLocation
    : saveState.scenarios[saveState.currentDay]?.targetLocation;
  const locationName =
    LOCATIONS.find((location) => location.id === sessionLocation)?.name ||
    sessionLocation ||
    saveState.currentLocation;
  const isWaiting = session?.status === "waiting";
  const ownRole = session?.student_id === userId ? "student" : "tutor";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-3 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="multiplayer-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-line paper-glass-strong shadow-e2"
      >
        <header className="flex items-start justify-between border-b border-line px-5 py-4">
          <div>
            <h2 id="multiplayer-title" className="text-xl font-bold text-ink">Tutor roleplay</h2>
            <p className="mt-1 text-sm text-muted">Practise the current town scene together by text or spoken turns.</p>
          </div>
          <button onClick={() => { setRoleplayScene(null); setOverlay(null); }} aria-label="Close roleplay" className="rounded-full p-2 text-muted hover:bg-sand hover:text-ink">
            <X size={18} />
          </button>
        </header>

        {!accountEmail ? (
          <div className="p-6 text-center">
            <p className="text-sm text-ink">Sign in to create a private tutor invitation or join a student.</p>
            <button onClick={() => setOverlay("account")} className="mt-4 rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white">
              Open account
            </button>
          </div>
        ) : !supabaseConfigured ? (
          <p className="p-6 text-sm text-danger">Configure Supabase to enable multiplayer sessions.</p>
        ) : session ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-sand/50 px-5 py-3">
              <div>
                <div className="text-sm font-bold text-ink">
                  Day {session.day_number} · {locationName} · {session.target_language.toUpperCase()}
                </div>
                <div className="text-xs text-muted">
                  You are the {ownRole}. {isWaiting ? "Waiting for your partner to join." : "Your partner is connected."}
                </div>
              </div>
              {isWaiting ? (
                <button onClick={() => void copyInvite()} className="flex items-center gap-2 rounded-xl bg-lagoon px-3 py-2 text-xs font-bold text-white">
                  <Copy size={14} /> Copy code: {session.invite_code}
                </button>
              ) : (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Roleplay live</span>
              )}
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {isWaiting && (
                <div className="rounded-xl border border-dashed border-lagoon/50 bg-lagoon/5 p-4 text-sm text-ink">
                  Share this private code with your {ownRole === "student" ? "tutor" : "student"}. They can enter it from their own game.
                </div>
              )}
              {messages.map((message) => {
                const isOwn = message.sender_id === userId;
                return (
                  <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${isOwn ? "bg-coral/15" : "border border-line bg-white"}`}>
                      <div className="mb-1 flex items-center justify-between gap-4 text-[10px] font-bold uppercase text-muted">
                        <span>{isOwn ? "You" : ownRole === "student" ? "Tutor" : "Student"}{message.input_mode === "voice" ? " · voice" : ""}</span>
                        <button
                          type="button"
                          title="Read message aloud"
                          onClick={() => audioService.speak(message.content, session.target_language)}
                          className="text-lagoon hover:text-coral"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm text-ink">{message.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEnd} />
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
              className="flex items-end gap-2 border-t border-line p-3"
            >
              <textarea
                value={draft}
                onChange={(event) => updateDraft(event.target.value)}
                maxLength={2000}
                rows={2}
                disabled={isWaiting}
                placeholder={recording ? "Listening... edit your transcript here" : "Write your roleplay turn..."}
                className="min-w-0 flex-1 resize-none rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-lagoon disabled:opacity-60"
              />
              <button type="button" disabled={isWaiting} onClick={toggleVoice} title={recording ? "Stop recording and send" : "Speak your turn"} className={`rounded-xl p-3 ${recording ? "bg-coral text-white" : "bg-sand text-ink"} disabled:opacity-50`}>
                <Mic size={17} />
              </button>
              <button type="submit" disabled={isWaiting || busy || !draft.trim()} className="rounded-xl bg-lagoon p-3 text-white disabled:opacity-50" aria-label="Send message">
                <Send size={17} />
              </button>
            </form>
            <div className="flex justify-between border-t border-line px-4 py-2">
              <button onClick={() => { setSession(null); setRoleplayScene(null); }} className="text-xs font-semibold text-muted hover:text-ink">Back to invites</button>
              <button onClick={() => void copyInvite()} disabled={!session.invite_code} className="flex items-center gap-1 text-xs font-semibold text-lagoon hover:text-coral">
                <ArrowLeftRight size={13} /> Share or reuse invite code
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 overflow-y-auto p-5 sm:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-line bg-white/70 p-4">
              <div>
                <h3 className="font-bold text-ink">Invite your partner</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">Create a private code tied to today&apos;s scene. Students can invite a tutor, or tutors can invite a student.</p>
              </div>
              <div className="flex gap-2">
                {(["student", "tutor"] as const).map((choice) => (
                  <button
                    key={choice}
                    onClick={() => setRole(choice)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-bold capitalize ${role === choice ? "border-lagoon bg-lagoon/10 text-lagoon" : "border-line text-muted"}`}
                  >
                    I&apos;m the {choice}
                  </button>
                ))}
              </div>
              <button disabled={busy} onClick={() => void createSession()} className="w-full rounded-xl bg-coral px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                {busy ? "Creating..." : "Create private invite"}
              </button>
            </div>

            <div className="space-y-4 rounded-2xl border border-line bg-white/70 p-4">
              <div>
                <h3 className="font-bold text-ink">Join an invitation</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">Enter the private code your tutor or student shared with you.</p>
              </div>
              <form onSubmit={(event) => void joinSession(event)} className="flex gap-2">
                <input value={inviteCode} onChange={(event) => setInviteCode(event.target.value.toUpperCase())} maxLength={24} placeholder="Invite code" className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2 text-sm uppercase text-ink outline-none focus:border-lagoon" />
                <button disabled={busy || !inviteCode.trim()} className="rounded-xl bg-lagoon px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Join</button>
              </form>
              {recentSessions.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Recent sessions</h4>
                  <div className="space-y-1.5">
                    {recentSessions.map((recent) => (
                      <button key={recent.id} onClick={() => { setSession(recent); setRoleplayScene({ day: recent.day_number, locationId: recent.location_id }); }} className="flex w-full items-center justify-between rounded-xl bg-sand/60 px-3 py-2 text-left text-xs hover:bg-sand">
                        <span>Day {recent.day_number} · {LOCATIONS.find((location) => location.id === recent.location_id)?.name || recent.location_id} · {recent.target_language.toUpperCase()}</span>
                        <span className="font-bold text-lagoon">{recent.status === "active" ? "Open" : recent.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && <p role="alert" className="border-t border-line bg-red-50 px-5 py-2 text-xs text-danger">{error}</p>}
      </section>
    </div>
  );
};
