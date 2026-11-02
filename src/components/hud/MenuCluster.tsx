"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { BookOpen, HelpCircle, Settings, Coins, Backpack, Users, UserRound } from "lucide-react";

export const MenuCluster: React.FC = () => {
  const { saveState, setOverlay, accountEmail } = useGame();
  const unpracticedCount = saveState.savedPhrases.filter(
    (p) => p.status === "needs-practice" || p.status === "new"
  ).length;

  return (
    <div className="flex max-w-[184px] flex-wrap items-center justify-end gap-1 select-none sm:max-w-none sm:flex-nowrap sm:gap-2">
      {/* Compact Status Indicator (Money & Inventory) */}
      <div className="hidden sm:flex items-center gap-2 paper-glass px-3 py-1.5 rounded-full text-xs font-semibold text-ink shadow-xs">
        <div className="flex items-center gap-1 text-ink" title="Current money balance">
          <Coins size={14} className="text-sun" />
          <span>{saveState.money} €</span>
        </div>
        <div className="w-px h-3.5 bg-line" />
        <div className="flex items-center gap-1 text-ink" title="Items in backpack">
          <Backpack size={14} className="text-lagoon" />
          <span>{saveState.inventory.length}</span>
        </div>
      </div>

      {/* Journal Button */}
      <button
        onClick={() => setOverlay("multiplayer")}
        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full paper-glass text-ink hover:text-lagoon hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
        aria-label="Tutor roleplay"
        title="Tutor roleplay"
      >
        <Users size={16} className="sm:w-[19px] sm:h-[19px]" />
      </button>

      <button
        onClick={() => setOverlay("account")}
        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full paper-glass text-ink hover:text-coral hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
        aria-label={accountEmail ? `Account: ${accountEmail}` : "Sign in or create account"}
        title={accountEmail || "Sign in or create account"}
      >
        <UserRound size={16} className="sm:w-[19px] sm:h-[19px]" />
      </button>

      {/* Journal Button */}
      <button
        onClick={() => setOverlay("journal")}
        className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full paper-glass text-ink hover:text-coral hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
        aria-label="Open Journal (J)"
        title="Journal (J)"
      >
        <BookOpen size={16} className="sm:w-[19px] sm:h-[19px]" />
        {unpracticedCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-coral text-paper text-[10px] font-bold flex items-center justify-center shadow-xs">
            {unpracticedCount}
          </span>
        )}
      </button>

      {/* Help Button */}
      <button
        onClick={() => setOverlay("help")}
        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full paper-glass text-ink hover:text-lagoon hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
        aria-label="Help and controls (?)"
        title="Help & Controls (?)"
      >
        <HelpCircle size={16} className="sm:w-[19px] sm:h-[19px]" />
      </button>

      {/* Settings Button */}
      <button
        onClick={() => setOverlay("settings")}
        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full paper-glass text-ink hover:text-ink/80 hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
        aria-label="Settings"
        title="Settings"
      >
        <Settings size={16} className="sm:w-[19px] sm:h-[19px]" />
      </button>
    </div>
  );
};
