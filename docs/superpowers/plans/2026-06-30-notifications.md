# Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Imperative toast/notification system for nuance-ui — `$notifications.show({...})` from any context, rendered by `<NNotificationsProvider>`, with auto-close, pause-on-hover, queue+limit, six positions, progress bar, and a11y.

**Architecture:** Mirrors the existing `modals/` feature. A `globalThis`-backed singleton store (`NotificationsStore`) holds reactive state. A provider renders six native `popover="manual"` viewports (top-layer) grouped by position, each a `TransitionGroup`. A per-notification container owns the auto-close timer, hover-pause, and an rAF-driven progress bar, wrapping the pure `notification.vue` view component.

**Tech Stack:** Nuxt 4 module, Vue 3 `<script setup>`, TypeScript, CSS Modules, vitest + @vue/test-utils + happy-dom.

---

## File Structure

Create:
- `src/runtime/notifications/types.ts` — all notification types
- `src/runtime/notifications/lib.ts` — `getAutoClose`, `createId` helpers
- `src/runtime/notifications/notifications-store.ts` — singleton store class + `$notifications`
- `src/runtime/notifications/use-notifications.ts` — composable exposing reactive state
- `src/runtime/notifications/notification-container.vue` — timer/pause/progress wrapper
- `src/runtime/notifications/notifications-provider.vue` — 6 popover viewports
- `src/runtime/notifications/index.ts` — public exports

Test:
- `src/runtime/notifications/notifications-store.test.ts`
- `src/runtime/notifications/lib.test.ts`
- `src/runtime/notifications/notification-container.test.ts`
- `src/runtime/components/notification.test.ts`

Modify:
- `vitest.config.ts` — add `environment: 'happy-dom'`
- `src/runtime/types/index.ts` — add `StringOrVNode`
- `src/runtime/components/notification.vue` — `description`→`message`, `StringOrVNode`, `actions`
- `src/module.ts` — add `@nui/notifications` alias
- `src/runtime/components/notification.module.css` — actions styles (orientation)

---

## Task 0: Test environment

**Files:**
- Modify: `vitest.config.ts`

- [ ] **Step 1: Set happy-dom environment**

Replace the file contents of `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'


export default defineConfig({
	test: {
		environment: 'happy-dom',
		pool: 'forks',
	},
})
```

- [ ] **Step 2: Verify vitest runs with no tests**

Run: `pnpm test`
Expected: PASS — "No test files found" exits 0, OR runs cleanly. (If "no tests" errors, that is fine; the next task adds the first test.)

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "test: use happy-dom environment"
```

---

## Task 1: `StringOrVNode` type

**Files:**
- Modify: `src/runtime/types/index.ts:1-9`

- [ ] **Step 1: Add the type**

In `src/runtime/types/index.ts`, after the `MaybePromise` export (line 9), add:

```ts
/** String, VNode, or a render function producing a VNode. */
export type StringOrVNode = string | VNode | (() => VNode)
```

`VNode` is already imported at the top of the file.

- [ ] **Step 2: Typecheck**

Run: `pnpm test:types`
Expected: PASS (no new errors).

- [ ] **Step 3: Commit**

```bash
git add src/runtime/types/index.ts
git commit -m "feat: add StringOrVNode type"
```

---

## Task 2: Notification types

**Files:**
- Create: `src/runtime/notifications/types.ts`

- [ ] **Step 1: Write the types file**

```ts
import type { StringOrVNode } from '@nui/types'

import type { ButtonProps } from '../components/button/button.vue'
import type { NotificationProps } from '../components/notification.vue'


/** Notification placement on screen. */
export type NotificationPosition
	= | 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'

/** Actions/close layout. */
export type NotificationOrientation = 'vertical' | 'horizontal'

/** Action button rendered inside a notification. */
export interface NotificationAction extends ButtonProps {
	/** Button label */
	label: string
	/** Click handler */
	onClick?: (event: MouseEvent) => void
}

/** Argument of `$notifications.show()`. */
export interface NotificationInput extends Omit<NotificationProps, 'title' | 'message'> {
	/** Stable id. Reusing an existing id updates that notification in place. */
	id?: string
	/** Notification title */
	title?: StringOrVNode
	/** Notification body */
	message?: StringOrVNode
	/** Action buttons */
	actions?: NotificationAction[]
	/** Actions/close layout @default 'vertical' */
	orientation?: NotificationOrientation
	/** Overrides the provider position */
	position?: NotificationPosition
	/** Auto-close in ms, or `false` to keep open. Overrides the provider value */
	autoClose?: number | false
	/** Called after the notification is removed */
	onClose?: (id: string) => void
	/** Called once when the notification mounts */
	onOpen?: (id: string) => void
}

