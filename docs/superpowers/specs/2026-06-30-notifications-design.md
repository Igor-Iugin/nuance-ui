# Notifications — Design

Imperative notification (toast) system for nuance-ui, mirroring the `modals/`
architecture: a global singleton store driven from any context, a provider that
renders active notifications, auto-close with pause-on-hover, a queue with a
limit, six positions, transitions, a progress bar, and accessibility
announcements.

## Goals

- Imperative API usable outside of `setup`: `$notifications.show({ ... })`.
- Mantine-level ergonomics combined with Nuxt/Reka-style content flexibility
  (string or VNode content, action buttons).
- Architecture and conventions consistent with the existing `modals/` feature.

## Non-goals (v1)

- Swipe / drag / scroll to dismiss.
- Hotkey viewport focus (F8).
- Multiple store instances. A single global singleton, like `$modals`.

## File structure

```
src/runtime/notifications/
├── index.ts                      — public exports ($notifications, provider, types)
├── notifications-store.ts        — singleton store class
├── notifications-provider.vue    — root: 6 popover viewports, grouping, transitions
├── notification-container.vue    — per-notification wrapper: timer, pause, progress
├── use-notifications.ts          — composable returning reactive store state
└── types.ts                      — NotificationData, NotificationPosition, etc.
```

Edits to existing files:

- `src/runtime/components/notification.vue` — rename `description` prop/slot to
  `message`; widen `title`/`message` to `StringOrVNode`; add `actions` block with
  `vertical`/`horizontal` orientation (nuxt-ui style) and an `#actions` slot.
- `src/runtime/types/index.ts` — add `StringOrVNode`.
- `src/module.ts` — add `@nui/notifications` alias.

This mirrors `modals/`: store-class + singleton (`modal-manager.ts`),
`*-provider.vue`, `use-*.ts`, `index.ts`, `types.ts`.

## Types

Add to `src/runtime/types/index.ts`:

```ts
/** String, VNode, or a render function producing a VNode. */
export type StringOrVNode = string | VNode | (() => VNode)
```

In `notifications/types.ts`:

```ts
type NotificationPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

interface NotificationAction extends ButtonProps {
  /** Action button label */
  label: string
  /** Click handler */
  onClick?: (event: MouseEvent) => void
}

/** Argument of `$notifications.show()`. */
interface NotificationInput extends Omit<NotificationProps, 'title' | 'message'> {
  /** Stable id. Reusing an existing id updates that notification in place. */
  id?: string
  title?: StringOrVNode
  message?: StringOrVNode
  /** Action buttons rendered via the `Button` component. */
  actions?: NotificationAction[]
  /** Actions/close layout. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal'
  /** Overrides the provider position. */
  position?: NotificationPosition
  /** Overrides the provider auto-close. `false` keeps it open. */
  autoClose?: number | false
  onClose?: (id: string) => void
  onOpen?: (id: string) => void
}

/** Stored notification — always has an id. */
interface NotificationData extends NotificationInput {
  id: string
}
```

`NotificationProps` (from `notification.vue`) already provides `color`, `radius`,
`icon`, `loading`, `withBorder`, `withCloseButton`, `closeButtonProps`,
`loaderProps`, `classes`; inherited via `extends`.

## Store (`$notifications`)

Singleton class `NotificationsStore`, same pattern as `ModalManager`:
`globalThis` guard, `markRaw`, reactive state.

```ts
interface NotificationsState {
  notifications: NotificationData[]   // visible (<= limit)
  queue: NotificationData[]           // waiting
  limit: number
  defaultPosition: NotificationPosition
}

class NotificationsStore {
  readonly state: NotificationsState  // reactive

  /** Shows a notification (or queues it past the limit). Returns its id. */
  show(data: NotificationInput): string
  /** Removes one notification and pulls the next from the queue. */
  hide(id: string): void
  /** Updates a notification in place (e.g. loading -> success). No-op if absent. */
  update(id: string, data: Partial<NotificationInput>): void
  /** Clears everything (visible + queue). */
  clean(): void
  /** Clears the queue only. */
  cleanQueue(): void
  /** Patches store state (limit / defaultPosition). Used by the provider. */
  updateState(fn: (s: NotificationsState) => NotificationsState): void
}

export const $notifications = markRaw(NotificationsStore.instance)
```

Behavior:

- `show` beyond `limit` → pushed to `queue`. `hide` frees a slot → FIFO pull from
  `queue` into `notifications`.
- `show` with an existing `id` → update-in-place semantics (re-show updates the
  existing notification rather than duplicating).
- `update` of an unknown id → no-op.
- `id` generation: caller-provided `id`, else a generated unique id.
- The provider calls `updateState` on mount to push its `limit` / `position`.

