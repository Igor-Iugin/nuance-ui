import { createVariantColorResolver, useAppConfig } from '#imports'

import type { VariantColorResolverOptions } from '../utils'


/** Returns the configured icon registry merged with module defaults. */
export function useConfig() {
	const { icons, gradient } = useAppConfig().nui

	return {
		icons,
		variantResolver: (options: VariantColorResolverOptions) => createVariantColorResolver({
			...options,
			gradient: options.gradient ?? gradient,
		}),
	}
}
