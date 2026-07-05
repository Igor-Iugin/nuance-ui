import type { AppShellProps } from './app-shell.vue'


declare module '#app' {
	interface PageMeta {
		shell?: Pick<
			AppShellProps,
			| 'hideAside'
			| 'hideFooter'
			| 'hideHeader'
			| 'hideNavbar'
		>
	}
}

export {}