/** Stored notification — always has an id. */
export interface NotificationData extends NotificationInput {
	id: string
}

/** Reactive store state. */
export interface NotificationsState {
	/** Currently visible notifications (<= limit) */
	notifications: NotificationData[]
	/** Notifications waiting for a free slot */
	queue: NotificationData[]
	/** Max visible at once */
	limit: number
	/** Position used when a notification has none */
	defaultPosition: NotificationPosition
}
```

NOTE: `notification.vue` does not yet export `NotificationProps` with a `message`
field — Task 5 renames `description`→`message`. This file is type-only; run the
typecheck in Step 2 AFTER Task 5 if it fails here. To unblock, Task 5 must land
before `pnpm test:types` passes for this file. Tasks 2→5 are written so the
store/lib tests (Tasks 3-4) do not depend on `notification.vue` types.

- [ ] **Step 2: Typecheck (may defer to after Task 5)**

Run: `pnpm test:types`
Expected: PASS, or a single error about `message` not on `NotificationProps`
that Task 5 resolves. Do not fix it here.

- [ ] **Step 3: Commit**

```bash
git add src/runtime/notifications/types.ts
git commit -m "feat: add notification types"
```

---

## Task 3: `lib.ts` helpers (TDD)

**Files:**
- Create: `src/runtime/notifications/lib.ts`
- Test: `src/runtime/notifications/lib.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'

import { createId, getAutoClose } from './lib'


describe('getAutoClose', () => {
	it('returns the notification value when it is a number', () => {
		expect(getAutoClose(4000, 1000)).toBe(1000)
	})

	it('returns false when the notification value is false', () => {
		expect(getAutoClose(4000, false)).toBe(false)
	})

	it('returns false when the global value is false and no override', () => {
		expect(getAutoClose(false, undefined)).toBe(false)
	})

	it('falls back to the global value when override is undefined', () => {
		expect(getAutoClose(4000, undefined)).toBe(4000)
	})
})

