import { isFalsy } from '../boolean'


export type Mod = Record<string, any>

const transformKey = (key: string) => key.startsWith('data-') ? key : `data-${key}`

/**
 * Normalizes a modifier object (or an array of them) into a flat `data-*`
 * attribute map suitable for spreading on an element.
 *
 * Falsy values are dropped, keys that do not start with `data-` are
 * prefixed automatically, and arrays are merged left-to-right.
 */
export function getMod(props: Mod | Mod[]): Mod {
	if (Array.isArray(props)) {
		return props
			.filter(i => !isFalsy(i))
			.reduce<Mod>((acc, item: Mod) => ({ ...acc, ...getMod(item) }), {})
	}

	return Object.keys(props).reduce<Mod>((acc, key) => {
		const value = props[key]

		if (isFalsy(value))
			return acc

		acc[transformKey(key)] = props[key]
		return acc
	}, {})
}
