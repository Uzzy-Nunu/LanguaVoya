"use client";

import React, { useState } from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import { WorldCanvas } from "@/components/world/WorldCanvas";
import { JourneyStrip } from "@/components/hud/JourneyStrip";
import { ObjectiveCard } from "@/components/hud/ObjectiveCard";
import { MenuCluster } from "@/components/hud/MenuCluster";
import { PhraseTray } from "@/components/hud/PhraseTray";
import { ControlsHint } from "@/components/hud/ControlsHint";
import { DialogueDock } from "@/components/conversation/DialogueDock";
import { FeedbackCard } from "@/components/conversation/FeedbackCard";
import { JourneyModal } from "@/components/overlays/JourneyModal";
import { JournalModal } from "@/components/overlays/JournalModal";
import { SettingsModal } from "@/components/overlays/SettingsModal";
import { HelpModal } from "@/components/overlays/HelpModal";
import { DaySummaryModal } from "@/components/overlays/DaySummaryModal";
import { FinalRecapModal } from "@/components/overlays/FinalRecapModal";
import { ChapterTransition } from "@/components/overlays/ChapterTransition";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { SetupScreen } from "@/components/onboarding/SetupScreen";
import { VoiceIntroScreen } from "@/components/onboarding/VoiceIntroScreen";
import { AccountModal } from "@/components/overlays/AccountModal";
import { MultiplayerModal } from "@/components/overlays/MultiplayerModal";

function GameApp() {
  const {
    saveState,
    gameMode,
    overlay,
    updateProfile,
    updateSettings,
    hasSaveData,
    dismissedDays,
  } = useGame();

  const [onboardingStep, setOnboardingStep] = useState<
    "welcome" | "setup" | "voice" | "done"
  >(hasSaveData ? "done" : "welcome");

  // Onboarding sequence
  if (onboardingStep === "welcome") {
    return (
      <WelcomeScreen
        hasExistingSave={hasSaveData}
        onBeginNew={() => setOnboardingStep("setup")}
        onResume={() => setOnboardingStep("done")}
      />
    );
  }

  if (onboardingStep === "setup") {
    return (
      <SetupScreen
        initialTargetLang={saveState.targetLanguage}
        initialLevel={saveState.cefrLevel}
        initialInterfaceLang={saveState.interfaceLanguage}
        onComplete={(target, level, iface, name) => {
          updateProfile(target, level, iface, name);
          setOnboardingStep("voice");
        }}
      />
    );
  }

  if (onboardingStep === "voice") {
    return (
      <VoiceIntroScreen
        onFinish={(voiceEnabled) => {
          updateSettings({ voiceEnabled });
          setOnboardingStep("done");
        }}
      />
    );
  }

  return (
    <>
      <main
        className={`relative w-screen h-screen h-[100dvh] overflow-hidden ${
          saveState.settings.dyslexicFont ? "font-dyslexic" : ""
        }`}
      >
        {/* 1. Persistent 3D World Canvas */}
        <WorldCanvas />

        {/* 2. Persistent HUD Layer (HUD area ≤ 18% viewport, non-blocking) */}
        <div
          className={`absolute inset-0 pointer-events-none p-2 sm:p-5 flex flex-col justify-between select-none ${
            gameMode === "conversation" ? "sm:pr-[400px]" : ""
          }`}
        >
          {/* Top Bar: Journey Strip (Left) & Menu Cluster (Right) */}
          <div>
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div className="min-w-0 pointer-events-auto">
                <JourneyStrip />
              </div>
              <div className="pointer-events-auto">
                <MenuCluster />
              </div>
            </div>
            {gameMode === "world" && (
              <div className="pointer-events-auto mt-2">
                <ObjectiveCard />
              </div>
            )}
          </div>

          {/* Bottom Bar: Phrase Tray (Left) & Controls Hint (Right) in World Mode */}
          {gameMode === "world" && (
            <div className="flex items-end justify-between gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              <div className="pointer-events-auto ml-auto sm:ml-0">
                <PhraseTray />
              </div>
              <div className="hidden sm:block pointer-events-auto">
                <ControlsHint />
              </div>
            </div>
          )}
        </div>

        {/* 3. Conversation Dock (In Conversation Mode, ≤ 34% viewport height) */}
        {gameMode === "conversation" && <DialogueDock />}

        {/* 4. Slide-in Feedback Card */}
        <FeedbackCard />

        {/* 5. Chapter Transition cinematic title card */}
        <ChapterTransition />

        {/* 6. Overlays */}
        {overlay === "journey" && <JourneyModal />}
        {overlay === "journal" && <JournalModal />}
        {overlay === "settings" && <SettingsModal />}
        {overlay === "help" && <HelpModal />}
        {overlay === "account" && <AccountModal />}
        {overlay === "multiplayer" && <MultiplayerModal />}
      </main>

      {/* Day Modals — rendered outside main to avoid overflow-hidden/z-index issues */}
      {saveState.completedDays.includes(saveState.currentDay) &&
        !dismissedDays.includes(saveState.currentDay) &&
        (saveState.currentDay >= 7 ? <FinalRecapModal /> : <DaySummaryModal />)}
    </>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
