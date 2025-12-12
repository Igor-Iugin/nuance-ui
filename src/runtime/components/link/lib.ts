import type { NuxtLinkProps } from '#app'

import { reactiveOmit, reactivePick } from '@vueuse/core'


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

export function pickLinkProps<T extends NuxtLinkProps>(props: T) {
	const link = reactivePick(props, ...linkProps)
	const rest = reactiveOmit(props, ...linkProps)

	return {
		link: {
			...link,
			prefetch: link?.prefetch || undefined,
			noPrefetch: link?.noPrefetch || undefined,
		},
		rest,
	}
}
