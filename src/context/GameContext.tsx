"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  PlayerSaveState,
  GameMode,
  OverlayType,
  ActiveConversation,
  CharacterProfile,
  FeedbackData,
  TargetLanguage,
  InterfaceLanguage,
  CefrLevel,
  SavedPhrase,
  ConversationRecord,
  LocationId,
} from "@/types/game";
import { SCENARIOS, CHARACTERS, LOCATIONS } from "@/data/scenarios";
import { INITIAL_DIALOGUE_BY_NPC, HINTS_BY_TASK } from "@/data/dialogueBank";
import { audioService } from "@/lib/speech";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEY = "languavoya_player_save_v1";

const INITIAL_SAVE: PlayerSaveState = {
  version: 1,
  playerName: "Alex",
  targetLanguage: "fr",
  interfaceLanguage: "en",
  cefrLevel: "A1",
  currentDay: 1,
  currentLocation: "apartment",
  playerCoords: [-19.4, 0, 19.3],
  playerRotation: -Math.PI * 0.75,
  money: 25, // 25 euros starting balance
  inventory: [
    { id: "room_key", name: "Apartment Key", quantity: 1, iconName: "key" },
  ],
  completedDays: [],
  scenarios: SCENARIOS,
  savedPhrases: [
    {
      id: "phrase-1",
      phraseText: "Bonjour ! Je m'appelle...",
      targetLanguage: "fr",
      translation: "Hello! My name is...",
      status: "comfortable",
      sourceDay: 1,
      sourceNpcId: "mme_laurent",
      bookmarked: true,
      timesPracticed: 2,
    },
    {
      id: "phrase-2",
      phraseText: "Enchanté(e) !",
      targetLanguage: "fr",
      translation: "Pleased to meet you!",
      status: "comfortable",
      sourceDay: 1,
      sourceNpcId: "mme_laurent",
      bookmarked: false,
      timesPracticed: 1,
    },
  ],
  conversationHistory: [],
  tomorrowPhraseQueue: [],
  settings: {
    voiceEnabled: true,
    autoTranslate: false,
    autoSendVoice: false,
    fontSize: "M",
    dyslexicFont: false,
    reducedMotion: false,
    audioVolume: 0.8,
    speechRate: 0.95,
  },
};

const isPlayerSaveState = (value: unknown): value is PlayerSaveState => {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<PlayerSaveState>;
  return (
    typeof state.version === "number" &&
    typeof state.playerName === "string" &&
    ["fr", "es", "it", "en"].includes(state.targetLanguage || "") &&
    Number.isInteger(state.currentDay) &&
    state.scenarios !== null &&
    typeof state.scenarios === "object" &&
    Array.isArray(state.completedDays) &&
    Array.isArray(state.savedPhrases) &&
    Array.isArray(state.conversationHistory) &&
    state.settings !== null &&
    typeof state.settings === "object"
  );
};

