import type { UiKitTheme } from '@nui/types'

import { useColorMode } from '#build/imports'


interface ThemeInstance {
	preference: UiKitTheme
	readonly value: UiKitTheme
	unknown: boolean
	forced: boolean
}

export function useTheme() {
	return useColorMode() as ThemeInstance
}
