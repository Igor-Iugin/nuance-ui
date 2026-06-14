import { createVariantColorResolver, useAppConfig } from '#imports'

import type { AnyString, NuanceColor, NuanceGradient, NuanceTheme } from '../types'


interface VariantColorResolverOptions {
	color: NuanceColor | AnyString | undefined
	variant: 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient' | 'gradient-outline' | 'dot'
	gradient?: NuanceGradient
	theme: NuanceTheme
}

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
