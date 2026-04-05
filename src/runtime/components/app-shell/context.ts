import type { ModelRef } from 'vue'

import { createInjectionState } from '@vueuse/core'


/** Open/closed state of each AppShell region. */
interface AppShellState {
	/** Whether the header is collapsed. */
	header: ModelRef<boolean>
	/** Whether the navbar is collapsed. */
	navbar: ModelRef<boolean>
	/** Whether the aside panel is collapsed. */
	aside: ModelRef<boolean>
	/** Whether the footer is collapsed. */
	footer: ModelRef<boolean>
}

const [useProvide, useAState] = createInjectionState<[AppShellState], AppShellState>(state => state)

export const useProvideAppShell = useProvide
export const useAppShell = useAState