describe('createId', () => {
	it('returns a non-empty unique string', () => {
		expect(createId()).not.toBe(createId())
		expect(createId().length).toBeGreaterThan(0)
	})
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/runtime/notifications/lib.test.ts`
Expected: FAIL — cannot resolve `./lib`.

- [ ] **Step 3: Write the implementation**

```ts
let counter = 0

/** Unique id for a notification. */
export function createId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
		return crypto.randomUUID()

	counter += 1
	return `notification-${Date.now()}-${counter}`
}

/** Resolves the effective auto-close: a notification number/false wins, else the global value. */
export function getAutoClose(
	global: number | false,
	notification: number | false | undefined,
): number | false {
	if (typeof notification === 'number')
		return notification

	if (notification === false || global === false)
		return false

	return global
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/runtime/notifications/lib.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/runtime/notifications/lib.ts src/runtime/notifications/lib.test.ts
git commit -m "feat: add notification lib helpers"
```

---

## Task 4: Store (TDD)

**Files:**
- Create: `src/runtime/notifications/notifications-store.ts`
- Test: `src/runtime/notifications/notifications-store.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { beforeEach, describe, expect, it } from 'vitest'

import { NotificationsStore } from './notifications-store'


function makeStore() {
	// Bypass the singleton for isolated tests.
	return (NotificationsStore as unknown as { new(): NotificationsStore })
		.prototype.constructor
		? Reflect.construct(NotificationsStore, []) as NotificationsStore
		: new (NotificationsStore as any)()
}

describe('NotificationsStore', () => {
	let store: NotificationsStore

	beforeEach(() => {
		store = makeStore()
		store.updateState(s => ({ ...s, limit: 2 }))
	})

	it('show returns an id and adds a visible notification', () => {
		const id = store.show({ title: 'a' })
		expect(typeof id).toBe('string')
		expect(store.state.notifications).toHaveLength(1)
		expect(store.state.notifications[0]!.id).toBe(id)
	})

	it('queues notifications beyond the limit', () => {
		store.show({ title: 'a' })
		store.show({ title: 'b' })
		store.show({ title: 'c' })
		expect(store.state.notifications).toHaveLength(2)
		expect(store.state.queue).toHaveLength(1)
	})

	it('hide frees a slot and pulls the next from the queue (FIFO)', () => {
		const a = store.show({ title: 'a' })
		store.show({ title: 'b' })
		const cId = store.show({ title: 'c' })
		store.hide(a)
		expect(store.state.notifications.map(n => n.id)).toContain(cId)
		expect(store.state.queue).toHaveLength(0)
	})

	it('show with an existing id updates in place, no duplicate', () => {
		const id = store.show({ id: 'x', title: 'a' })
		store.show({ id: 'x', title: 'b' })
		expect(store.state.notifications).toHaveLength(1)
		expect(store.state.notifications[0]!.title).toBe('b')
		expect(store.state.notifications[0]!.id).toBe(id)
	})

	it('update patches an existing notification', () => {
		const id = store.show({ title: 'a' })
		store.update(id, { title: 'b', color: 'green' })
		expect(store.state.notifications[0]!.title).toBe('b')
		expect(store.state.notifications[0]!.color).toBe('green')
	})

	it('update of an unknown id is a no-op', () => {
		store.update('missing', { title: 'b' })
		expect(store.state.notifications).toHaveLength(0)
	})

	it('clean removes visible and queued notifications', () => {
		store.show({ title: 'a' })
		store.show({ title: 'b' })
		store.show({ title: 'c' })
		store.clean()
		expect(store.state.notifications).toHaveLength(0)
		expect(store.state.queue).toHaveLength(0)
	})

	it('cleanQueue removes only the queue', () => {
		store.show({ title: 'a' })
		store.show({ title: 'b' })
		store.show({ title: 'c' })
		store.cleanQueue()
		expect(store.state.notifications).toHaveLength(2)
		expect(store.state.queue).toHaveLength(0)
	})
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/runtime/notifications/notifications-store.test.ts`
Expected: FAIL — cannot resolve `./notifications-store`.

- [ ] **Step 3: Write the implementation**

```ts
import { markRaw, reactive } from 'vue'

import type { NotificationData, NotificationInput, NotificationsState } from './types'

import { createId } from './lib'


const GLOBAL_KEY = '__nui_notifications_store__'

declare const globalThis: Record<string, unknown>

/**
 * Global notifications store.
 *
 * Holds a reactive list of visible notifications plus an overflow queue.
 * Shows, updates, and removes notifications from any context.
 */
export class NotificationsStore {
	readonly state = reactive<NotificationsState>({
		notifications: [],
		queue: [],
		limit: 5,
		defaultPosition: 'bottom-right',
	})

	static get instance(): NotificationsStore {
		if (!globalThis[GLOBAL_KEY])
			globalThis[GLOBAL_KEY] = new NotificationsStore()

		return globalThis[GLOBAL_KEY] as NotificationsStore
	}

	/** Shows a notification, or queues it past the limit. Returns its id. */
	show(data: NotificationInput): string {
		const id = data.id ?? createId()
		const next: NotificationData = { ...data, id }

		const visibleIndex = this.state.notifications.findIndex(n => n.id === id)
		if (visibleIndex !== -1) {
			this.state.notifications[visibleIndex] = next
			return id
		}

		const queuedIndex = this.state.queue.findIndex(n => n.id === id)
		if (queuedIndex !== -1) {
			this.state.queue[queuedIndex] = next
			return id
		}

		if (this.state.notifications.length < this.state.limit)
			this.state.notifications.push(next)
		else
			this.state.queue.push(next)

		return id
	}

	/** Removes a notification and promotes the next queued one. */
	hide(id: string): void {
		const index = this.state.notifications.findIndex(n => n.id === id)
		if (index === -1) {
			this.state.queue = this.state.queue.filter(n => n.id !== id)
			return
		}

		this.state.notifications.splice(index, 1)

		const next = this.state.queue.shift()
		if (next)
			this.state.notifications.push(next)
	}

	/** Patches an existing notification in place. No-op if absent. */
	update(id: string, data: Partial<NotificationInput>): void {
		const visible = this.state.notifications.find(n => n.id === id)
		if (visible) {
			Object.assign(visible, data, { id })
			return
		}

		const queued = this.state.queue.find(n => n.id === id)
		if (queued)
			Object.assign(queued, data, { id })
	}

	/** Removes everything. */
	clean(): void {
		this.state.notifications = []
		this.state.queue = []
	}

	/** Removes only queued notifications. */
	cleanQueue(): void {
		this.state.queue = []
	}

	/** Patches store state (limit / defaultPosition). */
	updateState(fn: (state: NotificationsState) => NotificationsState): void {
		const next = fn(this.state)
		this.state.notifications = next.notifications
		this.state.queue = next.queue
		this.state.limit = next.limit
		this.state.defaultPosition = next.defaultPosition
	}
}

export const $notifications = markRaw(NotificationsStore.instance)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/runtime/notifications/notifications-store.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/runtime/notifications/notifications-store.ts src/runtime/notifications/notifications-store.test.ts
git commit -m "feat: add notifications store"
```

---

## Task 5: notification.vue — message rename, StringOrVNode, actions

**Files:**
- Modify: `src/runtime/components/notification.vue`
- Test: `src/runtime/components/notification.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'

import Notification from './notification.vue'


// Stub auto-imported global components used inside notification.vue.
const global = {
	stubs: {
		Box: { template: '<div data-testid="box"><slot /></div>' },
		Icon: { template: '<i />' },
		Loader: { template: '<span />' },
		ActionIcon: { template: '<button class="close" @click="$emit(\'click\')" />' },
		Button: { props: ['label'], template: '<button class="action">{{ label }}</button>' },
	},
}

describe('Notification', () => {
	it('renders a string message', () => {
		const wrapper = mount(Notification, { global, props: { message: 'hello' } })
		expect(wrapper.text()).toContain('hello')
	})

	it('renders a VNode-returning function as title', () => {
		const wrapper = mount(Notification, {
			global,
			props: { title: () => h('b', 'bold-title') },
		})
		expect(wrapper.html()).toContain('bold-title')
	})

	it('renders action buttons via Button', () => {
		const wrapper = mount(Notification, {
			global,
			props: { actions: [{ label: 'Undo' }, { label: 'Retry' }] },
		})
		const actions = wrapper.findAll('.action')
		expect(actions).toHaveLength(2)
		expect(actions[0]!.text()).toBe('Undo')
	})

	it('calls action onClick', async () => {
		let clicked = false
		const wrapper = mount(Notification, {
			global,
			props: { actions: [{ label: 'Undo', onClick: () => { clicked = true } }] },
		})
		await wrapper.find('.action').trigger('click')
		expect(clicked).toBe(true)
	})

	it('emits close when the close button is clicked', async () => {
		const wrapper = mount(Notification, { global, props: { message: 'x' } })
		await wrapper.find('.close').trigger('click')
		expect(wrapper.emitted('close')).toBeTruthy()
	})
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/runtime/components/notification.test.ts`
Expected: FAIL — `actions` not rendered / `message` not a prop yet.

- [ ] **Step 3: Update the script block**

In `src/runtime/components/notification.vue`, update imports (top of `<script setup>`) to add types and the `Button` component:

```ts
import type { HTMLAttributes } from 'vue'

import { getRadius, getThemeColor, useVarsResolver } from '#imports'

import type { Classes, NuanceColor, NuanceRadius, StringOrVNode } from '../types'
import type { ActionIconProps } from './action-icon/action-icon.vue'
import type { BoxProps } from './box.vue'
import type { ButtonProps } from './button/button.vue'
import type { LoaderProps } from './loader'

import ActionIcon from './action-icon/action-icon.vue'
import Box from './box.vue'
import Button from './button/button.vue'
import Loader from './loader/loader.vue'
```

Add an action type above the props interface:

```ts
export type NotificationOrientation = 'vertical' | 'horizontal'

export interface NotificationAction extends ButtonProps {
	/** Button label */
	label: string
	/** Click handler */
	onClick?: (event: MouseEvent) => void
}
```

Replace the `NotificationClasses` type to add `actions`:

```ts
type NotificationClasses
	= | 'root'
		| 'icon'
		| 'loader'
		| 'body'
		| 'title'
		| 'description'
		| 'actions'
		| 'closeButton'
```

In `NotificationProps`, change the `title` and `description` fields. Remove the
`description` field and replace with `message`; widen `title`:

```ts
	/** Notification title, displayed above the message body */
	title?: StringOrVNode

	/** Notification body. When no title is provided, this is the main message. */
	message?: StringOrVNode

	/** Action buttons */
	actions?: NotificationAction[]

	/** Actions/close layout @default 'vertical' */
	orientation?: NotificationOrientation
```

Update the destructured props to add the new ones and rename:

```ts
const {
	withCloseButton = true,
	radius,
	color,
	mod,
	loading,
	withBorder,
	role = 'alert',
	icon,
	loaderProps,
	title,
	message,
	actions,
	orientation = 'vertical',
	closeButtonProps,
	classes,
} = defineProps<NotificationProps>()
```

- [ ] **Step 4: Update the template**

Replace the `<template>` body. Title and message render `StringOrVNode`; add an
actions block; pass `orientation` as a modifier.

```vue
<template>
	<Box
		:style='style.root'
		:class='[$style.root, classes?.root]'
		:role
		:mod='[{
			"with-icon": !!icon || !!$slots.icon || loading,
			"with-border": withBorder,
			orientation,
		}, mod]'
	>
		<div v-if='icon && !loading' :class='[$style.icon, classes?.icon]'>
			<slot name='icon'>
				<Icon :name='icon' />
			</slot>
		</div>

		<Loader
			v-if='loading'
			size='28px'
			:color
			v-bind='loaderProps'
			:class='[$style.loader, loaderProps?.class, classes?.loader]'
		/>

		<div :class='[$style.body, classes?.body]'>
			<div v-if='title || $slots.title' :class='[$style.title, classes?.title]'>
				<slot name='title'>
					<component :is='title()' v-if='typeof title === "function"' />
					<component :is='title' v-else-if='title && typeof title === "object"' />
					<template v-else>
						{{ title }}
					</template>
				</slot>
			</div>

			<Box
				:class='[$style.description, classes?.description]'
				:mod='{ "with-title": !!title || !!$slots.title }'
			>
				<slot>
					<component :is='message()' v-if='typeof message === "function"' />
					<component :is='message' v-else-if='message && typeof message === "object"' />
					<template v-else>
						{{ message }}
					</template>
				</slot>
			</Box>

			<div
				v-if='orientation === "vertical" && (actions?.length || $slots.actions)'
				:class='[$style.actions, classes?.actions]'
			>
				<slot name='actions'>
					<Button
						v-for='(action, index) in actions'
						:key='index'
						size='compact-sm'
						:color
						v-bind='action'
						@click='action.onClick?.($event)'
					>
						{{ action.label }}
					</Button>
				</slot>
			</div>
		</div>

		<div
			v-if='(orientation === "horizontal" && (actions?.length || $slots.actions)) || withCloseButton'
			:class='[$style.actions, classes?.actions]'
			data-position='end'
		>
			<template v-if='orientation === "horizontal" && (actions?.length || $slots.actions)'>
				<slot name='actions'>
					<Button
						v-for='(action, index) in actions'
						:key='index'
						size='compact-sm'
						:color
						v-bind='action'
						@click='action.onClick?.($event)'
					>
						{{ action.label }}
					</Button>
				</slot>
			</template>

			<ActionIcon
				v-if='withCloseButton'
				icon='lucide:x'
				variant='subtle'
				v-bind='closeButtonProps'
				:class='classes?.closeButton'
				@click='$emit("close")'
			/>
		</div>
	</Box>
</template>
```

- [ ] **Step 5: Add actions styles**

In the `<style module>` block of `notification.vue`, add after the `.description`
rule:

```css
.actions {
	display: flex;
	gap: var(--spacing-xs);
	align-items: center;
}

.body .actions {
	margin-top: var(--spacing-xs);
}

.actions[data-position='end'] {
	margin-inline-start: var(--spacing-xs);
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test src/runtime/components/notification.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 7: Typecheck (resolves Task 2 deferral)**

Run: `pnpm test:types`
Expected: PASS — `message` now exists on `NotificationProps`, so `types.ts` resolves.

- [ ] **Step 8: Commit**

```bash
git add src/runtime/components/notification.vue src/runtime/components/notification.test.ts src/runtime/notifications/types.ts
git commit -m "feat: notification message rename, StringOrVNode content, actions"
```

---

## Task 6: `use-notifications` composable

**Files:**
- Create: `src/runtime/notifications/use-notifications.ts`

- [ ] **Step 1: Write the composable**

```ts
import { computed } from 'vue'

import { $notifications } from './notifications-store'


/** Reactive access to the global notifications state. */
export function useNotifications() {
	return {
		/** Currently visible notifications. */
		notifications: computed(() => $notifications.state.notifications),
		/** Queued notifications waiting for a free slot. */
		queue: computed(() => $notifications.state.queue),
	}
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm test:types`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/runtime/notifications/use-notifications.ts
git commit -m "feat: add useNotifications composable"
```

---

## Task 7: Container (TDD)

**Files:**
- Create: `src/runtime/notifications/notification-container.vue`
- Test: `src/runtime/notifications/notification-container.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import NotificationContainer from './notification-container.vue'


const global = {
	stubs: {
		Notification: {
			props: ['message'],
			template: '<div class="n" @mouseenter="$emit(\'x\')"><slot /></div>',
			emits: ['close'],
		},
		Progress: { props: ['modelValue'], template: '<div class="progress" />' },
	},
}

function makeData(overrides = {}) {
	return { id: 'a', message: 'hi', ...overrides }
}

describe('NotificationContainer', () => {
	beforeEach(() => vi.useFakeTimers())
	afterEach(() => vi.useRealTimers())

	it('emits hide after the auto-close timeout', () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData(), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		vi.advanceTimersByTime(1000)
		expect(wrapper.emitted('hide')).toBeTruthy()
		expect(wrapper.emitted('hide')![0]).toEqual(['a'])
	})

	it('does not auto-close when autoClose resolves to false', () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData({ autoClose: false }), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		vi.advanceTimersByTime(5000)
		expect(wrapper.emitted('hide')).toBeFalsy()
	})

	it('pauses the timer while paused is true', async () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData(), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		await wrapper.setProps({ paused: true })
		vi.advanceTimersByTime(2000)
		expect(wrapper.emitted('hide')).toBeFalsy()
		await wrapper.setProps({ paused: false })
		vi.advanceTimersByTime(1000)
		expect(wrapper.emitted('hide')).toBeTruthy()
	})

	it('calls onOpen on mount', () => {
		const onOpen = vi.fn()
		mount(NotificationContainer, {
			global,
			props: { data: makeData({ onOpen }), autoClose: false, transitionDuration: 0, paused: false },
		})
		expect(onOpen).toHaveBeenCalledWith('a')
	})

	it('renders a progress bar when auto-close is a number', () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData(), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		expect(wrapper.find('.progress').exists()).toBe(true)
	})

	it('renders no progress bar when auto-close is false', () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData({ autoClose: false }), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		expect(wrapper.find('.progress').exists()).toBe(false)
	})
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/runtime/notifications/notification-container.test.ts`
Expected: FAIL — cannot resolve `./notification-container.vue`.

- [ ] **Step 3: Write the component**

```vue
<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { NotificationData } from './types'

import Notification from '../components/notification.vue'
import Progress from '../components/progress/progress.vue'
import { getAutoClose } from './lib'


const props = defineProps<{
	data: NotificationData
	autoClose: number | false
	transitionDuration: number
	paused: boolean
}>()

const emit = defineEmits<{
	hide: [id: string]
	hoverStart: []
	hoverEnd: []
}>()

const duration = computed(() => getAutoClose(props.autoClose, props.data.autoClose))
const hasProgress = computed(() => typeof duration.value === 'number')

// ─── Timer + progress ───

const remaining = ref(typeof duration.value === 'number' ? duration.value : 0)
const progressValue = computed(() => typeof duration.value === 'number' && duration.value > 0
	? (remaining.value / duration.value) * 100
	: 0)

let rafId = 0
let lastTick = 0

function stop() {
	if (rafId) {
		cancelAnimationFrame(rafId)
		rafId = 0
	}
}

function tick(now: number) {
	const elapsed = now - lastTick
	lastTick = now
	remaining.value -= elapsed

	if (remaining.value <= 0) {
		stop()
		emit('hide', props.data.id)
		return
	}

	rafId = requestAnimationFrame(tick)
}

function start() {
	if (typeof duration.value !== 'number' || props.paused)
		return

	stop()
	lastTick = performance.now()
	rafId = requestAnimationFrame(tick)
}

watch(() => props.paused, (paused) => {
	if (paused)
		stop()
	else
		start()
})

// ─── Hover ───

function handleEnter() {
	emit('hoverStart')
}

function handleLeave() {
	emit('hoverEnd')
}

// ─── Lifecycle ───

onMounted(() => {
	props.data.onOpen?.(props.data.id)
	start()
})

onBeforeUnmount(() => {
	stop()
	props.data.onClose?.(props.data.id)
})
</script>

<template>
	<div :class="$style.root" @mouseenter="handleEnter" @mouseleave="handleLeave">
		<Notification
			v-bind="props.data"
			@close="emit('hide', props.data.id)"
		/>

		<Progress
			v-if="hasProgress"
			:model-value="progressValue"
			:color="props.data.color"
			size="sm"
			:class="$style.progress"
		/>
	</div>
</template>

<style module>
.root {
	position: relative;
}

.progress {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/runtime/notifications/notification-container.test.ts`
Expected: PASS (6 tests).

NOTE: The pause test relies on the `watch` stopping the rAF loop. happy-dom
provides `requestAnimationFrame`; with fake timers the rAF callbacks are driven
by vitest's `advanceTimersByTime` because happy-dom routes rAF through timers.
If rAF is NOT advanced by fake timers in this environment, change the timer
mechanism in Step 3 from rAF to `setInterval(tick, 16)` (and `clearInterval`),
which fake timers always drive. Keep the public behavior identical.

- [ ] **Step 5: Commit**

```bash
git add src/runtime/notifications/notification-container.vue src/runtime/notifications/notification-container.test.ts
git commit -m "feat: add notification container with timer, pause, progress"
```

---

## Task 8: Provider

**Files:**
- Create: `src/runtime/notifications/notifications-provider.vue`

- [ ] **Step 1: Write the component**

```vue
<script lang="ts" setup>
import { computed, onMounted, useTemplateRef, watch } from 'vue'

import type { Classes } from '@nui/types'

import type { NotificationData, NotificationPosition } from './types'

import { $notifications } from './notifications-store'
import { useNotifications } from './use-notifications'
import NotificationContainer from './notification-container.vue'


const POSITIONS: NotificationPosition[] = [
	'top-left',
	'top-center',
	'top-right',
	'bottom-left',
	'bottom-center',
	'bottom-right',
]

const props = withDefaults(defineProps<{
	/** Default notification position @default 'bottom-right' */
	position?: NotificationPosition
	/** Auto-close in ms, or `false` to disable @default 4000 */
	autoClose?: number | false
	/** Max visible at once @default 5 */
	limit?: number
	/** Viewport z-index @default 400 */
	zIndex?: number | string
	/** Container width @default 440 */
	containerWidth?: number | string
	/** Transition duration in ms @default 250 */
	transitionDuration?: number
	/** Which notifications pause auto-close on hover @default 'all' */
	pauseOnHover?: 'all' | 'notification'
	classes?: Classes<'root' | 'notification'>
}>(), {
	position: 'bottom-right',
	autoClose: 4000,
	limit: 5,
	zIndex: 400,
	containerWidth: 440,
	transitionDuration: 250,
	pauseOnHover: 'all',
})

const { notifications } = useNotifications()
const hoveredId = ref<string | null>(null)

const grouped = computed(() => {
	const acc = Object.fromEntries(
		POSITIONS.map(p => [p, [] as NotificationData[]]),
	) as Record<NotificationPosition, NotificationData[]>

	for (const n of notifications.value)
		acc[n.position ?? props.position].push(n)

	return acc
})

function isPaused(id: string): boolean {
	if (props.pauseOnHover === 'all')
		return hoveredId.value !== null

	return hoveredId.value === id
}

function transitionName(position: NotificationPosition): string {
	if (position.startsWith('top'))
		return 'slide-down'

	return 'slide-up'
}

const rootStyle = computed(() => ({
	'--notifications-z-index': String(props.zIndex),
	'--notifications-width': typeof props.containerWidth === 'number'
		? `${props.containerWidth}px`
		: props.containerWidth,
}))

const viewportRefs = useTemplateRef<HTMLElement[]>('viewports')

function showPopovers() {
	for (const el of viewportRefs.value ?? []) {
		if (el && 'showPopover' in el && !el.matches(':popover-open')) {
			try {
				el.showPopover()
			}
			catch {
				// Already shown or unsupported; ignore.
			}
		}
	}
}

onMounted(() => {
	$notifications.updateState(s => ({
		...s,
		limit: props.limit,
		defaultPosition: props.position,
	}))
	showPopovers()
})

watch(() => props.limit, limit =>
	$notifications.updateState(s => ({ ...s, limit })))

watch(() => props.position, position =>
	$notifications.updateState(s => ({ ...s, defaultPosition: position })))
</script>

<template>
	<div
		v-for="position in POSITIONS"
		:key="position"
		ref="viewports"
		popover="manual"
		:data-position="position"
		:class="[$style.viewport, props.classes?.root]"
		:style="rootStyle"
	>
		<TransitionGroup :name="transitionName(position)">
			<NotificationContainer
				v-for="n in grouped[position]"
				:key="n.id"
				:data="n"
				:auto-close="props.autoClose"
				:transition-duration="props.transitionDuration"
				:paused="isPaused(n.id)"
				:class="props.classes?.notification"
				@hide="$notifications.hide($event)"
				@hover-start="hoveredId = n.id"
				@hover-end="hoveredId = null"
			/>
		</TransitionGroup>
	</div>
</template>

<style module>
.viewport {
	position: fixed;
	inset: auto;
	margin: 0;
	padding: var(--spacing-md);
	border: 0;

	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);

	width: var(--notifications-width);
	max-width: 100%;

	background: transparent;
	overflow: visible;

	z-index: var(--notifications-z-index);

	&[data-position='top-left'] {
		top: 0;
		left: 0;
	}

	&[data-position='top-center'] {
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	&[data-position='top-right'] {
		top: 0;
		right: 0;
	}

	&[data-position='bottom-left'] {
		bottom: 0;
		left: 0;
		flex-direction: column-reverse;
	}

	&[data-position='bottom-center'] {
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		flex-direction: column-reverse;
	}

	&[data-position='bottom-right'] {
		bottom: 0;
		right: 0;
		flex-direction: column-reverse;
	}

	&:not(:popover-open) {
		display: none;
	}
}
</style>
```

NOTE: `ref` is used in the script but must be imported. Add `ref` to the
`vue` import line: `import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'`.

- [ ] **Step 2: Add a11y attributes**

In the `<template>`, add to the viewport `<div>` (alongside `popover="manual"`):

```
role="region"
aria-label="Notifications"
aria-live="polite"
aria-atomic="false"
```

- [ ] **Step 3: Typecheck**

Run: `pnpm test:types`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/runtime/notifications/notifications-provider.vue
git commit -m "feat: add notifications provider with popover viewports"
```

---

## Task 9: Public exports + module alias

**Files:**
- Create: `src/runtime/notifications/index.ts`
- Modify: `src/module.ts` (aliases block + the `for...in` loop already iterates it)

- [ ] **Step 1: Write the index**

`src/runtime/notifications/index.ts`:

```ts
export { default as NNotificationsProvider } from './notifications-provider.vue'
export { $notifications } from './notifications-store'
export type * from './types'
export { useNotifications } from './use-notifications'
```

- [ ] **Step 2: Add the module alias**

In `src/module.ts`, locate the `aliases` object inside `setup` (currently has
`composables`, `components`, `form`, `utils`, `types`, `modals`). Add:

```ts
			notifications: resolve('./runtime/notifications'),
```

The existing `for (const key in aliases)` loop registers `@nui/notifications`
automatically. No other change needed.

- [ ] **Step 3: Typecheck**

Run: `pnpm test:types`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/runtime/notifications/index.ts src/module.ts
git commit -m "feat: export notifications public API and add @nui/notifications alias"
```

---

## Task 10: Playground verification + full suite

**Files:**
- Modify: `playground/app/layouts/default.vue` (mount provider)
- Create: `playground/app/pages/notifications.vue` (demo)

- [ ] **Step 1: Mount the provider in the layout**

In `playground/app/layouts/default.vue`, import and render alongside the existing
`NModalsProvider`:

```ts
import { NNotificationsProvider } from '@nui/notifications'
```

In the template, next to `<NModalsProvider />`:

```vue
<NNotificationsProvider position="top-right" />
```

- [ ] **Step 2: Create a demo page**

`playground/app/pages/notifications.vue`:

```vue
<script setup lang="ts">
import { $notifications } from '@nui/notifications'

function basic() {
	$notifications.show({ title: 'Saved', message: 'Changes stored.', color: 'green' })
}

function withActions() {
	$notifications.show({
		title: 'File deleted',
		message: 'document.pdf was removed.',
		color: 'red',
		autoClose: false,
		actions: [{ label: 'Undo', onClick: () => $notifications.clean() }],
	})
}

function loadingToSuccess() {
	const id = $notifications.show({ title: 'Uploading…', loading: true, autoClose: false })
	setTimeout(() => $notifications.update(id, {
		title: 'Uploaded',
		loading: false,
		color: 'green',
		autoClose: 3000,
	}), 1500)
}
</script>

<template>
	<div style="display: flex; gap: 12px; padding: 24px;">
		<NButton @click="basic()">
			Basic
		</NButton>
		<NButton @click="withActions()">
			With actions
		</NButton>
		<NButton @click="loadingToSuccess()">
			Loading → success
		</NButton>
	</div>
</template>
```

- [ ] **Step 3: Run the full test suite**

Run: `pnpm test`
Expected: PASS — all notification + store + lib + container tests green.

- [ ] **Step 4: Lint + typecheck**

Run: `pnpm lint && pnpm test:types`
Expected: PASS.

- [ ] **Step 5: Manual check in the playground**

Run: `pnpm dev`
Open the playground, navigate to `/notifications`. Verify:
- "Basic" shows a green notification top-right that auto-closes after 4s.
- Progress bar shrinks; hovering pauses it.
- "With actions" shows a red notification with an Undo button, no auto-close.
- "Loading → success" flips the same notification in place from spinner to green.
- Multiple rapid clicks past the limit (5) queue and appear as slots free up.
- The notification renders above an open `<NModal>` (top-layer).

- [ ] **Step 6: Commit**

```bash
git add playground/app/layouts/default.vue playground/app/pages/notifications.vue
git commit -m "chore: notifications playground demo"
```

---

## Self-Review notes

- **Spec coverage:** store API (Task 4), types incl. StringOrVNode (Tasks 1-2),
  notification.vue message/StringOrVNode/actions (Task 5), provider 6 popover
  viewports + grouping + transitions + a11y (Task 8), container timer/pause/
  progress (Task 7), index+alias (Task 9), testing (each TDD task + Task 10).
- **Deferral:** `types.ts` (Task 2) references `NotificationProps.message`, which
  Task 5 introduces. Flagged in Task 2; resolved by Task 5 Step 7. Task ordering
  keeps store/lib tests (Tasks 3-4) independent of notification.vue types.
- **rAF caveat:** Task 7 notes a `setInterval` fallback if fake timers don't drive
  rAF under happy-dom.
- **Type consistency:** `getAutoClose(global, notification)` arg order identical
  in lib (Task 3), container (Task 7). `show/hide/update/clean/cleanQueue/
  updateState` names consistent store↔tests↔provider.
