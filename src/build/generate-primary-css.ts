import type { NuanceDefaultThemeColor } from '../runtime/types'

/** Primary color: a theme palette name or an array of 10 shade values (0..9). */
export type PrimaryColor = NuanceDefaultThemeColor | string[]

/** Palette names that expose base shades `--color-{name}-0..9`. */
const PALETTE_NAMES: NuanceDefaultThemeColor[] = [
	'dark',
	'gray',
	'red',
	'pink',
	'grape',
	'violet',
	'indigo',
	'blue',
	'cyan',
	'green',
	'lime',
	'yellow',
	'orange',
	'teal',
]

const SHADES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

function isPaletteName(value: PrimaryColor): value is NuanceDefaultThemeColor {
	return typeof value === 'string' && PALETTE_NAMES.includes(value as NuanceDefaultThemeColor)
}

// ─── Name ───

/** Aliases `--color-primary-*` to an existing palette. Theme-aware tokens are inherited. */
function fromName(name: NuanceDefaultThemeColor): string {
	const base = SHADES
		.map(shade => `\t--color-primary-${shade}: var(--color-${name}-${shade});`)
		.join('\n')

	return `:root {
${base}

	--color-primary-filled: var(--color-${name}-filled);
	--color-primary-filled-hover: var(--color-${name}-filled-hover);
	--color-primary-light: alpha(var(--color-${name}-light), .15);
	--color-primary-light-hover: var(--color-${name}-light-hover);
	--color-primary-light-color: var(--color-${name}-light-color);
	--color-primary-outline: var(--color-${name}-outline);
	--color-primary-outline-hover: alpha(var(--color-${name}-outline), .1);
}
`
}

// ─── Array ───

/** Derived tokens for one color scheme, mirroring the rules used by named palettes. */
function derivedTokens(scheme: 'light' | 'dark'): string {
	if (scheme === 'light') {
		return `\t\t--color-primary-filled: var(--color-primary-6);
		--color-primary-filled-hover: var(--color-primary-7);
		--color-primary-light: alpha(var(--color-primary-6), .1);
		--color-primary-light-hover: alpha(var(--color-primary-6), .12);
		--color-primary-light-color: var(--color-primary-6);
		--color-primary-outline: var(--color-primary-6);
		--color-primary-outline-hover: alpha(var(--color-primary-6), .05);`
	}

	return `\t\t--color-primary-filled: var(--color-primary-8);
		--color-primary-filled-hover: var(--color-primary-9);
		--color-primary-light: alpha(var(--color-primary-8), .15);
		--color-primary-light-hover: alpha(var(--color-primary-8), .2);
		--color-primary-light-color: var(--color-primary-0);
		--color-primary-outline: var(--color-primary-4);
		--color-primary-outline-hover: alpha(var(--color-primary-4), .05);`
}

/** Emits literal base shades plus per-theme derived tokens. */
function fromArray(shades: string[]): string {
	const base = SHADES
		.map(shade => `\t--color-primary-${shade}: ${shades[shade]};`)
		.join('\n')

	return `:root {
${base}
}

:root {
	@mixin light-root {
${derivedTokens('light')}
	}
}

:root {
	@mixin dark-root {
${derivedTokens('dark')}
	}
}
`
}

/**
 * Builds the `--color-primary-*` CSS block for the configured primary color.
 *
 * Throws when the name is not a known palette or when the array does not hold
 * exactly 10 shades.
 */
export function generatePrimaryCss(primaryColor: PrimaryColor): string {
	if (isPaletteName(primaryColor))
		return fromName(primaryColor)

	if (Array.isArray(primaryColor)) {
		if (primaryColor.length !== 10) {
			throw new Error(
				`[@nuance-ui] "primaryColor" array must contain exactly 10 shades, got ${primaryColor.length}.`,
			)
		}

		return fromArray(primaryColor)
	}

	throw new Error(
		`[@nuance-ui] Unknown "primaryColor" name: "${String(primaryColor)}". `
		+ `Expected one of: ${PALETTE_NAMES.join(', ')}, or an array of 10 shades.`,
	)
}
