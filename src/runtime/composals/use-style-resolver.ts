import type { UiKitTheme } from '@nui/types'
import type { CSSProperties } from 'vue'

import { useTheme } from './use-theme'


export function useStyleResolver<T extends CSSProperties>(factory: (theme: UiKitTheme) => T) {
	const theme = useTheme()
	return factory(theme.value as UiKitTheme)
}
