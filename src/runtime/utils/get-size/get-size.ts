import { isNumberLike } from '../boolean/is-number-like'
import { rem } from '../converters/rem'


export function getSize(size: unknown, prefix = 'size', convertToRem = true): string | undefined {
	if (size === undefined) {
		return undefined
	}

	return isNumberLike(size) ? (convertToRem ? rem(size) : (size as string)) : `var(--${prefix}-${size})`
}

export const getSpacing = (size: unknown) => getSize(size, 'spacing')

export function getRadius(size: unknown) {
	if (size === undefined)
		return 'var(--radius-default)'

	if (size === 'full')
		return '100%'

	return getSize(size, 'radius')
}

export const getFontSize = (size: unknown) => getSize(size, 'font-size')

export const getLineHeight = (size: unknown) => getSize(size, 'line-height', false)

export function getShadow(size: unknown) {
	if (!size) {
		return undefined
	}

	return getSize(size, 'shadow', false)
}
