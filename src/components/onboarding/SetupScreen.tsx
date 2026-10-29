"use client";

import React, { useState } from "react";
import { TargetLanguage, CefrLevel, InterfaceLanguage } from "@/types/game";
import { ArrowRight, Check } from "lucide-react";

interface SetupScreenProps {
  initialTargetLang: TargetLanguage;
  initialLevel: CefrLevel;
  initialInterfaceLang: InterfaceLanguage;
  onComplete: (target: TargetLanguage, level: CefrLevel, iface: InterfaceLanguage, playerName: string) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  initialTargetLang,
  initialLevel,
  initialInterfaceLang,
  onComplete,
}) => {
  const [playerName, setPlayerName] = useState("Alex");
  const [targetLang, setTargetLang] = useState<TargetLanguage>(initialTargetLang);
  const [level, setLevel] = useState<CefrLevel>(initialLevel);
  const [interfaceLang, setInterfaceLang] = useState<InterfaceLanguage>(initialInterfaceLang);

  const languages: Array<{ id: TargetLanguage; label: string; location: string; flag: string }> = [
    { id: "fr", label: "Français", location: "Valmer, France", flag: "🇫🇷" },
    { id: "es", label: "Español", location: "San Pedro, España", flag: "🇪🇸" },
    { id: "it", label: "Italiano", location: "Bellavita, Italia", flag: "🇮🇹" },
    { id: "en", label: "English", location: "Lilac Town, UK", flag: "🇬🇧" },
  ];

  const levels: Array<{ id: CefrLevel; title: string; desc: string }> = [
    { id: "A1", title: "Just starting", desc: "I know hello and a few words." },
    { id: "A2", title: "I know some", desc: "I can say basic phrases and order food." },
    { id: "B1", title: "Comfortable basics", desc: "I can hold simple conversations." },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#1C2A39] via-[#2A3B4C] to-[#14707A] select-none">
      <div className="w-full max-w-4xl paper-glass-strong rounded-3xl p-6 sm:p-8 text-ink shadow-e2 border border-line flex flex-col md:flex-row gap-6">
        {/* Left Col: Selections */}
        <div className="flex-1 space-y-5">
          <div>
            <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
              Personalise Your Experience
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-ink">
              Two quick choices, then you're in.
            </h2>
          </div>

          {/* Player Name */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
              What's your name?
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 24))}
              placeholder="Enter your name..."
              className="w-full px-3 py-2 rounded-xl bg-paper border border-line focus:border-lagoon text-ink font-semibold text-sm focus:outline-none shadow-xs"
              maxLength={24}
              autoFocus
            />
            <p className="text-[11px] text-muted mt-1">This name will be used throughout the game.</p>
          </div>

          {/* Language cards */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
              I want to practise
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {languages.map((lang) => {
                const selected = targetLang === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setTargetLang(lang.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between ${
                      selected
                        ? "bg-paper border-coral shadow-xs ring-2 ring-coral/20"
                        : "bg-paper/60 border-line hover:bg-paper"
                    }`}
                  >
                    <div>
                      <span className="text-xl mb-1 block">{lang.flag}</span>
                      <div className="font-bold text-sm text-ink">{lang.label}</div>
                      <div className="text-[11px] text-muted">{lang.location}</div>
                    </div>
                    {selected && (
                      <div className="w-4 h-4 rounded-full bg-coral text-paper flex items-center justify-center shrink-0">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level selector */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
              My current level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {levels.map((lvl) => {
                const selected = level === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setLevel(lvl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selected
                        ? "bg-paper border-lagoon shadow-xs ring-2 ring-lagoon/20"
                        : "bg-paper/60 border-line hover:bg-paper"
                    }`}
                  >
                    <div className="font-bold text-xs text-ink">{lvl.title}</div>
                    <div className="text-[10px] text-muted mt-0.5 leading-snug">{lvl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interface language */}
          <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
            <span className="font-semibold text-ink">Hints and translations in</span>
            <select
              value={interfaceLang}
              onChange={(e) => setInterfaceLang(e.target.value as InterfaceLanguage)}
              className="px-3 py-1.5 rounded-xl bg-sand/60 border border-line text-xs font-bold text-ink focus:outline-none"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="it">Italiano</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Right Col: Seven Days Preview */}
        <div className="w-full md:w-64 bg-sand/30 border border-line rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-3">
              Your Seven Days
            </span>
            <div className="space-y-2 text-xs">
              {[
                "🚪 Day 1 · Arrival",
                "🧺 Day 2 · Groceries",
                "🚌 Day 3 · Getting around",
                "☕ Day 4 · Café",
                "🔧 Day 5 · Everyday problems",
                "👥 Day 6 · Social life",
                "🧭 Day 7 · Independent day",
              ].map((day, idx) => (
                <div key={idx} className="font-medium text-ink flex items-center gap-1.5">
                  <span className="text-muted/60 text-[10px]">{idx + 1}.</span>
                  <span>{day}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-3 italic leading-relaxed">
              Take them at your own pace — no daily lock.
            </p>
          </div>

          <button
            onClick={() => onComplete(targetLang, level, interfaceLang, playerName.trim() || "Alex")}
            className="w-full mt-4 py-3 rounded-2xl bg-coral text-paper font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
