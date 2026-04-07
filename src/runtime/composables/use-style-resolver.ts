import type { NuanceTheme, TransformVars } from '@nui/types'

import { useTheme } from './use-theme'


/**
 * Builds a style object from a factory that receives the current theme.
 */
export function useStyleResolver<T extends object>(factory: (theme: NuanceTheme) => TransformVars<T>) {
	const theme = useTheme()
	return factory(theme.value as NuanceTheme)
}
