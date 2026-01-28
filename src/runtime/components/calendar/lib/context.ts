import { createStrictInjection } from '@nui/helpers'

import type { UseCalendarReturn } from './use-calendar'


const injectionKey = Symbol('nui-calendar')
const [Provide, Inject] = createStrictInjection((state: Omit<UseCalendarReturn, 'grid'>) => state, {
	injectionKey,
	name: 'CalendarState',
})

export const useProvideCalendarState = Provide
export const useCalendarState = Inject
