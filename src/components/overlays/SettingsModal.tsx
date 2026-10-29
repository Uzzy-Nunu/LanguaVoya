"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { TargetLanguage, CefrLevel, InterfaceLanguage } from "@/types/game";
import { Settings, Volume2, Globe, Type, RefreshCw, X } from "lucide-react";

export const SettingsModal: React.FC = () => {
  const { saveState, setOverlay, updateSettings, updateProfile, resetJourney } = useGame();
  const { settings } = saveState;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-xs select-none animate-fadeIn">
      <div className="w-full max-w-2xl paper-glass-strong rounded-3xl border border-line shadow-e2 p-5 sm:p-7 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-coral" />
            <h2 className="text-xl font-bold font-display text-ink">Settings & Accessibility</h2>
          </div>
          <button
            onClick={() => setOverlay(null)}
            className="p-2 rounded-full text-muted hover:text-ink hover:bg-sand/80 transition-colors"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Audio & Speech */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-ink uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <Volume2 size={16} className="text-coral" />
              <span>Audio & Speech</span>
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-ink block">Character Voice Playback</span>
                  <span className="text-muted text-[11px]">Spoken audio responses from neighbours</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={(e) => updateSettings({ voiceEnabled: e.target.checked })}
                  className="w-4 h-4 accent-coral cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-ink block">Speech Rate</span>
                  <span className="text-muted text-[11px]">Speed of character voice playback</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.6"
                    max="1.2"
                    step="0.05"
                    value={settings.speechRate}
                    onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                    className="w-24 accent-coral"
                  />
                  <span className="font-mono text-xs w-9 text-right font-bold">{settings.speechRate}x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Preferences */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-ink uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <Globe size={16} className="text-lagoon" />
              <span>Language & Level</span>
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-ink block">Target Language</span>
                  <span className="text-muted text-[11px]">Town and conversation setting</span>
                </div>
                <select
                  value={saveState.targetLanguage}
                  onChange={(e) =>
                    updateProfile(
                      e.target.value as TargetLanguage,
                      saveState.cefrLevel,
                      saveState.interfaceLanguage
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-sand/60 border border-line text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="fr">French (Valmer, France)</option>
                  <option value="es">Spanish (San Pedro)</option>
                  <option value="it">Italian (Bellavita)</option>
                  <option value="en">English (Lilac Town)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-ink block">CEFR Level</span>
                  <span className="text-muted text-[11px]">Dialogue complexity assumption</span>
                </div>
                <select
                  value={saveState.cefrLevel}
                  onChange={(e) =>
                    updateProfile(
                      saveState.targetLanguage,
                      e.target.value as CefrLevel,
                      saveState.interfaceLanguage
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-sand/60 border border-line text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="A1">A1 · Just starting</option>
                  <option value="A2">A2 · I know some</option>
                  <option value="B1">B1 · Comfortable basics</option>
                  <option value="B2">B2 · Conversational</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-ink block">Always show translations</span>
                  <span className="text-muted text-[11px]">Display meaning under target-language lines</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoTranslate}
                  onChange={(e) => updateSettings({ autoTranslate: e.target.checked })}
                  className="w-4 h-4 accent-coral cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Reading & Accessibility */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-ink uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <Type size={16} className="text-sun" />
              <span>Reading & Display</span>
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-ink block">Dyslexia-friendly Font</span>
                  <span className="text-muted text-[11px]">Atkinson Hyperlegible typeface</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dyslexicFont}
                  onChange={(e) => updateSettings({ dyslexicFont: e.target.checked })}
                  className="w-4 h-4 accent-coral cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-ink block">Reduce Motion</span>
                  <span className="text-muted text-[11px]">Minimise 3D camera sweeps and transitions</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                  className="w-4 h-4 accent-coral cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Reset journey */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset your journey data and start over from Day 1?")) {
                  resetJourney();
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-danger/40 text-danger hover:bg-danger/10 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              <span>Reset Journey Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
