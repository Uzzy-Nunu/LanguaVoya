"use client";

import React, { useEffect } from "react";
import { useGame } from "@/context/GameContext";

export const ChapterTransition: React.FC = () => {
  const { chapterTitleCard, dismissChapterTitle } = useGame();

  useEffect(() => {
    if (!chapterTitleCard) return;
    const timer = setTimeout(() => {
      dismissChapterTitle();
    }, 3200);
    return () => clearTimeout(timer);
  }, [chapterTitleCard, dismissChapterTitle]);

  if (!chapterTitleCard) return null;

  return (
    <div
      onClick={dismissChapterTitle}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-scrim/80 backdrop-blur-sm cursor-pointer select-none animate-fadeIn"
      title="Click anywhere to continue"
    >
      <div className="text-center max-w-lg space-y-3">
        <span className="text-sm font-bold tracking-widest uppercase text-sun block">
          Day {chapterTitleCard.day}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-paper tracking-tight drop-shadow-md">
          {chapterTitleCard.title}
        </h1>
        <p className="text-sm sm:text-base text-paper/80 max-w-md mx-auto leading-relaxed">
          {chapterTitleCard.teaser}
        </p>
        <div className="pt-4 text-xs text-paper/50">Tap anywhere to enter town</div>
      </div>
    </div>
  );
};
