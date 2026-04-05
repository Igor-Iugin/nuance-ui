import type { NuanceTheme } from '@nui/types'
import type { CSSProperties } from 'vue'

import { useTheme } from './use-theme'


/**
 * Builds a style object from a factory that receives the current theme.
 */
export function useStyleResolver<T extends CSSProperties>(factory: (theme: NuanceTheme) => T) {
	const theme = useTheme()
	return factory(theme.value as NuanceTheme)
}
