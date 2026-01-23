import type { FormatOptions } from '@formkit/tempo'

import { createStrictInjection } from '@nui/helpers'


const injectionKey = Symbol('dates-config')


export type DateConfig = Omit<FormatOptions, 'date' | 'format'> & {
	firstDayOfWeek: number
}

/**
 * Get first day of week from Intl.Locale
 */
function getFirstDayOfWeek(locale?: string, forceDay: number = 1): number {
	if (forceDay)
		return forceDay

	if (!locale)
		return 1

	try {
		const intlLocale = new Intl.Locale(locale)
		// weekInfo может быть undefined в старых браузерах
		// @ts-expect-error
		return intlLocale.weekInfo?.firstDay ?? intlLocale.getWeekInfo?.()?.firstDay ?? 1
	}
	catch {
		return 1
	}
}

const [Provide, Inject] = createStrictInjection((state?: DateConfig) => ({
	...state,
	firstDayOfWeek: getFirstDayOfWeek(state?.locale, state?.firstDayOfWeek),
}), {
	injectionKey,
	name: 'DatesConfig',
})

/**
 * Hook to provide the dates configuration in a root or parent component.
 * Necessary for initializing the configuration that will be used by child components.
 */
export const useProvideDatesConfig = Provide

/**
 * Hook to inject the dates configuration in a component.
 * Used in components that depend on the dates configuration.
 */
export const useDatesConfig = Inject
