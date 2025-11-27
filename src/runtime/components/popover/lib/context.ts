import type { NuanceRadius, NuanceShadow } from '@nui/types'

import { createStrictInjection } from '@nui/helpers'

import type { UsePopoverReturn } from './use-popover'


interface PopoverState {
	disabled?: boolean
	store: UsePopoverReturn
	withArrow: boolean
	id: string
	onToggle: (event: ToggleEvent) => void
	radius?: NuanceRadius
	shadow?: NuanceShadow
}

const injectionKey = Symbol('popover')

const [useProvide, useState] = createStrictInjection<[PopoverState], PopoverState>(state => state, {
	injectionKey,
	name: 'PopoverState',
})

export const useProvidePopoverState = useProvide
export const usePopoverState = useState
