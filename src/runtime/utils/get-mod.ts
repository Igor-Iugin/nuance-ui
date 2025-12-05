import { isFalsy } from './boolean/is-falsy'


export type Mod = Record<string, any>

const transformKey = (key: string) => key.startsWith('data-') ? key : `data-${key}`

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
