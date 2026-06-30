import type { VNode } from 'vue'


export type * from './icons'
export type * from './styling'
export type * from './theme'

/** Value that may be synchronous or wrapped in a promise. */
export type MaybePromise<T = unknown> = T | Promise<T>

/** String, VNode, or a render function producing a VNode. */
export type StringOrVNode = string | VNode | (() => VNode)

export type AnyString = string & {}

export type DynamicSlotsKeys<
	Name extends string | undefined,
	Suffix extends string | undefined = undefined,
> = (
	Name extends string
		? Suffix extends string
			? Name | `${Name}-${Suffix}`
			: Name
		: never
)

export type SlotProps<T extends { slot?: string }> = (props: { item: T }) => VNode[]

export type DynamicSlots<
	T extends { slot?: string },
	Suffix extends string | undefined = undefined,
	ExtraProps extends object = object,
> = {
	[K in DynamicSlotsKeys<T['slot'], Suffix>]?: (
		props: {
			item: Extract<T, { slot: K extends `${infer Base}-${Suffix}` ? Base : K }>
		} & ExtraProps,
	) => VNode[]
}
