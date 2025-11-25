import type { UiKitTheme } from '@nui/types'

import { useState } from '#imports'


interface ThemeInstance {
	preference: UiKitTheme
	readonly value: UiKitTheme
	unknown: boolean
	forced: boolean
}

export function useTheme() {
	return useState('color-mode').value as ThemeInstance
}
