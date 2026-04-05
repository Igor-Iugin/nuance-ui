/**
 * Checks whether a value is considered falsy.
 *
 * Extends the JavaScript notion of falsiness so that empty arrays and empty
 * plain objects also count as falsy.
 */
export function isFalsy(value: unknown) {
	if (Array.isArray(value))
		return !value.length

	if (typeof value === 'object')
		return !Object.keys(value || {}).length

	return !value
}
