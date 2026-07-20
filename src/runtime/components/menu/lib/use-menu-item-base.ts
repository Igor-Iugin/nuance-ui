import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

import { useVarsResolver } from '@nui/composables'
import { getThemeColor } from '@nui/utils'

import { useMenuState } from '../menu.vue'
import { useSubMenuState } from '../submenu/menu-sub.vue'


export function useMenuItemBase(color: MaybeRefOrGetter<string | undefined>) {
	const ctx = useMenuState()
	const sub = useSubMenuState()
	const style = useVarsResolver<{ root: '--menu-item-color' }>(theme => {
		const c = toValue(color)
		return { root: { '--menu-item-color': c ? getThemeColor(c, theme) : undefined } }
	})
	return { ctx, sub, style }
}