## notification.vue changes

- Rename `description` → `message` (prop, slot, internal styles class
  `description` may stay as a CSS class name; the public prop/slot is `message`).
- `title` and `message` become `StringOrVNode`. Render: string → text;
  VNode/function → `<component :is>` (nuxt-ui Toast pattern).
- Add an `actions` region:
  - `vertical` orientation → actions under the body.
  - `horizontal` orientation → actions next to the close button.
  - Rendered via the project `Button` component (`components/button/button.vue`),
    one per `NotificationAction`, forwarding `ButtonProps` and `onClick`.
  - `#actions` slot overrides the default action rendering.

## Provider (`notifications-provider.vue`)

Props:

```ts
interface NotificationsProviderProps {
  /** Default notification position. @default 'bottom-right' */
  position?: NotificationPosition
  /** Auto-close in ms, or `false` to disable. @default 4000 */
  autoClose?: number | false
  /** Max visible at once; extra go to the queue. @default 5 */
  limit?: number
  /** Viewport z-index. @default 400 */
  zIndex?: number | string
  /** Container width. @default 440 */
  containerWidth?: number | string
  /** Transition duration in ms. @default 250 */
  transitionDuration?: number
  /** Which notifications pause auto-close on hover. @default 'all' */
  pauseOnHover?: 'all' | 'notification'
  classes?: Classes<'root' | 'notification'>
}
```

- On mount: `$notifications.updateState` with `limit` and `defaultPosition: position`.
- Renders six viewports, one per position. Each viewport is a native
  `<div popover="manual">` placed in the browser top-layer:
  - `.showPopover()` called on mount (popover needs an explicit show).
  - Default popover UA styles reset: `inset: auto`, `margin: 0`, `border: 0`,
    `padding: 0`, `background: transparent`, `overflow: visible`. Position set
    via `position: fixed` corner offsets per the viewport's position.
  - Top-layer guarantees notifications render above modals and any `z-index`.
- Notifications grouped by `position ?? defaultPosition` (Mantine
  `getGroupedNotifications`-style).
- `TransitionGroup` inside each viewport for enter/leave/move animations.
  Direction depends on position (top → from top, bottom → from bottom,
  left/right → from the side), built on the existing `transition.vue` CSS
  conventions.

## Container (`notification-container.vue`)

Props: `data: NotificationData`, `autoClose`, `transitionDuration`, `paused`.
Emits: `hide(id)`, `hoverStart`, `hoverEnd`.

- Timer: `setTimeout(() => emit hide, resolvedAutoClose)`.
  `resolvedAutoClose = getAutoClose(globalAutoClose, data.autoClose)` — a Mantine
  helper: a number on `data` wins; `false` on either disables.
- Pause: `mouseenter` → cancel timer + `hoverStart`; `mouseleave` → restart +
  `hoverEnd`. `pauseOnHover: 'all'` → provider broadcasts `paused` to every
  container on any hover; `'notification'` → only the hovered one pauses.
- Progress bar: a `requestAnimationFrame` tick maintains `remaining`; rendered as
  `<Progress :model-value="remaining / total * 100">` absolutely positioned at
  the bottom of the notification root. Only when `autoClose` resolves to a number.
- Lifecycle callbacks: `onOpen` on mount, `onClose` on hide.
- Wraps `<Notification v-bind="notificationProps" @close="emit hide">`.

## Accessibility

- Each viewport: `role="region"`, `aria-label="Notifications"`,
  `aria-live="polite"`, `aria-atomic="false"`.
- `notification.vue` already sets `role="alert"`; kept.
- The live region announces new notifications to screen readers.

## Public exports (`index.ts`)

```ts
export { $notifications } from './notifications-store'
export { default as NNotificationsProvider } from './notifications-provider.vue'
export { useNotifications } from './use-notifications'
export type * from './types'
```

Consumer usage (mirrors modals):

```vue
<!-- layout -->
<NNotificationsProvider position="top-right" />
```

```ts
$notifications.show({ title: 'Saved', message: 'Changes stored.', color: 'green' })
```

## Testing

- Store: `show`/`hide`/`update`/`clean`/`cleanQueue` transitions; limit/queue
  FIFO; duplicate-id updates in place; `update` of unknown id is a no-op.
- `getAutoClose` resolution matrix (number/false at data vs global).
- Container timer + pause: timer cancels on hover, restarts on leave; progress
  reflects remaining; no timer when `autoClose === false`.
- Provider: grouping by position; `updateState` on mount; viewport
  `.showPopover()` called.
- notification.vue: `StringOrVNode` rendering (string vs VNode vs function);
  actions render via `Button`; `#actions` slot override; orientation layout.
```

