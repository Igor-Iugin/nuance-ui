/**
 * Checks whether a value can be treated as a CSS length-like value.
 *
 * Returns `true` for numbers, strings with a known CSS unit (`px`, `rem`,
 * `em`, viewport units, container query units, `%`, ...), `calc(...)`,
 * `var(...)` expressions, and whitespace-separated lists where every token
 * passes the same check.
 */
export function isNumberLike(value: unknown) {
	if (typeof value === 'number')
		return true


	if (typeof value === 'string') {
		if (value.startsWith('calc(') || value.startsWith('var(') || (value.includes(' ') && value.trim() !== '')) {
			return true
		}

		const cssUnitsRegex
			= /^[+-]?\d+(?:\.\d+)?(?:px|em|rem|ex|ch|lh|rlh|vw|vh|vmin|vmax|vb|vi|svw|svh|lvw|lvh|dvw|dvh|cm|mm|in|pt|pc|q|cqw|cqh|cqi|cqb|cqmin|cqmax|%)?$/
		const values = value.trim().split(/\s+/)
		return values.every(val => cssUnitsRegex.test(val))
	}

	return false
}
