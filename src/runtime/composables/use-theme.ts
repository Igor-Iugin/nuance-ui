import type { NuanceTheme } from '@nui/types'

import { useColorMode } from '#imports'


interface ThemeInstance {
	/** User-selected theme preference, including `system`. Writable. */
	preference: NuanceTheme
	/** Resolved theme currently applied to the document. */
	readonly value: NuanceTheme
	/** `true` while the theme has not yet been determined on the client. */
	unknown: boolean
	/** `true` when the theme is forced by the application and cannot be changed by the user. */
	forced: boolean
}

/**
 * Returns the current Nuance theme instance
 */
export function useTheme() {
	return useColorMode() as ThemeInstance
}
