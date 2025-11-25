import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'


export function useActiveLink(
	href: RouteLocationRaw | undefined,
	options: {
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

		// Для главной страницы только точное совпадение
		if (targetPath === '/')
			return false

		// Проверка префикса для вложенных страниц
		return route.path.startsWith(targetPath)
	})
}
