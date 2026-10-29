# LanguaVoya — Learn the language. Live the experience.

A browser-based, 3D life-simulation game for adults learning a language. Players explore a stylized connected neighbourhood, meet recurring characters, and complete everyday tasks through contextual conversations in French, Spanish, Italian, or English.

## Features Built According to Specification

- **3D Stylized Diorama World (Three.js)**:
  - 5 connected locations: **Apartment** (courtyard), **Grocery Store** (l'épicerie with crates & awning), **Transit Stop** (bus shelter), **Café** (terrace bistro), and **Community Hall** (illuminated with party lights).
  - Daytime lighting shifts: warm golden-hour key light, cool lilac fill, dusk with glowing string lights on Day 6, and crisp morning light on Day 7.
  - Interactive low-poly NPCs (Mme Laurent, Étienne, Lucas, Camille, Sofia) with proximity indicators and floor rings.
  - Third-person follow camera with smooth damping and automatic over-the-shoulder framing during conversations.
  - Movement controls: **Click / Tap to move** (with ground ripple effect) + **WASD / Arrow keys**.

- **Conversation System**:
  - Dock capped at ≤ 34% of viewport height (bottom sheet on mobile).
  - Dual text & voice input parity with live audio amplitude waveform and editable voice transcripts.
  - Native Web Speech API Text-to-Speech (TTS) with 0.75× slow replay option (`🐢`).
  - **3-step Hint Ladder** (Clue → Phrase fragments → Full model reply with "Use this" button) — never penalises the player.
  - In-world recasts and gentle correction chips (`✦ More polite: je voudrais`).
  - Slide-in post-conversation feedback cards.

- **7-Day Narrative Arc**:
  - Day 1: Arrival & Welcome (meet Mme Laurent, introduce yourself, receive apartment key)
  - Day 2: Groceries & Dinner Supplies (order apples and bread from Étienne, ask price, pay)
  - Day 3: Getting Around (transit shelter, ask routes and buy bus ticket)
  - Day 4: Café Culture (order at terrace, small talk with Camille, request bill)
  - Day 5: Everyday Problems (describe plumbing leak to Mme Laurent, arrange repair)
  - Day 6: Social Life (evening neighbourhood gathering at Community Hall under string lights)
  - Day 7: Autonomous Journey & Final Learning Recap

- **Journal & Spaced Review**:
  - **Phrases tab**: status tracking ("Needs practice", "Comfortable"), search, bookmarking, and "Use it tomorrow" queue.
  - **Conversations tab**: full replayable transcripts with audio speech buttons.
  - **Reflections tab**: before/after language tips.
  - **Journey tab**: milestone tracker.

- **Backend & AI Architecture**:
  - Server-side route handler `/api/dialogue/turn`.
  - Seamless Gemini API integration (`gemini-1.5-flash` / `gemini-2.0-flash`) with bounded character behavior.
  - Built-in contextual dialogue fallback engine that functions 100% offline out-of-the-box even without an API key.
  - Optional Supabase email/password accounts, private tutor/student invite codes, realtime roleplay turns, and per-account cloud saves.
  - Guests can continue to play with progress stored locally in the current browser.

## Accounts and tutor roleplay (local setup)

1. Create a Supabase project and add its URL and anon/publishable key to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   GEMINI_API_KEY=your-server-side-gemini-api-key
   GEMINI_MODEL=gemini-2.5-flash-lite
   ```
2. Apply `supabase/migrations/20261029000000_accounts_and_roleplay.sql` in the Supabase SQL editor or with the Supabase CLI.
3. Enable email/password sign-in in Supabase Auth. For local testing, configure email confirmation to match your desired signup flow.
4. Start the app with `npm run dev`. Register or sign in, then use the people icon or **Tutor roleplay** button to create or join a private invitation.

Roleplay messages support text and spoken turns through browser speech recognition; message playback uses browser text-to-speech. Browser speech recognition support and microphone permission vary by browser. This MVP does not provide a live audio/video call.

## Deploying a public MVP

1. **Prepare the production services.** Create the production Supabase project, apply the migration above, enable email/password auth, and set the production Site URL plus allowed redirect URLs in Supabase Auth. Keep the Supabase anon/publishable key scoped by the migration's row-level security policies.
2. **Configure environment variables.** Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, and (if needed) `GEMINI_MODEL` to the hosting provider's production environment settings. The Gemini key is server-only: do not prefix it with `NEXT_PUBLIC_` or commit `.env.local`.
3. **Publish the source to a Git provider** and import the repository into a Next.js host such as Vercel. Use the repository root as the project root, `npm run build` as the build command, and the default Next.js output settings.
4. **Deploy a preview first.** Test guest onboarding, email registration/confirmation, sign-in/sign-out, save reload across a new browser session, creating and joining a roleplay from two separate accounts, realtime messages, voice permission denial/support, and each day-selection path.
5. **Resolve release checks before public launch.** Run `npm ci` and `npm run build`; configure a non-interactive lint/test command (the current `npm run lint` asks for ESLint setup). Review and update the production dependencies flagged by `npm audit --omit=dev`, then repeat the build and audit.
6. **Promote the verified preview** to the production domain, add that domain to the Supabase Auth URL allowlist, and re-test account confirmation and roleplay invitations on the production URL.

The app falls back to local guest saves when Supabase is not configured. That fallback is useful for demos, but cross-device saves and tutor sessions require the production Supabase setup. Configure and test a production Gemini key for open-ended AI dialogue; without it, the built-in dialogue sequences are available as an offline fallback.

## Running Locally

To run it locally:
```bash
npm run dev
# or
npm run build
npm run start
```

If you want to run the dev server alongside a production build on Windows, set a separate Next.js output directory first:
```powershell
$env:NEXT_DIST_DIR = ".next-dev"
npm run dev
```
