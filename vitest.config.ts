import { defineVitestProject } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'


export default defineConfig({
	test: {
		projects: [
			{
				test: {
					name: 'unit',
					include: ['src/runtime/**/*.{test,spec}.ts'],
					environment: 'node',
				},
			},
			await defineVitestProject({
				test: {
					name: 'nuxt',
					include: ['test/**/*.{test,spec}.ts'],
					environment: 'nuxt',
					environmentOptions: {
						nuxt: {
							rootDir: fileURLToPath(new URL('./playground', import.meta.url)),
							domEnvironment: 'happy-dom',
						},
					},
				},
			}),
		],
	},
})
