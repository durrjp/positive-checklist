# Positive Checklist — Daily Goals Refactor: Design

*Date: 2026-08-17*
*Branch: `daily-goals-refactor`*
*Supersedes the Big Goals → Tiny Tasks model from `2026-08-14-phase1-mvp-ui-ux-design.md` for all future work. That doc is kept for history, not as a current source of truth.*

## Why

Big Goals (persistent life-area containers) risked exactly the failure mode the app exists to avoid: getting lost in a big, vague goal and losing track of what to actually do *today*. The fix is to shrink scope — goals only ever exist for today or tomorrow, planned the night before or morning of, completed by end of day. Small horizon, high satisfaction, no long-lived structure to get lost in.

## Core model change

- **Drop the two-tier Goal → Task hierarchy entirely.** One flat entity: a daily goal.
- **A goal can only be scheduled for "today" or "tomorrow."** No recurring tasks, no day-of-week scheduling, no "overarching" concept — all of that goes away with the parent Big Goal it was attached to.
- **No cap on how many goals per day.**
- **Rollover is derived, not a background job.** A goal's `forDate` is a fixed calendar date. "Today" and "Tomorrow" are just `forDate === todayString` / `forDate === tomorrowString` comparisons at render time — what was "tomorrow" automatically becomes "today" once the date rolls, with zero migration step.
- **Incomplete goals silently archive.** Once a goal's date is in the past, it no longer matches either bucket and disappears from the main screen — no guilt, no carryover prompt. It's still in the store/history, just not surfaced.

## Data model

```typescript
interface DailyGoal {
  id: string;
  text: string;
  emoji: string | null;   // optional, from the existing 16-emoji curated set
  forDate: string;        // local date string, e.g. "2026-08-17" — the only scheduling concept
  createdAt: string;      // ISO timestamp
  completedAt: string | null;  // ISO timestamp; null = not done
}
```

Notes:

- No `CompletionEvent` log in this model — completion is just `completedAt` on the goal itself, since goals are one-off (not recurring), so there's nothing to derive "completed today" from separately.
- No `color` field — simplifying to text + optional emoji only (dropping `ColorPicker`/`goalColorPalette` from the old model).
- Zustand store: single `dailyGoals: DailyGoal[]` array, flat, no persistence (same in-memory-only constraint as before).

## Screen & navigation

**Single screen, no tabs.** Two sections on one scrollable screen:

```
Today
  — goals where forDate === today, completion interaction live here
  — completed goals sink to the bottom, checked, same visual treatment as before

Tomorrow
  — goals where forDate === tomorrow, for planning ahead
  — no completion interaction here (can't complete a goal that isn't today yet)

"+" → Add Goal modal (text, emoji picker, Today/Tomorrow toggle — defaults to Today)
```

A separate, simple **History** screen (read-only) lists past days' goals (text + whether completed), reachable from the main screen but not part of the primary loop.

File structure (replacing the old `app/(tabs)/...` tree):

```
app/
  index.tsx              # single main screen: Today + Tomorrow sections
  history.tsx             # read-only past-days list
  goal/new.tsx             # Add Goal modal (text, emoji, Today/Tomorrow toggle)
components/
  DailyGoalRow.tsx         # completion interaction, replaces TaskRow
  EmojiPicker.tsx          # renamed/reused from IconPicker
store/
  useAppStore.ts            # dailyGoals: DailyGoal[] + actions
lib/
  dailyGoals.ts              # getTodayGoals, getTomorrowGoals, getPastGoals, sortCompletedLast
```

Removed entirely: `GoalCard.tsx`, `ColorPicker.tsx`, `DayPicker.tsx`, `goalColorPalette`, the `(tabs)` navigator, the Goals list/detail screens, `scheduledDays`/day-of-week logic.

Kept as-is: `ConfettiBurst.tsx`, the completion interaction (checkbox pop + haptic + confetti + tap sound, fired together, ~400–600ms), theme tokens (Muted Earth palette/typography), the 16-emoji curated set, the bottom-sheet modal pattern, "no automated UI-screen tests" policy, empty-state tone.

## Empty states

- **Today, nothing planned**: calm prompt to add today's first goal.
- **Today, everything done**: affirming message, not a void — echoes the old Today-tab empty state.
- **Tomorrow, nothing planned yet**: light prompt, lower emphasis than Today's empty state (it's optional planning, not a gap).
- **History, no past days yet**: simple "nothing here yet" message.

## Out of scope (unchanged from before, still deferred)

Streaks/glow meter/heatmap, the guided goal-wizard, MMKV persistence, EAS/App Store work, onboarding, accessibility pass, Android testing.

## Open questions for later

- Whether History needs any structure beyond a flat reverse-chronological list once there's real multi-week usage to look at.
- Timezone handling for `forDate` (assumed device-local date, same assumption as the old `scheduledDays`/`lastCompletedAt` model).
