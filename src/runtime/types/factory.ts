import type { Classes } from './styling'


export interface FactoryPayload {
	props: object
	classes: string
	variant?: string
	vars?: any
}

/** Derives the final public props type for a component. */
export type ComponentFactory<T extends FactoryPayload> = Omit<T, 'props'> & {
	props: Omit<T['props'], 'classes' | 'variant'> & {
		classes?: Classes<T['classes']>
		variant?: T extends { variant: string } ? T['variant'] : never
	}
}
