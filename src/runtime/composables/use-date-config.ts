import type { FormatOptions } from '@formkit/tempo'

import { createInjectionState } from '@vueuse/core'
import defu from 'defu'


const injectionKey = Symbol('dates-config')


/** Locale configuration for date-aware features. */
export type DateConfig = Omit<FormatOptions, 'date' | 'format'> & {
	/** Index of the first day of the week (0 = Sunday, 1 = Monday, ...). */
	firstDayOfWeek: number
}

function getFirstDayOfWeek(locale?: string, forceDay?: number): number {
	if (forceDay)
		return forceDay

	if (!locale)
		return 1

	try {
		const intlLocale = new Intl.Locale(locale)
		// `weekInfo` may be undefined in older browsers
		// @ts-expect-error
		return intlLocale.weekInfo?.firstDay ?? intlLocale.getWeekInfo?.()?.firstDay ?? 1
	}
	catch {
		return 1
	}
}

const [Provide, Inject] = createInjectionState((state?: Partial<DateConfig>) => ({
	...state,
	firstDayOfWeek: getFirstDayOfWeek(state?.locale, state?.firstDayOfWeek),
}), {
	injectionKey,
})

/**
 * Provides the shared date configuration to the component subtree.
 *
 * Call once in a root or layout component.
 *
 * When `firstDayOfWeek` is omitted, it is resolved from the locale.
 */
export const useProvideDatesConfig = Provide

/**
 * Reads the shared date configuration provided by `useProvideDatesConfig`.
 *
 * A local override can be passed in and will be shallow-merged on top of the
 * injected config.
 */
export function useDatesConfig(localValue?: ReturnType<typeof Inject>) {
	const injected = Inject()
	return defu(localValue, injected)
}
