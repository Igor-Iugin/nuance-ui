import type { NuxtLinkProps } from '#app'


const linkProps = [
	'to',
	'target',
	'external',
	'rel',
	'noRel',
	'prefetch',
	'noPrefetch',
	'replace',
	'prefetchOn',
	'trailingSlash',
	'activeClass',
	'ariaCurrentValue',
	'exactActiveClass',
	'prefetchedClass',
	'viewTransition',
] as const

type NuxtLinkParams = typeof linkProps[number]

export function pickLinkProps<T extends NuxtLinkProps>(props: T) {
	const rest = {} as Omit<T, NuxtLinkParams>
	let link: Pick<T, NuxtLinkParams> = {}

	for (const key in props) {
		if (linkProps.includes(key as any)) {
			// @ts-ignore
			link[key] = props[key]
		}
		else {
			// @ts-ignore
			rest[key] = props[key]
		}
	}

	link = Object.fromEntries(Object.entries(link).filter(([_, value]) => value !== undefined && value !== false))

	return {
		link,
		rest,
	}
}
