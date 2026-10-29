"use client";

import React, { useEffect, useState, useRef } from "react";
import { SpeechRecorder } from "@/lib/speech";
import { useGame } from "@/context/GameContext";
import { getSuggestedResponses } from "@/data/dialogueBank";
import { Mic, Square, RotateCcw, Keyboard, Lightbulb, Check } from "lucide-react";

interface VoiceRecorderProps {
  onSendTranscript: (text: string) => void;
  onSwitchToText: () => void;
  onOpenHint: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onSendTranscript,
  onSwitchToText,
  onOpenHint,
}) => {
  const { saveState } = useGame();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [waveformBars, setWaveformBars] = useState<number[]>([6, 12, 20, 14, 8, 16, 22, 10]);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const recorderRef = useRef<SpeechRecorder | null>(null);

  const currentScenario = saveState.scenarios[saveState.currentDay];
  const currentTask = currentScenario?.tasks.find((t) => t.status === "current");
  const suggestions = getSuggestedResponses(currentTask?.id || "d1-t1", saveState.targetLanguage);

  // Prepare speech recognition, but wait for an explicit click before listening.
  useEffect(() => {
    const recorder = new SpeechRecorder(
      saveState.targetLanguage,
      (interim) => setTranscript(interim),
      (final) => setTranscript(final),
      (err) => {
        setIsRecording(false);
        setRecordingError(err);
      },
      () => setIsRecording(false)
    );

    recorderRef.current = recorder;

    // Waveform animation
    const interval = setInterval(() => {
      if (recorder.isRecording) {
        setWaveformBars([
          Math.floor(Math.random() * 16 + 6),
          Math.floor(Math.random() * 24 + 8),
          Math.floor(Math.random() * 28 + 10),
          Math.floor(Math.random() * 22 + 6),
          Math.floor(Math.random() * 26 + 8),
          Math.floor(Math.random() * 18 + 6),
        ]);
      }
    }, 120);

    return () => {
      recorder.stop();
      clearInterval(interval);
    };
  }, [saveState.targetLanguage]);

  const handleStartRecording = () => {
    setTranscript("");
    setRecordingError(null);
    setIsRecording(true);
    recorderRef.current?.start();
    if (!recorderRef.current?.isRecording) setIsRecording(false);
  };

  const handleStopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleRerecord = () => {
    handleStartRecording();
  };

  const handleSubmit = (textToSend?: string) => {
    const finalTxt = (textToSend || transcript).trim();
    if (finalTxt) {
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
      setIsRecording(false);
      onSendTranscript(finalTxt);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5 py-1 select-none">
      {/* Status Bar with Waveform */}
      <div className="flex items-center justify-between bg-sand/40 border border-line rounded-xl px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? "bg-coral animate-ping" : "bg-sage"}`} />
          <span className="text-xs font-semibold text-ink">
            {isRecording ? "Listening to your voice..." : transcript ? "Voice captured" : "Tap the mic when you're ready"}
          </span>
        </div>

        {/* Live Waveform */}
        {isRecording ? (
          <div className="flex items-center gap-1 h-5">
            {waveformBars.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className="w-1 bg-coral rounded-full transition-all duration-100 ease-in-out"
              />
            ))}
          </div>
        ) : (
            <div className="flex items-center gap-2">
              {transcript && (
                <button
                  onClick={handleRerecord}
                  className="text-[11px] font-semibold text-muted hover:text-ink flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  <span>Record again</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleStartRecording}
                aria-label={transcript ? "Start a new voice recording" : "Start voice recording"}
                title={transcript ? "Record again" : "Start recording"}
                className="w-8 h-8 rounded-full bg-coral text-paper flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
              >
                <Mic size={15} />
              </button>
            </div>
        )}
      </div>

      {recordingError && (
        <p role="alert" className="text-[11px] text-danger">{recordingError}</p>
      )}

      {isRecording && (
        <button
            type="button"
            onClick={handleStopRecording}
            className="self-start inline-flex items-center gap-1.5 rounded-lg bg-sand px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-sand/80"
        >
            <Square size={11} />
            Stop recording
        </button>
      )}

      {/* Recognized text or live edit box */}
      <div className="relative">
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            isRecording
              ? "Listening... Speak or tap a suggestion below"
              : transcript
                ? "Review recognized speech or edit here..."
                : "Tap the microphone to start, or type a transcript..."
          }
          className="w-full px-3.5 py-2 rounded-xl bg-paper border border-line focus:border-lagoon text-ink font-medium text-xs sm:text-sm focus:outline-none shadow-xs"
        />
        {transcript && isRecording && (
          <button
            onClick={handleStopRecording}
            className="absolute right-2 top-2 text-[10px] bg-sand px-2 py-0.5 rounded-md text-ink font-semibold"
          >
            Edit
          </button>
        )}
      </div>

      {/* Suggested Responses Row (Quick "What to say" chips) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted shrink-0 flex items-center gap-1">
          <Lightbulb size={11} className="text-sun" />
          <span>Quick idea:</span>
        </span>
        {suggestions.slice(0, 2).map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSubmit(sug.text)}
            className="px-2.5 py-1 rounded-full bg-sand/70 hover:bg-sand border border-line text-[11px] font-semibold text-ink whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs"
            title={sug.translation}
          >
            <span>"{sug.text}"</span>
            <span className="text-[10px] text-coral font-bold ml-1">Send →</span>
          </button>
        ))}
      </div>

      {/* Primary Action Buttons Row */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={onSwitchToText}
          className="px-3 py-2 rounded-xl bg-sand/80 hover:bg-sand text-ink text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Keyboard size={14} />
          <span>Type instead</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Hint button */}
          <button
            onClick={onOpenHint}
            className="px-3 py-2 rounded-xl bg-sand/80 hover:bg-sand text-ink text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Open hints (H)"
          >
            <Lightbulb size={14} className="text-sun" />
            <span>Hint</span>
          </button>

          {/* Large Submit Response button */}
          <button
            onClick={() => handleSubmit()}
            disabled={!transcript.trim()}
            className="px-4 py-2 rounded-xl bg-coral text-paper text-xs font-bold hover:scale-105 active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Check size={14} strokeWidth={3} />
            <span>Submit Response</span>
          </button>
        </div>
      </div>
    </div>
  );
};
