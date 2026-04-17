import type { ModuleOptions } from './module'


export const defaultOptions = {
	prefix: 'N',
	autoImport: true,
	theme: 'light',
	toast: {
		limit: 5,
		defaultPosition: 'bottom-right',
	},
} satisfies ModuleOptions
