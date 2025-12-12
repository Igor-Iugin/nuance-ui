import type { NuanceColor, NuanceGradient, NuanceTheme } from '@nui/types'

import { DEFAULT_GRADIENT } from '../../const'
import { getGradient, getGradientOutline } from '../color-functions/get-gradient'
import { getThemeColor, parseThemeColor } from '../parse-theme-color/parse-theme-color'


interface VariantColorResolverResult {
	background: string
	hover: string
	text: string
	border: string
}

export function createVariantColorResolver({
	color = 'primary',
	variant,
	gradient,
	theme,
}: {
	color: NuanceColor | string | undefined
	variant: 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient' | 'gradient-outline'
	gradient?: NuanceGradient
	theme: NuanceTheme
}): VariantColorResolverResult {
	const parsed = parseThemeColor({ color, theme })

	if (variant === 'filled') {
		const text = 'var(--color-white)'

		if (parsed.shade === undefined) {
			return {
				background: `var(--color-${color}-filled)`,
				hover: `var(--color-${color}-filled-hover)`,
				text,
				border: '1px solid transparent',
			}
		}

		return {
			background: `var(--color-${parsed.color}-${parsed.shade})`,
			hover: `var(--color-${parsed.color}-${parsed.shade === 9 ? 8 : parsed.shade + 1})`,
			text,
			border: '1px solid transparent',
		}
	}

	if (variant === 'light') {
		if (parsed.shade === undefined) {
			return {
				background: `var(--color-${color}-light)`,
				hover: `var(--color-${color}-light-hover)`,
				text: `var(--color-${color}-light-color)`,
				border: '1px solid transparent',
			}
		}

		return {
			background: `color-mix(var(--color-${parsed.color}-${parsed.shade}), .1)`,
			hover: `color-mix(var(--color-${parsed.color}-${parsed.shade}), .12)`,
			text: `var(--color-${parsed.color}-${Math.min(parsed.shade, 6)})`,
			border: '1px solid transparent',
		}
	}

	if (variant === 'outline') {
		if (parsed.shade === undefined) {
			return {
				background: 'transparent',
				hover: `var(--color-${color}-outline-hover)`,
				text: `var(--color-${color}-outline, var(--color-${color}-outline-text))`,
				border: `1px solid var(--color-${color}-outline)`,
			}
		}

		return {
			background: 'transparent',
			hover: `color-mix(var(--color-${parsed.color}-${parsed.shade}), .05)`,
			text: `var(--color-${parsed.color}-${parsed.shade})`,
			border: `1px solid var(--color-${parsed.color}-${parsed.shade})`,
		}
	}

	if (variant === 'subtle') {
		if (parsed.shade === undefined) {
			return {
				background: 'transparent',
				hover: `var(--color-${color}-light-hover)`,
				text: `var(--color-${color}-light-color)`,
				border: '1px solid transparent',
			}
		}

		return {
			background: 'transparent',
			hover: `color-mix(var(--color-${parsed.color}-${parsed.shade}), 0.12)`,
			text: `var(--color-${parsed.color}-${Math.min(parsed.shade, 6)})`,
			border: '1px solid transparent',
		}
	}

	if (variant === 'gradient') {
		return {
			background: getGradient(gradient, theme),
			hover: getGradient({
				from: gradient?.to || DEFAULT_GRADIENT.to,
				to: gradient?.from || DEFAULT_GRADIENT.from,
				deg: gradient?.deg,
			}, theme),
			text: 'var(--color-white)',
			border: '1px solid transparent',
		}
	}

	if (variant === 'gradient-outline') {
		const { color } = parseThemeColor({ color: gradient?.from || DEFAULT_GRADIENT.from, theme })

		return {
			background: getGradientOutline(gradient, theme),
			hover: getThemeColor(gradient?.to || DEFAULT_GRADIENT.to, theme),
			text: getThemeColor(`${color}.4`, theme),
			border: '3px solid transparent',
		}
	}

	if (variant === 'default') {
		return {
			background: 'var(--color-default)',
			hover: 'var(--color-default-hover)',
			text: 'var(--color-default-color)',
			border: '1px solid var(--color-default-border)',
		}
	}

	return {} as VariantColorResolverResult
}
