# Positive Checklist

Phase 1 MVP prototype — Big Goals, Tiny Tasks, and the completion interaction.
See `concept-and-tech-stack.md` for the full concept and
`docs/superpowers/specs/2026-08-14-phase1-mvp-ui-ux-design.md` for the design spec.

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

If the server is healthy and you still see it, it's most likely that
`app/(tabs)/` is missing a route for the bare `/` path. Web routing is
URL-driven (unlike native, which just opens the first tab), so there must be
an `app/(tabs)/index.tsx` that resolves `/`, e.g. redirecting into the
default tab with `<Redirect href="/goals" />`.

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
lib/            Pure logic: date/today/selector helpers
theme/          Colors ("Muted Earth" palette) and typography tokens
scripts/        One-off asset-generation scripts (e.g. the tap sound)
```
