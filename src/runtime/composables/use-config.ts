import type { VariantColorResolverOptions } from '@nui/utils'

import { createVariantColorResolver } from '@nui/utils'
import { useAppConfig } from '#imports'


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
