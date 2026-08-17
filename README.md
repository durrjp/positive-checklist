# Little Wins

*(project repo name: `positive-checklist` — the app itself is branded "Little Wins")*

A daily-goals prototype: plan a few small things for today or tomorrow, check
them off, feel good doing it. See `concept-and-tech-stack.md` for the original
concept and `docs/superpowers/specs/2026-08-17-daily-goals-refactor-design.md`
for the current design (the earlier "Big Goals / Tiny Tasks" spec is
superseded — see the note at the top of the concept doc).

## Running it

```bash
npm install
npx expo start --web
```

This starts the Metro dev server and opens the app in your browser at
**http://localhost:8081**. Leave that terminal running while you work —
edits to files under `app/`, `components/`, `store/`, `lib/`, and `theme/`
hot-reload automatically.

To view it on your phone instead of the browser:

```bash
npx expo start
```

then scan the QR code with the **Expo Go** app (iOS/Android). Note: data is
**in-memory only** in this phase — it resets whenever the app reloads,
on either web or a device.

## If the port is already in use

`npx expo start` refuses to run non-interactively when port 8081 is busy
(usually because a previous server is still running in another terminal
tab). Either:

- Close/reuse that existing terminal — the app is probably already being
  served there, or
- Kill whatever's on the port, then restart:
  ```bash
  # find and stop the process using port 8081, then re-run npx expo start
  ```

## If you see "Unmatched Route" / a blank "page could not be found" screen

Make sure the dev server is actually still running (`curl -I
http://localhost:8081/` from another terminal) — if it crashed, the browser
just shows a stale page and refreshing won't help; restart it with `npx expo
start --web -c`.

If the server is healthy and you still see it, it's most likely that some
route directory is missing a file that resolves the bare `/` path. Web
routing is URL-driven (unlike native), so every navigator needs an explicit
route mapped to its own root, or visiting that path renders Expo Router's
Unmatched Route fallback even though native works fine.

## Tests

```bash
npx jest          # unit tests for lib/ and store/
npx tsc --noEmit   # typecheck
```

## Project structure

```
app/            Expo Router screens (file-based routing)
components/     Reusable UI components
store/          Zustand store + data types
lib/            Pure logic: date + daily-goal derived-state helpers
theme/          Colors ("Muted Earth" palette) and typography tokens
scripts/        One-off asset-generation scripts (e.g. the tap sound)
```
