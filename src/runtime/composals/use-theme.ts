import type { NuanceTheme } from '@nui/types'

import { useColorMode } from '#imports'


interface ThemeInstance {
	preference: NuanceTheme
	readonly value: NuanceTheme
	unknown: boolean
	forced: boolean
}

export function useTheme() {
	return useColorMode() as ThemeInstance
}
