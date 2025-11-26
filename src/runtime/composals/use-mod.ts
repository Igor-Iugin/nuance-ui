import { isFalsy } from '@nui/utils'
import { computed } from 'vue'


export type Mod = Record<string, any>

const transformKey = (key: string) => key.startsWith('data-') ? key : `data-${key}`

function getMod(props: Mod | Mod[]): Mod {
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


export function useMod(mod: Mod | Mod[] | Mod[][] | null | undefined): Mod | null {
	return computed(() => {
		if (!mod)
			return null

		if (Array.isArray(mod)) {
			return mod
				.filter(i => !isFalsy(i))
				.reduce<Mod>((acc, value: Mod | Mod[]) => ({ ...acc, ...getMod(value) }), {})
		}

		return getMod(mod)
	})
}

