"use client";

import React, { FormEvent, useState } from "react";
import { useGame } from "@/context/GameContext";

export const AccountAccess: React.FC = () => {
  const {
    accountEmail,
    accountLoading,
    accountError,
    accountMessage,
    cloudSaveError,
    supabaseConfigured,
    signIn,
    signUp,
    signOut,
  } = useGame();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const success =
      mode === "sign-in"
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);
    if (success) setPassword("");
  };

  if (accountEmail) {
    return (
      <div className="w-full rounded-2xl border border-line bg-paper/70 p-4 text-left">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-lagoon">Account connected</div>
            <div className="truncate text-sm font-semibold text-ink">{accountEmail}</div>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="shrink-0 rounded-xl border border-line px-3 py-2 text-xs font-bold text-ink hover:bg-sand"
          >
            Sign out
          </button>
        </div>
        {accountMessage && <p className="mt-2 text-xs text-lagoon">{accountMessage}</p>}
        {cloudSaveError && <p role="alert" className="mt-2 text-xs text-danger">{cloudSaveError}</p>}
        {accountError && <p role="alert" className="mt-2 text-xs text-danger">{accountError}</p>}
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-line bg-paper/70 p-4 text-left">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-ink">Save your journey</div>
          <div className="text-[11px] text-muted">Create an account to continue on another visit or device.</div>
        </div>
        {supabaseConfigured && (
          <button
            type="button"
            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
            className="shrink-0 text-xs font-bold text-lagoon hover:underline"
          >
            {mode === "sign-in" ? "Create account" : "Sign in"}
          </button>
        )}
      </div>

      {supabaseConfigured ? (
        <form onSubmit={submit} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            aria-label="Email"
            className="min-w-0 rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-lagoon"
          />
          <input
            type="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password (8+ characters)"
            aria-label="Password"
            className="min-w-0 rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-lagoon"
          />
          <button
            type="submit"
            disabled={accountLoading}
            className="rounded-xl bg-lagoon px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
          >
            {accountLoading ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Register"}
          </button>
        </form>
      ) : (
        <p className="mt-2 text-xs text-muted">
          Account sign-in is not configured for this local build. Guest progress stays on this device.
        </p>
      )}
      {accountError && <p role="alert" className="mt-2 text-xs text-danger">{accountError}</p>}
      {accountMessage && <p className="mt-2 text-xs text-lagoon">{accountMessage}</p>}
      {cloudSaveError && <p role="alert" className="mt-2 text-xs text-danger">{cloudSaveError}</p>}
    </div>
  );
};
