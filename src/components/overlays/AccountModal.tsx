"use client";

import React from "react";
import { X } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { AccountAccess } from "@/components/onboarding/AccountAccess";

export const AccountModal: React.FC = () => {
  const { setOverlay } = useGame();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
        className="w-full max-w-xl rounded-3xl border border-line paper-glass-strong p-5 shadow-e2 sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="account-title" className="text-xl font-bold text-ink">Your account</h2>
            <p className="mt-1 text-sm text-muted">Sync your saved game and connect with a tutor or student.</p>
          </div>
          <button
            type="button"
            onClick={() => setOverlay(null)}
            aria-label="Close account"
            className="rounded-full p-2 text-muted hover:bg-sand hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <AccountAccess />
      </section>
    </div>
  );
};
