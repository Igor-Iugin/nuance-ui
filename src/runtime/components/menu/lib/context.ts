import type { Ref, ShallowRef } from 'vue'

import { createStrictInjection } from '@nui/composables'


export interface SubMenuState {
	/** Submenu open state */
	opened: Ref<boolean>
	/** Open the submenu */
	open: () => void
	/** Close the submenu */
	close: () => void
	/** Focus the first item of the submenu dropdown */
	focusFirstItem: () => void
	/** Focus the target that opens this submenu */
	focusParentItem: () => void
	/** Parent submenu state, if this submenu is nested */
	parentContext: SubMenuState | null
	/** Register a child submenu close handler, closing any previously open sibling */
	registerOpenSub: (closeFn: () => void) => () => void
	/** Base id used to build target/dropdown element ids */
	id: string
	/** Bound to the submenu target element */
	targetRef: ShallowRef<HTMLElement | null>
}

const [provideSubMenuState, injectSubMenuState] = createStrictInjection(
	(state: SubMenuState) => state,
	{ injectionKey: Symbol('nuance-sub-menu'), name: 'MenuSub' },
)

export { provideSubMenuState }

export const useSubMenuState = injectSubMenuState
