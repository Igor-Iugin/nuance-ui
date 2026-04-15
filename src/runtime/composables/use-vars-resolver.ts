import type { ComponentFactory, NuanceTheme, TransformVars } from '@nui/types'
import type { ComputedRef } from 'vue'

import { computed } from 'vue'

import { useTheme } from './use-theme'


/** Reactive style object builder. */
export function useVarsResolver<T extends ComponentFactory<any>>(
	factory: (theme: NuanceTheme) => TransformVars<T['vars']>,
): ComputedRef<TransformVars<T['vars']>> {
	const theme = useTheme()
	return computed(() => factory(theme.value))
}
