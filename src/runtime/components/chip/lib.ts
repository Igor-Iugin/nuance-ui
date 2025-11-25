import type { ModelRef } from 'vue'

import { createStrictInjection } from '@helpers'
import { computed } from 'vue'


export type ChipGroupValue<T extends boolean = false> = (T extends true ? string[] : string) | null

interface ChipGroupState {
	multiple: boolean
	value: ModelRef<string | string[] | null>
	disabled?: boolean
}

const injectionKey = Symbol('chip-group')
const [useProvide, useState] = createStrictInjection((props: ChipGroupState) => props, {
	injectionKey,
	name: 'ChipGroup',
})

export const useProvideChipGroupState = useProvide
export const useChipGroupState = useState


export function useChipState(
	ctx: ChipGroupState | undefined,
	state: ModelRef<boolean>,
	value?: string,
) {
	const checked = computed(() => {
		if (ctx?.value !== undefined && value) {
			return Array.isArray(ctx.value.value)
				? ctx.value.value.includes(value)
				: ctx.value.value === value
		}

		return state.value
	})

	const onUpdate = () => {
		if (ctx?.value !== undefined && value) {
			ctx.value.value = Array.isArray(ctx.value.value)
				? ctx.value.value.includes(value)
					? ctx.value.value.filter(i => i !== value)
					: [...ctx.value.value, value]
				: ctx.value.value === value ? null : value
		}
		else {
			state.value = !state.value
		}
	}

	return { checked, onUpdate }
}
