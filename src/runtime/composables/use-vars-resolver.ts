import type { CssVariable, NuanceTheme, TransformVars } from '@nui/types'
import type { ComputedRef } from 'vue'

import { computed } from 'vue'

import { useTheme } from './use-theme'


/** Reactive style object builder. */
export function useVarsResolver<T extends Record<never, CssVariable>>(
	factory: (theme: NuanceTheme) => TransformVars<T>,
): ComputedRef<TransformVars<T>> {
	const theme = useTheme()
	return computed(() => factory(theme.value))
}
