import { isNumberLike } from '../boolean'
import { rem } from './rem'


const SIZE_TOKENS = new Set(['xs', 'sm', 'md', 'lg', 'xl'])
const SPACING_TOKENS = new Set([...SIZE_TOKENS, '2xs', '2xl'])

/**
 * Resolves a size token to a CSS value.
 *
 * Values in `tokens` resolve to `var(--<prefix>-<token>)`. Numbers and
 * CSS-length-like strings pass through `rem` (unless `convertToRem` is
 * `false`). Everything else is returned as-is.
 */
export function getSize(
	size: unknown,
	prefix = 'size',
	tokens: Set<string> = SIZE_TOKENS,
	convertToRem = true,
): string | undefined {
	if (size === undefined)
		return undefined

	if (typeof size === 'string' && tokens.has(size))
		return `var(--${prefix}-${size})`

	if (isNumberLike(size))
		return convertToRem ? rem(size) : (size as string)

	return size as string
}

/**
 * Resolves a spacing token via the `--spacing-*` CSS variables.
 *
 * Supports negative tokens: `-sm` resolves to `calc(var(--spacing-sm) * -1)`.
 */
export function getSpacing(value: unknown): string | undefined {
	if (value === undefined)
		return undefined

	if (typeof value === 'string' && value.startsWith('-')) {
		const token = value.slice(1)
		if (SPACING_TOKENS.has(token))
			return `calc(var(--spacing-${token}) * -1)`
	}

	return getSize(value, 'spacing', SPACING_TOKENS)
}

/**
 * Resolves a radius token via the `--radius-*` CSS variables.
 *
 * `undefined` falls back to `--radius-default`, and `'full'` produces the
 * special `100%` value used for pill-shaped elements.
 */
export function getRadius(value: unknown): string | undefined {
	if (value === undefined)
		return 'var(--radius-default)'

	if (value === 'full')
		return '100%'

	return getSize(value, 'radius', SIZE_TOKENS)
}

/** Resolves a font-size token via the `--font-size-*` CSS variables. */
export const getFontSize = (value: unknown) => getSize(value, 'font-size', SIZE_TOKENS)

/** Resolves a line-height token via the `--line-height-*` CSS variables. */
export const getLineHeight = (value: unknown) => getSize(value, 'line-height', SIZE_TOKENS, false)

/**
 * Resolves a shadow token via the `--shadow-*` CSS variables.
 *
 * Falsy input returns `undefined` so the caller can omit the style entirely.
 */
export function getShadow(value: unknown): string | undefined {
	if (!value)
		return undefined

	return getSize(value, 'shadow', SIZE_TOKENS, false)
}
