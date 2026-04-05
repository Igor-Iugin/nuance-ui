import type { NuanceTheme } from '@nui/types'
import type { CSSProperties } from 'vue'

import { useTheme } from './use-theme'


export function useStyleResolver<T extends CSSProperties>(factory: (theme: NuanceTheme) => T) {
	const theme = useTheme()
	return factory(theme.value as NuanceTheme)
}
