import type { Ref } from 'vue'

import { createInjectionState } from '@vueuse/core'


interface AppShellState {
	header: Ref<boolean>
	navbar: Ref<boolean>
	aside: Ref<boolean>
	footer: Ref<boolean>
}

const [useProvide, useAState] = createInjectionState<[AppShellState], AppShellState>(state => state)

export const useProvideAppShell = useProvide
export const useAppShell = useAState