interface GameContextType {
  saveState: PlayerSaveState;
  gameMode: GameMode;
  overlay: OverlayType;
  activeConversation: ActiveConversation | null;
  nearNpc: CharacterProfile | null;
  feedbackCard: FeedbackData | null;
  chapterTitleCard: { day: number; title: string; teaser: string } | null;
  hasSaveData: boolean;
  userId: string | null;
  roleplayScene: { day: number; locationId: LocationId } | null;
  accountEmail: string | null;
  accountLoading: boolean;
  accountError: string | null;
  accountMessage: string | null;
  cloudSaveError: string | null;
  supabaseConfigured: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  setRoleplayScene: (scene: { day: number; locationId: LocationId } | null) => void;
  dismissedDays: number[];
  dismissCurrentDayModal: () => void;
  setGameMode: (mode: GameMode) => void;
  setOverlay: (overlay: OverlayType) => void;
  setNearNpc: (npc: CharacterProfile | null) => void;
  setPlayerCoords: (coords: [number, number, number], rot: number) => void;
  startConversation: (npcId: string) => void;
  sendMessage: (text: string, mode: "text" | "voice") => Promise<void>;
  leaveConversation: () => void;
  dismissFeedbackCard: () => void;
  dismissChapterTitle: () => void;
  setHintLevel: (level: 0 | 1 | 2 | 3) => void;
  savePhrase: (phraseText: string, translation: string, context?: string) => void;
  toggleBookmark: (phraseId: string) => void;
  updatePhraseStatus: (phraseId: string, status: "new" | "needs-practice" | "comfortable") => void;
  queuePhraseTomorrow: (phraseId: string) => void;
  endCurrentDay: () => void;
  startNextDay: () => void;
  advanceToNextDay: () => void;
  jumpToDay: (day: number) => void;
  updateSettings: (partial: Partial<PlayerSaveState["settings"]>) => void;
  updateProfile: (targetLang: TargetLanguage, level: CefrLevel, interfaceLang: InterfaceLanguage, playerName?: string) => void;
  resetJourney: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [saveState, setSaveState] = useState<PlayerSaveState>(INITIAL_SAVE);
  const [gameMode, setGameMode] = useState<GameMode>("world");
  const [overlay, setOverlay] = useState<OverlayType>(null);
  const [activeConversation, setActiveConversation] = useState<ActiveConversation | null>(null);
  const [nearNpc, setNearNpc] = useState<CharacterProfile | null>(null);
  const [feedbackCard, setFeedbackCard] = useState<FeedbackData | null>(null);
  const [chapterTitleCard, setChapterTitleCard] = useState<{ day: number; title: string; teaser: string } | null>(null);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [dismissedDays, setDismissedDays] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [roleplayScene, setRoleplayScene] = useState<{ day: number; locationId: LocationId } | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountMessage, setAccountMessage] = useState<string | null>(null);
  const [cloudSaveError, setCloudSaveError] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const skipCloudSave = useRef(false);
  const cloudSaveEnabled = useRef(false);
  const authGeneration = useRef(0);

  const dismissCurrentDayModal = () => {
    setDismissedDays((prev) => (prev.includes(saveState.currentDay) ? prev : [...prev, saveState.currentDay]));
  };

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // If stored playerCoords is stuck inside building wall or far on Day 1, update to porch
          if (parsed.currentDay === 1 && (!parsed.playerCoords || parsed.playerCoords[2] < 17.5 || parsed.playerCoords[2] > 21)) {
            parsed.playerCoords = [-19.4, 0, 19.3];
            parsed.playerRotation = -Math.PI * 0.75;
          }
          setSaveState(parsed);
          setHasSaveData(true);
        }
      } catch (e) {
        console.warn("Could not load save from storage", e);
      }
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let active = true;
    const hydrateSession = async (session: Session | null) => {
      const generation = ++authGeneration.current;
      if (!active) return;

      const nextUserId = session?.user.id ?? null;
      setUserId(nextUserId);
      setAccountEmail(session?.user.email ?? null);
      setAuthReady(false);
      cloudSaveEnabled.current = false;
      skipCloudSave.current = false;

      if (nextUserId) {
        const { data, error } = await supabase
          .from("player_saves")
          .select("state")
          .eq("user_id", nextUserId)
          .maybeSingle();

        if (!active || generation !== authGeneration.current) return;
        if (error) {
          setCloudSaveError(`Could not load your cloud save: ${error.message}`);
          console.error("Could not load cloud save:", error);
        } else if (data?.state && isPlayerSaveState(data.state)) {
          skipCloudSave.current = true;
          setSaveState(data.state);
          setHasSaveData(true);
          setCloudSaveError(null);
          cloudSaveEnabled.current = true;
        } else if (data?.state) {
          setCloudSaveError("Your cloud save could not be read. Your local journey is unchanged.");
        } else {
          cloudSaveEnabled.current = true;
        }
      }

      if (active && generation === authGeneration.current) setAuthReady(true);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => void hydrateSession(session), 0);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAccountError(`Could not check your account: ${error.message}`);
        setAuthReady(true);
        return;
      }
      void hydrateSession(data.session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Persist to LocalStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
      } catch (e) {
        console.warn("Could not write save to storage", e);
      }
    }
  }, [saveState]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !userId || !authReady || !cloudSaveEnabled.current) return;
    if (skipCloudSave.current) {
      skipCloudSave.current = false;
      return;
    }

    const timeout = window.setTimeout(async () => {
      const { error } = await supabase.from("player_saves").upsert(
        { user_id: userId, state: saveState, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
      if (error) {
        setCloudSaveError(`Cloud save failed: ${error.message}`);
        console.error("Could not save player progress:", error);
      } else {
        setCloudSaveError(null);
      }
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [saveState, userId, authReady]);

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase();
    setAccountError(null);
    setAccountMessage(null);
    if (!supabase) {
      setAccountError("Accounts need Supabase configured. You can continue playing as a guest.");
      return false;
    }
    setAccountLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAccountLoading(false);
    if (error) {
      setAccountError(error.message);
      return false;
    }
    setAccountMessage("Signed in. Your journey is syncing.");
    return true;
  };

  const signUp = async (email: string, password: string) => {
    const supabase = getSupabase();
    setAccountError(null);
    setAccountMessage(null);
    if (!supabase) {
      setAccountError("Accounts need Supabase configured. You can continue playing as a guest.");
      return false;
    }
    setAccountLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setAccountLoading(false);
    if (error) {
      setAccountError(error.message);
      return false;
    }
    setAccountMessage(
      data.session
        ? "Account created. Your journey will now sync to this account."
        : "Account created. Check your email to confirm it, then sign in."
    );
    return Boolean(data.session);
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setAccountError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAccountError(`Could not sign out: ${error.message}`);
      console.error("Could not sign out:", error);
    } else {
      setAccountMessage("Signed out. Your local guest save remains on this device.");
      setUserId(null);
      setAccountEmail(null);
    }
  };

  const setPlayerCoords = (coords: [number, number, number], rot: number) => {
    setSaveState((prev) => ({
      ...prev,
      playerCoords: coords,
      playerRotation: rot,
    }));
  };

  const startConversation = (npcId: string) => {
    const character = CHARACTERS.find((c) => c.id === npcId);
    if (!character) return;

    audioService.playChime("open");
    setGameMode("conversation");

    const targetLang = saveState.targetLanguage;
    let greetingKey = npcId;
    if (npcId === "mme_laurent" && saveState.currentDay === 5) {
      greetingKey = "mme_laurent_d5";
    } else if (npcId === "mme_laurent" && saveState.currentDay === 7) {
      greetingKey = "mme_laurent_d7";
    }

    const initialGreeting =
      INITIAL_DIALOGUE_BY_NPC[greetingKey]?.[targetLang] ||
      INITIAL_DIALOGUE_BY_NPC[npcId]?.[targetLang] || {
        text: "Bonjour ! Comment allez-vous ?",
        translation: "Hello! How are you doing?",
      };

    setActiveConversation({
      npcId,
      npcName: character.displayName,
      phase: "awaiting-player",
      inputMode: "text",
      transcript: "",
      hintLevel: 0,
      turns: [
        {
          id: `turn-init-${Date.now()}`,
          speaker: "npc",
          speakerName: character.displayName,
          text: initialGreeting.text,
          translation: initialGreeting.translation,
          audioAvailable: true,
          timestamp: Date.now(),
        },
      ],
    });

    // Speak initial character reply if speech is enabled
    if (saveState.settings.voiceEnabled) {
      audioService.speak(initialGreeting.text, targetLang, saveState.settings.speechRate);
    }
  };

  const setHintLevel = (level: 0 | 1 | 2 | 3) => {
    if (level > 0) {
      audioService.playChime("hint");
    }
    setActiveConversation((prev) => (prev ? { ...prev, hintLevel: level } : null));
  };

  const sendMessage = async (playerText: string, mode: "text" | "voice") => {
    if (!activeConversation || !playerText.trim()) return;

    const trimmed = playerText.trim();
    const characterId = activeConversation.npcId;
    const currentScenario = saveState.scenarios[saveState.currentDay];
    const currentTask = currentScenario?.tasks.find((t) => t.status === "current");

    // Add player turn immediately
    const playerTurn = {
      id: `turn-${Date.now()}`,
      speaker: "player" as const,
      speakerName: saveState.playerName,
      text: trimmed,
      timestamp: Date.now(),
    };

    setActiveConversation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        phase: "npc-thinking",
        turns: [...prev.turns, playerTurn],
      };
    });

    try {
      const res = await fetch("/api/dialogue/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId,
          playerText: trimmed,
          playerName: saveState.playerName,
          turnCount: activeConversation.turns.filter((t) => t.speaker === "player").length,
          conversationHistory: activeConversation.turns.slice(-6).map((turn) => ({
            speaker: turn.speaker,
            text: turn.text,
          })),
          targetLanguage: saveState.targetLanguage,
          supportLanguage: saveState.interfaceLanguage,
          cefrLevel: saveState.cefrLevel,
          objectiveId: currentTask?.id,
          taskContext: currentTask?.description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Dialogue request failed (${res.status})`);
      }
      const replyText = data.characterReply?.text || "Très bien !";
      const replyTranslation = data.translation || "";
      const correction = data.languageFeedback?.corrections?.[0];
      const advanceTask = !!data.objectiveEvaluation?.advanceTask;

      // Speak character voice
      if (saveState.settings.voiceEnabled) {
        audioService.speak(replyText, saveState.targetLanguage, saveState.settings.speechRate);
      }

      const npcTurn = {
        id: `turn-${Date.now() + 1}`,
        speaker: "npc" as const,
        speakerName: activeConversation.npcName,
        text: replyText,
        translation: replyTranslation,
        audioAvailable: true,
        correction: correction
          ? {
              original: correction.original,
              suggested: correction.suggested,
              explanation: correction.explanation,
            }
          : undefined,
        timestamp: Date.now(),
      };

      setActiveConversation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          phase: "awaiting-player",
          turns: [...prev.turns, npcTurn],
        };
      });

      // If task was achieved during this exchange
      if (advanceTask && currentTask) {
        audioService.playChime("success");
        handleTaskProgression(currentTask.id, trimmed, replyText, correction);
      }
    } catch (err) {
      console.error("Turn failed:", err);
      setActiveConversation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          phase: "awaiting-player",
          turns: [
            ...prev.turns,
            {
              id: `err-${Date.now()}`,
              speaker: "npc",
              speakerName: activeConversation.npcName,
              text: "Pardon, j'ai eu un petit problème de connexion. Pouvez-vous répéter ?",
              translation: "Sorry, I had a small connection problem. Could you repeat that?",
              timestamp: Date.now(),
            },
          ],
        };
      });
    }
  };

  const handleTaskProgression = (
    taskId: string,
    playerPhrase: string,
    npcReply: string,
    correction?: { original: string; suggested: string; explanation: string }
  ) => {
    setSaveState((prev) => {
      const day = prev.currentDay;
      const scenario = prev.scenarios[day];
      if (!scenario) return prev;

      let nextTaskToActivate: string | null = null;
      const updatedTasks = scenario.tasks.map((t, idx) => {
        if (t.id === taskId) {
          // If next task exists in list, schedule it
          if (idx + 1 < scenario.tasks.length) {
            nextTaskToActivate = scenario.tasks[idx + 1].id;
          }
          return { ...t, status: "done" as const };
        }
        return t;
      });

      const finalTasks = updatedTasks.map((t) => {
        if (t.id === nextTaskToActivate) {
          return { ...t, status: "current" as const };
        }
        return t;
      });

      // Auto-save player phrase and NPC reply to journal
      const newPhrases: SavedPhrase[] = [...prev.savedPhrases];
      if (playerPhrase.length > 3) {
        newPhrases.push({
          id: `saved-${Date.now()}`,
          phraseText: playerPhrase,
          targetLanguage: prev.targetLanguage,
          translation: "Used with " + activeConversation?.npcName,
          status: correction ? "needs-practice" : "comfortable",
          sourceDay: day,
          sourceNpcId: activeConversation?.npcId || "etienne",
          bookmarked: false,
          timesPracticed: 1,
        });
      }

      // Money and inventory updates for Day 2 (groceries)
      let updatedMoney = prev.money;
      const updatedInventory = [...prev.inventory];
      if (taskId === "d2-t2" || taskId === "d2-t4") {
        if (updatedMoney >= 3) {
          updatedMoney -= 3;
          if (!updatedInventory.find((i) => i.id === "apples")) {
            updatedInventory.push({ id: "apples", name: "Provence Apples", quantity: 3, iconName: "apple" });
          }
        }
      }
      if (taskId === "d3-t3") {
        if (updatedMoney >= 2) {
          updatedMoney -= 2;
          updatedInventory.push({ id: "bus_ticket", name: "Day Bus Pass", quantity: 1, iconName: "ticket" });
        }
      }

      // Check if all tasks in the scenario are now done
      const allTasksCompleted = finalTasks.every((t) => t.status === "done" || t.status === "done-with-help");
      const updatedCompletedDays = allTasksCompleted && !prev.completedDays.includes(day)
        ? [...prev.completedDays, day]
        : prev.completedDays;

      return {
        ...prev,
        money: updatedMoney,
        inventory: updatedInventory,
        completedDays: updatedCompletedDays,
        savedPhrases: newPhrases,
        scenarios: {
          ...prev.scenarios,
          [day]: {
            ...scenario,
            tasks: finalTasks,
          },
        },
      };
    });

    // Provide feedback card
    setFeedbackCard({
      title: "Task accomplished!",
      managedLines: [
        "Communicated in target language clearly",
        "Engaged in dialogue and achieved task intent",
        "Advanced your narrative objective for the day",
      ],
      tips: correction
        ? [`"${correction.original}" → "${correction.suggested}": ${correction.explanation}`]
        : ["Sounded natural and fluent!"],
      newExpressions: [
        { text: playerPhrase, translation: "Your expressed phrase" },
        { text: npcReply.slice(0, 60) + "...", translation: "Neighbour response" },
      ],
    });
  };

  const leaveConversation = () => {
    audioService.stopSpeech();
    if (activeConversation && activeConversation.turns.length > 1) {
      // Record conversation to history
      const record: ConversationRecord = {
        id: `convo-${Date.now()}`,
        day: saveState.currentDay,
        npcId: activeConversation.npcId,
        npcName: activeConversation.npcName,
        turns: activeConversation.turns,
        completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setSaveState((prev) => ({
        ...prev,
        conversationHistory: [record, ...prev.conversationHistory],
      }));
    }
    setActiveConversation(null);
    setGameMode("world");
  };

  const dismissFeedbackCard = () => {
    setFeedbackCard(null);
  };

  const dismissChapterTitle = () => {
    setChapterTitleCard(null);
  };

  const savePhrase = (phraseText: string, translation: string, context?: string) => {
    audioService.playChime("click");
    setSaveState((prev) => ({
      ...prev,
      savedPhrases: [
        ...prev.savedPhrases,
        {
          id: `manual-${Date.now()}`,
          phraseText,
          targetLanguage: prev.targetLanguage,
          translation,
          status: "needs-practice",
          sourceDay: prev.currentDay,
          sourceNpcId: nearNpc?.id || "neighbour",
          bookmarked: true,
          timesPracticed: 1,
          context,
        },
      ],
    }));
  };

  const toggleBookmark = (phraseId: string) => {
    audioService.playChime("click");
    setSaveState((prev) => ({
      ...prev,
      savedPhrases: prev.savedPhrases.map((p) =>
        p.id === phraseId ? { ...p, bookmarked: !p.bookmarked } : p
      ),
    }));
  };

  const updatePhraseStatus = (phraseId: string, status: "new" | "needs-practice" | "comfortable") => {
    setSaveState((prev) => ({
      ...prev,
      savedPhrases: prev.savedPhrases.map((p) =>
        p.id === phraseId ? { ...p, status } : p
      ),
    }));
  };

  const queuePhraseTomorrow = (phraseId: string) => {
    audioService.playChime("click");
    setSaveState((prev) => ({
      ...prev,
      tomorrowPhraseQueue: [...prev.tomorrowPhraseQueue, phraseId],
    }));
  };

  const endCurrentDay = () => {
    audioService.playChime("day_done");
    setSaveState((prev) => {
      const current = prev.currentDay;
      const completed = prev.completedDays.includes(current)
        ? prev.completedDays
        : [...prev.completedDays, current];
      return {
        ...prev,
        completedDays: completed,
      };
    });
  };

  const startNextDay = () => {
    setSaveState((prev) => {
      const nextDay = Math.min(prev.currentDay + 1, 7);
      const nextScenario = SCENARIOS[nextDay];
      const targetLoc = LOCATIONS.find((l) => l.id === nextScenario?.targetLocation);

      if (nextScenario) {
        setChapterTitleCard({
          day: nextDay,
          title: nextScenario.scenarioTitle,
          teaser: nextScenario.teaser,
        });
      }

      const npcStartCoords: Record<number, [number, number, number]> = {
        1: [-19.4, 0, 19.3],
        2: [15.2, 0, 16.2],
        3: [26.8, 0, -6.8],
        4: [-8.8, 0, -10.3],
        5: [-19.4, 0, 19.3],
        6: [16.2, 0, -15.8],
        7: [-19.4, 0, 19.3],
      };
      const spawnCoords: [number, number, number] =
        npcStartCoords[nextDay] ||
        (targetLoc ? [targetLoc.coords[0] - 3, 0, targetLoc.coords[2] + 4] : prev.playerCoords);

      return {
        ...prev,
        currentDay: nextDay,
        currentLocation: nextScenario?.targetLocation || prev.currentLocation,
        playerCoords: spawnCoords,
      };
    });
    setOverlay(null);
  };

  const advanceToNextDay = () => {
    endCurrentDay();
    if (activeConversation) {
      audioService.stopSpeech();
      setActiveConversation(null);
    }
    setGameMode("world");
    startNextDay();
  };

  const jumpToDay = (targetDay: number) => {
    const clampedDay = Math.max(1, Math.min(targetDay, 7));
    const nextScenario = SCENARIOS[clampedDay];
    const targetLoc = LOCATIONS.find((l) => l.id === nextScenario?.targetLocation);

    if (nextScenario) {
      setChapterTitleCard({
        day: clampedDay,
        title: nextScenario.scenarioTitle,
        teaser: nextScenario.teaser,
      });
    }

    const npcStartCoords: Record<number, [number, number, number]> = {
      1: [-19.4, 0, 19.3],
      2: [15.2, 0, 16.2],
      3: [26.8, 0, -6.8],
      4: [-8.8, 0, -10.3],
      5: [-19.4, 0, 19.3],
      6: [16.2, 0, -15.8],
      7: [-19.4, 0, 19.3],
    };

    setSaveState((prev) => {
      const newCoords: [number, number, number] =
        npcStartCoords[clampedDay] ||
        (targetLoc ? [targetLoc.coords[0] - 2, 0, targetLoc.coords[2] + 4] : prev.playerCoords);

      return {
        ...prev,
        currentDay: clampedDay,
        currentLocation: nextScenario?.targetLocation || prev.currentLocation,
        playerCoords: newCoords,
      };
    });

    setOverlay(null);
    setRoleplayScene(null);
    if (activeConversation) {
      audioService.stopSpeech();
      setActiveConversation(null);
    }
    setGameMode("world");
  };

  const updateSettings = (partial: Partial<PlayerSaveState["settings"]>) => {
    setSaveState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
      },
    }));
  };

  const updateProfile = (
    targetLang: TargetLanguage,
    level: CefrLevel,
    interfaceLang: InterfaceLanguage,
    playerName?: string
  ) => {
    setSaveState((prev) => ({
      ...prev,
      targetLanguage: targetLang,
      cefrLevel: level,
      interfaceLanguage: interfaceLang,
      ...(playerName ? { playerName } : {}),
    }));
  };

  const resetJourney = () => {
    setSaveState(INITIAL_SAVE);
    localStorage.removeItem(STORAGE_KEY);
    setDismissedDays([]);
    setGameMode("world");
    setOverlay(null);
    setActiveConversation(null);
  };

  return (
    <GameContext.Provider
      value={{
        saveState,
        gameMode,
        overlay,
        activeConversation,
        nearNpc,
        feedbackCard,
        chapterTitleCard,
        hasSaveData,
        userId,
        roleplayScene,
        accountEmail,
        accountLoading,
        accountError,
        accountMessage,
        cloudSaveError,
        supabaseConfigured: isSupabaseConfigured(),
        signIn,
        signUp,
        signOut,
        setRoleplayScene,
        dismissedDays,
        dismissCurrentDayModal,
        setGameMode,
        setOverlay,
        setNearNpc,
        setPlayerCoords,
        startConversation,
        sendMessage,
        leaveConversation,
        dismissFeedbackCard,
        dismissChapterTitle,
        setHintLevel,
        savePhrase,
        toggleBookmark,
        updatePhraseStatus,
        queuePhraseTomorrow,
        endCurrentDay,
        startNextDay,
        advanceToNextDay,
        jumpToDay,
        updateSettings,
        updateProfile,
        resetJourney,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
