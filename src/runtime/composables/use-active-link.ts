import type { ComputedRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'


/**
 * Computes whether a given route target matches the current route.
 *
 * By default the link is active when its resolved path equals the current
 * path or is a prefix of it, so parent routes stay highlighted while
 * browsing nested children.
 *
 * Pass `exact: true` to disable prefix matching.
 */
export function useActiveLink(
	href: RouteLocationRaw | undefined,
	options: {
		/** Require a strict path equality instead of prefix matching. */
		exact?: boolean
	} = {},
): ComputedRef<boolean> {
	const route = useRoute()
	const router = useRouter()
	const { exact = false } = options

	return computed(() => {
		if (!href)
			return false

		const resolvedRoute = router.resolve(href)
		const targetPath = resolvedRoute.path

		if (exact)
			return route.path === targetPath

		if (route.path === targetPath)
			return true

		// Root path must match exactly, otherwise it would be active on every page
		if (targetPath === '/')
			return false

		// Prefix match for nested routes
		return route.path.startsWith(targetPath)
	})
}
