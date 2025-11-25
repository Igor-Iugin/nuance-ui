import type { UiKitRadius, UiKitShadow } from '@types'

import { createStrictInjection } from '@helpers'

import type { UsePopoverReturn } from './use-popover'


interface PopoverState {
	disabled?: boolean
	store: UsePopoverReturn
	withArrow: boolean
	id: string
	onToggle: (event: ToggleEvent) => void
	radius?: UiKitRadius
	shadow?: UiKitShadow
}

const injectionKey = Symbol('popover')

const [useProvide, useState] = createStrictInjection<[PopoverState], PopoverState>(state => state, {
	injectionKey,
	name: 'PopoverState',
})

export const useProvidePopoverState = useProvide
export const usePopoverState = useState
