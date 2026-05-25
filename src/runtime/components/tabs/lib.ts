import type { ComputedRef, ModelRef, Ref } from 'vue'

import { createStrictInjection } from '@nui/composables'


export interface TabsContext {
	/**
	 * Unique identifier for the entire tabs group.
	 * Used as a prefix for generating accessible tab and panel IDs.
	 */
	id: ComputedRef<string>

	/**
	 * Two-way bound active tab value.
	 * `null` means no tab is selected (only possible when `allowTabDeactivation` is `true`).
	 */
	active: ModelRef<string | null>

	/** Whether keyboard navigation should loop from last to first (and vice versa). */
	loop: Ref<boolean>

	/** Whether pressing Enter/Space on a focused tab should activate it. */
	activateTabWithKeyboard: Ref<boolean>

	/**
	 * Allows clicking an already active tab to deactivate it (sets `active` to `null`).
	 * Useful for "deselectable" tabs.
	 */
	allowTabDeactivation: Ref<boolean>

	/** Visual variant of the tabs component. */
	variant: Ref<'default' | 'pills' | 'outline'>

	/** Inverted color scheme (typically used on dark backgrounds). */
	inverted: Ref<boolean | undefined>

	/**
	 * Keep tab panels mounted in the DOM when inactive.
	 * Useful for preserving state, animations, or SEO.
	 */
	keepMounted: Ref<boolean>

	/**
	 * For vertical tabs: placement of the tab list relative to the panels.
	 * `'left'` → tabs on the left, `'right'` → tabs on the right.
	 */
	placement: Ref<'right' | 'left'>

	/** Explicit orientation. Usually inferred from layout, but can be forced. */
	orientation: Ref<'vertical' | 'horizontal'>

	/**
	 * Generates a unique accessible ID for a tab element based on its value.
	 * @param value - The logical value of the tab (e.g. `'profile'`, `'settings'`)
	 * @returns Accessible ID string (e.g. `'tabs-abc123-tab-profile'`)
	 */
	getTabId: (value: string) => string

	/**
	 * Generates a unique accessible ID for a tab panel based on its value.
	 * @param value - The logical value of the tab
	 * @returns Accessible ID string (e.g. `'tabs-abc123-panel-profile'`)
	 */
	getPanelId: (value: string) => string
}

const [
	useProvide,
	useState,
] = createStrictInjection(({ allowTabDeactivation, active, ...state }: TabsContext) => ({
	...state,
	active,
	onUpdate: (tab: string) => {
		if (allowTabDeactivation.value)
			return active.value = active.value === tab ? null : tab

		return active.value = tab
	},
}), {
	name: 'TabsContext',
	injectionKey: Symbol('TabsContext'),
})

export const useProvideTabsContext = useProvide

/**
 * Consumes the {@link NTabsRoot} context.
 *
 * Returns the full context plus a safe `onUpdate` handler that respects
 * the `allowTabDeactivation` option.
 *
 * @remarks
 * Должен вызываться только внутри компонента, который является потомком {@link NTabsRoot}.
 * Предоставляет доступ к состоянию и методам управления вкладками.
 */
export const useTabsState = useState


export function getSafeId(uid: string, errorMessage: string) {
	return (value: string) => {
		if (typeof value !== 'string' || value.trim().length === 0) {
			throw new Error(errorMessage)
		}

		return `${uid}-${value}`
	}
}
