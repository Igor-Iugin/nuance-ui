import { antfu } from '@antfu/eslint-config'
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt(
	{
		features: {
			// Rules for module authors
			tooling: true,
			standalone: false,
		},
		dirs: {
			src: [
				'./playground',
			],
		},
	},
	antfu({
		ignores: ['**/*.json'],
		stylistic: {
			indent: 'tab',
			overrides: {
				'style/quotes': ['error', 'single', { avoidEscape: true }],
				'style/jsx-quotes': ['error', 'prefer-single'],
				'style/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 1 }],
				'style/arrow-parens': ['error', 'as-needed'],
				'style/indent': ['error', 'tab', {
					offsetTernaryExpressions: false,
					SwitchCase: 1,
					VariableDeclarator: 'first',
				}],

				'node/prefer-global/process': 'off',
				'no-console': ['warn'],
				'no-template-curly-in-string': 'off',

				'import/newline-after-import': ['error', { count: 2 }],
				'perfectionist/sort-imports': [
					'error',
					{
						type: 'alphabetical',
						order: 'asc',
						ignoreCase: true,
						newlinesBetween: 'always',
						groups: [
							'type',
							['builtin', 'external'],
							'internal-type',
							'internal',
							['parent-type', 'sibling-type', 'index-type'],
							['parent', 'sibling', 'index'],
							'object',
							'unknown',
						],
					},
				],
			},
		},
		typescript: {
			overrides: {
				'ts/consistent-type-imports': [
					'error',
					{
						fixStyle: 'separate-type-imports',
						prefer: 'type-imports',
					},
				],
				'ts/no-explicit-any': 'off',
				'ts/ban-ts-comment': 'off',
				'ts/no-unnecessary-type-constraint': 'off',
				'ts/no-unused-vars': ['error', {
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				}],
				'ts/no-non-null-asserted-optional-chain': 'off',
			},
		},
		vue: {
			overrides: {
				'vue/html-quotes': ['error', 'single', { avoidEscape: true }],
				'vue/component-name-in-template-casing': ['error', 'PascalCase'],
				'vue/html-indent': ['error', 'tab'],
			},
		},
	}),
)
