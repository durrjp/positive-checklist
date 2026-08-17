# Little Wins — CLAUDE.md

## What this is

A React Native/Expo prototype, branded "Little Wins" (repo folder name `positive-checklist` is unrelated — don't rename the folder, just know the app name diverges from it). See `concept-and-tech-stack.md` for the full concept and tech-stack rationale.

**Current model (as of the `daily-goals-refactor` branch):** flat daily goals only, each scoped to "today" or "tomorrow" — no persistent Big Goal containers, no recurring/day-of-week scheduling. See `docs/superpowers/specs/2026-08-17-daily-goals-refactor-design.md` for the current data model and screens. The earlier "Big Goals → Tiny Tasks" hierarchy (`docs/superpowers/specs/2026-08-14-phase1-mvp-ui-ux-design.md`, branch `phase1-mvp-ui-ux`) is superseded — don't build against it.

## Stack

- Expo (managed workflow) + Expo Router (file-based routing) + TypeScript
- Zustand for state — in-memory only, no persistence yet (MMKV persistence is a deferred later phase)
- React Native Reanimated + Gesture Handler for the completion animation
- expo-haptics, expo-av for haptic/tap-sound feedback on completion
- Visual style: "Muted Earth" palette — exact tokens in `theme/colors.ts`, documented in the design spec

## Conventions

- **No automated tests for UI screens** — this is a deliberate, explicit project rule, not an oversight. Reviewers have flagged this before; the ruling each time is to keep it. Pure logic (`lib/`, `store/`) does get unit tests.
- **Derived state over stored booleans.** "Completed today," "scheduled today," etc. are computed from raw data at render time (date/array comparisons), not cached as flags — this is what lets the app avoid any background/reset jobs.
- Custom Reanimated-based confetti burst, not Lottie — a deliberate architecture decision, not a placeholder.
- Tap sound is synthesized by a Node script (`scripts/generate-tap-sound.js`) into a WAV file, not a downloaded asset.
- Branch naming: plain feature branches (not worktrees) checked out directly in this repo folder, so progress is visible in the already-open editor — this is a standing preference, not a one-off.
- Git branch base is `main` (not `master`).

## Known gotcha: Expo Router + web

Expo Router's web build resolves routes by URL, unlike native which just opens the first tab/screen by default. Any navigator group (e.g. a route group folder) needs an explicit route file that maps to its own bare path, or visiting that path on web renders Expo Router's "Unmatched Route" fallback screen even though native works fine. If you restructure navigation, double check the web preview (`npx expo start --web`) actually resolves `/`, not just that `tsc`/the Metro bundle compiles cleanly — bundle success does not prove runtime route matching.

## Running it

See `README.md` for dev server start instructions and troubleshooting.
