# Positive Checklist — Phase 1 MVP: Core UI/UX Design

*Date: 2026-08-14*
*Scope: Phase 1 from `concept-and-tech-stack.md` — Big Goals, Tiny Tasks, and the completion interaction. Gamification (streaks/glow meters/heatmap), the guided goal-wizard, and any backend/sync are explicitly out of scope for this spec.*

## Goal

Get the core loop — create a Big Goal, add Tiny Tasks under it, check them off, feel good doing it — running as a real app on a phone via Expo Go, with enough UX polish that the "feels good" differentiator is actually testable, not just described.

## Prototype constraints (deliberate, for this phase)

- **No EAS / App Store work yet.** This is a prototype build, run via `npx expo start` and Expo Go on a device/simulator.
- **No persistence yet.** State lives in a Zustand store, in memory only. Data resets on reload. MMKV persistence is a planned swap for a later phase (it requires a custom EAS dev client, which we're deferring).

## Information architecture & navigation

Built with **Expo Router** (file-based routing — Expo's current default, matches this tab/stack/modal shape with minimal config).

```
Tab bar: [Goals] [Today]

Goals tab
  Goals list (home) — Big Goal cards (name, color, icon, tiny-win count)
    → tap card → Goal detail — that goal's Tiny Task list, checkable,
                                 completed tasks sink to the bottom
    → "+" (FAB) → Add Goal (bottom sheet: name, color, icon)
    → within Goal detail, "+" → Add Task (bottom sheet: text, day tags)

Today tab
  Flat list of tasks eligible for today, pulled across all goals:
    (scheduledDays is empty/null OR includes today's day-of-week)
    AND not already completed today
  Each row tagged with its goal's color/icon + name so origin is clear.
  Checking a task off here completes it in place — same store, same
  completion animation as Goal detail.
```

File structure:

```
app/
  (tabs)/
    goals/
      index.tsx          # Goals list
      [goalId].tsx        # Goal detail (task list)
    today.tsx
  goal/new.tsx             # Add Goal modal
  task/new.tsx              # Add Task modal (goalId param)
components/
  GoalCard.tsx
  TaskRow.tsx               # includes the completion animation
  DayPicker.tsx
  ColorPicker.tsx
store/
  useAppStore.ts            # Zustand: goals, tasks, completions + actions
lib/
  today.ts                  # derived-state helpers (isCompletedToday, isScheduledToday, etc.)
```

### Empty states

Empty states are part of this app's tone, not an afterthought — "nothing to do" should read as calm, not broken:

- **No goals yet** (first launch): friendly prompt + prominent "+" to create the first Big Goal. No onboarding wizard in this phase — a single well-written empty state is enough.
- **Goal with no tasks yet**: prompt to add the first Tiny Task, framed encouragingly ("What's one small thing?" rather than "No tasks found").
- **Today, everything done / nothing scheduled**: calm affirming message (e.g. "That's everything scheduled for today — anything else is a bonus."), never an empty gray void.

## Data model

```typescript
type DayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

interface Goal {
  id: string;
  name: string;
  color: string;        // hex from curated palette, see Visual Style
  icon: string;          // identifier from curated icon/emoji set
  createdAt: string;     // ISO timestamp
}

interface Task {
  id: string;
  goalId: string;
  text: string;
  createdAt: string;
  scheduledDays: DayOfWeek[] | null;  // null/empty = overarching, always eligible
  lastCompletedAt: string | null;      // ISO date (day-level) — is it done "today"?
}

interface CompletionEvent {
  id: string;
  taskId: string;
  goalId: string;        // denormalized for fast per-goal queries later (streaks, heatmap)
  completedAt: string;   // ISO timestamp
}
```

Key points:

- **"Completed today" is derived**, not a stored boolean: a task is complete-for-today when `lastCompletedAt` falls on today's local date. Unchecking a task clears `lastCompletedAt` and removes the matching `CompletionEvent`. No reset job needed — "today" is just a date comparison at render time, which is what makes the recurring-task model work with zero background jobs.
- **Tasks are recurring**, not one-off: a Task is a reusable item (e.g. "vacuum one room"). Completing it logs a `CompletionEvent` and the task becomes available again the next day. `CompletionEvent` is the append-only log that later features (per-goal streaks, calendar heatmap — both out of scope here) will read from, so it's included now even though nothing consumes it yet beyond driving "completed today."
- **`scheduledDays: null`** = overarching/always-eligible. A non-empty array tags a task to specific day(s) of the week. Day tags only filter what the **Today** tab surfaces — a scheduled task is still fully visible and completable from its Goal detail screen on any day. This is a scheduling hint, not a deadline: there is no "overdue" state anywhere in the app.
- **Zustand store** holds `goals: Goal[]`, `tasks: Task[]`, `completions: CompletionEvent[]` as flat, denormalized arrays — no persistence in this phase, filtering is plain `.filter()`.

## Visual style — "Muted Earth"

Locked in via mockup review. Deeper, desaturated warm neutrals — clay, olive, mauve — calmer and more grown-up than a brighter pastel palette.

**Base surfaces**

| Token | Hex | Use |
|---|---|---|
| App background | `#F0EAE2` | Screen background |
| Card/row surface | `#FBF8F3` | Task rows, bottom sheet, inputs' container |
| Border | `#E3D8C8` | Row borders, input borders, bottom-sheet drag handle |
| Primary text | `#4A4038` | Headings, primary labels |
| Secondary text | `#8A7F72` / `#9A8E7D` | Metadata, placeholders, captions |
| Primary accent | `#8A6B4F` | FAB, primary buttons, default checkbox ring |

**Curated goal-color palette** (picked at goal creation; each has a card-tint and a deeper text/icon shade):

| Name | Card tint | Text/icon shade |
|---|---|---|
| Clay | `#D8C3B0` | `#6B4E36` |
| Olive | `#C7CBB8` | `#5B6444` |
| Mauve | `#C9B8B0` | `#7A4F44` |
| Dusty Blue | `#B9C4CC` | `#4F6B7A` |
| Honey | `#D9C48A` | `#8A6F2A` |
| Rose Clay | `#D9B3AE` | `#8A5850` |
| Sage | `#B8C4A8` | `#5F7048` |
| Taupe Plum | `#C4B8C7` | `#6E5A72` |

**Typography**: iOS system font (San Francisco) — no custom font for the prototype. Rough scale: page title 22px/700, card title 15px/600, body/task text 13.5px/400, secondary/caption 12px, uppercase section label 11px with `0.04em` letter-spacing.

**Shape & spacing**: consistently rounded — 16px radius on goal cards, 12px on task rows/buttons/bottom sheets, 10px on inputs, fully circular checkboxes and the FAB. Soft, low-opacity shadows instead of hard borders on cards. Generous padding throughout — the list should never feel dense.

**Completed task styling**: checkbox fills with the goal's deeper shade and shows a checkmark in the background color; task text gets a soft strikethrough (`text-decoration-color: #B8AC9C`) and dims slightly (`opacity: 0.55` on the row) rather than disappearing — visible proof of progress, not a hidden state.

## Completion interaction

The single most important moment in the app. On tapping a task's checkbox, four things fire together as one ~400–600ms beat (not sequentially):

1. **Checkbox pop** — Reanimated scale/spring animation with a checkmark draw-on.
2. **Haptic tap** — `expo-haptics` light impact, fired simultaneously with the visual.
3. **Confetti burst** — small Lottie animation layered near the tapped row (not full-screen).
4. **Tap sound** — short satisfying sound via `expo-av`.

Un-completing (tapping an already-checked task) is a plain, quiet state change — no animation/haptic/sound reversal fanfare, so undo doesn't feel like a punishment or a second event worth celebrating.

## Add Goal / Add Task flow

Both use a **bottom sheet modal** (slides up over the current screen, doesn't navigate away):

- **Add Goal**: name field, color picker (8 swatches above), icon picker — a curated grid of ~16 emoji (🏡🤝🚶💪🧘🎨📚💰🌱🐾✍️🍳🧹💤🌿✨), matching the emoji used in the mockups. A custom icon library is a possible later polish, not needed for this phase. "Create Goal" button in the primary accent color.
- **Add Task**: text field, day-of-week picker (7 toggle chips, Su–Sa; none selected = overarching). Scheduled tasks show a small day-chip badge on their row in Goal detail.

## Testing / verification approach

This phase is UX-first, so verification leans on actually running the app:

- Use the `run` skill to launch the Expo dev server and walk through the real flows on-device/simulator: create a goal, add tasks (with and without day tags), complete/uncomplete a task, confirm Today tab filtering (scheduled-today + overarching, excluding already-completed), and check all three empty states.
- Unit tests for `lib/today.ts` (the derived-state helpers: `isCompletedToday`, `isScheduledToday`, Today-list filtering) — pure date/day-of-week logic is easy to get subtly wrong (timezone edges, week boundaries) and is cheap to cover directly.
- No unit/integration test coverage planned for animation/haptic/sound polish itself — that's judged by feel, not assertions.

## Out of scope for this phase

Explicitly deferred to later phases per `concept-and-tech-stack.md`:

- Per-goal streaks, glow meter, calendar heatmap, monthly recap.
- The guided goal-wizard (decision-tree flow, curated task bank).
- MMKV persistence, EAS dev client, onboarding flow, app icon/branding, accessibility pass, App Store assets.
- Android testing (same codebase, but not a target for this phase).

## Open questions for later phases

- Whether "Today" needs its own empty/celebration state distinct from the per-goal one once streaks exist.
- Timezone handling for `scheduledDays`/`lastCompletedAt` once the app has real multi-day usage to observe (assumed device-local date for this phase).
