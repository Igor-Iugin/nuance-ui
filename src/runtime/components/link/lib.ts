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
	const link: Pick<T, NuxtLinkParams> = {}
	const rest = {} as Omit<T, NuxtLinkParams>

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

	return {
		link: {
			...link,
			prefetch: link?.prefetch ?? undefined,
			noPrefetch: link?.noPrefetch ?? undefined,
		},
		rest,
	}
}
