import type { ModelRef } from 'vue'

import { createInjectionState } from '@vueuse/core'


interface AppShellState {
	header: ModelRef<boolean>
	navbar: ModelRef<boolean>
	aside: ModelRef<boolean>
	footer: ModelRef<boolean>
}

const [useProvide, useAState] = createInjectionState<[AppShellState], AppShellState>(state => state)

export const useProvideAppShell = useProvide
export const useAppShell = useAState
