import type { StyleProps } from './types'


const STYLE_PROPS_KEYS = new Set<keyof StyleProps>([
	'm',
	'mt',
	'mb',
	'ml',
	'mr',
	'ms',
	'me',
	'mx',
	'my',
	'p',
	'pt',
	'pb',
	'pl',
	'pr',
	'ps',
	'pe',
	'px',
	'py',
	'bd',
	'bdrs',
	'bg',
	'c',
	'opacity',
	'ff',
	'fz',
	'fw',
	'lts',
	'ta',
	'lh',
	'fs',
	'tt',
	'td',
	'w',
	'h',
	'miw',
	'maw',
	'mih',
	'mah',
	'bgsz',
	'bgp',
	'bgr',
	'bga',
	'pos',
	'top',
	'left',
	'bottom',
	'right',
	'inset',
	'display',
	'flex',
])

interface ExtractReturn<T extends object> {
	styles: Pick<T, Extract<keyof T, keyof StyleProps>>
	rest: Omit<T, keyof StyleProps>
}

/**
 * Splits a props object into style props (for forwarding to Box) and the rest.
 */
export function extractStyleProps<T extends object>(props: T): ExtractReturn<T> {
	const styles: Record<string, unknown> = {}
	const rest: Record<string, unknown> = {}
	for (const key in props) {
		if (STYLE_PROPS_KEYS.has(key as keyof StyleProps))
			styles[key] = props[key]
		else
			rest[key] = props[key]
	}
	return { styles, rest } as ExtractReturn<T>
}

