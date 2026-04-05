import { isNumberLike } from '../boolean'
import { rem } from './rem'


/**
 * Resolves a size token to a CSS value.
 *
 * Numeric or CSS-length-like values are passed through `rem` (unless
 * `convertToRem` is `false`). String tokens are resolved to
 * `var(--<prefix>-<token>)`.
 */
export function getSize(size: unknown, prefix = 'size', convertToRem = true): string | undefined {
	if (size === undefined) {
		return undefined
	}

	return isNumberLike(size) ? (convertToRem ? rem(size) : (size as string)) : `var(--${prefix}-${size})`
}

/** Resolves a spacing token via the `--spacing-*` CSS variables. */
export const getSpacing = (size: unknown) => getSize(size, 'spacing')

/**
 * Resolves a radius token via the `--radius-*` CSS variables.
 *
 * `undefined` falls back to `--radius-default`, and `'full'` produces the
 * special `100%` value used for pill-shaped elements.
 */
export function getRadius(size: unknown) {
	if (size === undefined)
		return 'var(--radius-default)'

	if (size === 'full')
		return '100%'

	return getSize(size, 'radius')
}

/** Resolves a font-size token via the `--font-size-*` CSS variables. */
export const getFontSize = (size: unknown) => getSize(size, 'font-size')

/** Resolves a line-height token via the `--line-height-*` CSS variables. */
export const getLineHeight = (size: unknown) => getSize(size, 'line-height', false)

/**
 * Resolves a shadow token via the `--shadow-*` CSS variables.
 *
 * Falsy input returns `undefined` so the caller can omit the style entirely.
 */
export function getShadow(size: unknown) {
	if (!size) {
		return undefined
	}

	return getSize(size, 'shadow', false)
}
