<script setup lang='ts'>
import type { DateConfig } from '@nui/composables'

import { useProvideDatesConfig, useVarsResolver } from '@nui/composables'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import { useProvideAppShell } from './context'


interface AppShellVars {
	root:
		| '--app-shell-navbar-transform'
		| '--app-shell-navbar-offset'
		| '--app-shell-aside-transform'
		| '--app-shell-aside-offset'
		| '--app-shell-header-transform'
		| '--app-shell-header-offset'
		| '--app-shell-footer-transform'
		| '--app-shell-footer-offset'
}

export interface AppShellProps extends BoxProps {
	/**
	 * Layout mode. `alt` stretches Navbar/Aside to the full viewport height,
	 * pushing Header/Footer between them.
	 * @default 'default'
	 */
	layout?: 'default' | 'alt'

	/**
	 * Renders dividers between shell sections
	 * @default false
	 */
	withBorder?: boolean

	/** Locale configuration for date-aware features */
	dateConfig?: Partial<DateConfig>

	/** Hides aside on mount */
	hideAside?: boolean

	/** Hides navbar on mount */
	hideNavbar?: boolean

	/** Hides header on mount */
	hideHeader?: boolean

	/** Hides footer on mount */
	hideFooter?: boolean
}

const {
	is,
	mod,
	hideAside,
	hideFooter,
	hideHeader,
	hideNavbar,
	dateConfig,
	withBorder,
	layout = 'default',
	...rest
} = defineProps<AppShellProps>()

const aside = defineModel<boolean>('aside', { default: p => !!p.hideAside })
const header = defineModel<boolean>('header', { default: p => !!p.hideHeader })
const navbar = defineModel<boolean>('navbar', { default: p => !!p.hideNavbar })
const footer = defineModel<boolean>('footer', { default: p => !!p.hideFooter })

useProvideAppShell({ aside, footer, header, navbar })
useProvideDatesConfig(dateConfig)

const route = useRoute()

watch(() => route.meta?.shell, meta => {
	header.value = meta?.hideHeader ?? !!hideHeader
	footer.value = meta?.hideFooter ?? !!hideFooter
	navbar.value = meta?.hideNavbar ?? !!hideNavbar
	aside.value = meta?.hideAside ?? !!hideAside
}, { immediate: true })

const style = useVarsResolver<AppShellVars>(() => ({
	root: {
		'--app-shell-navbar-transform': navbar.value
			? 'translateX(calc(-1 * var(--app-shell-navbar-width)))'
			: undefined,
		'--app-shell-navbar-offset': navbar.value
			? '0rem'
			: undefined,
		'--app-shell-aside-transform': aside.value
			? 'translateX(var(--app-shell-aside-width))'
			: undefined,
		'--app-shell-aside-offset': aside.value
			? '0rem'
			: undefined,
		'--app-shell-header-transform': header.value
			? 'translateY(calc(-1 * var(--app-shell-header-height)))'
			: undefined,
		'--app-shell-header-offset': header.value
			? '0rem'
			: undefined,
		'--app-shell-footer-transform': footer.value
			? 'translateY(var(--app-shell-footer-height))'
			: undefined,
		'--app-shell-footer-offset': footer.value
			? '0rem'
			: undefined,
	},
}))
</script>

<template>
	<Box
		:is
		v-bind='rest'
		:style='style.root'
		:class='$style.root'
		:mod='[{ layout, "with-border": withBorder }, mod]'
	>
		<slot />
	</Box>
</template>

<style module>
.root {
	--app-shell-padding: var(--spacing-sm);
	--app-shell-element-padding: .25rem;

	--app-shell-transition-duration: 200ms;
	--app-shell-transition-timing-function: ease;

	--app-shell-navbar-width: rem(56px);
	--app-shell-navbar-offset: var(--app-shell-navbar-width);
	--app-shell-navbar-transform: none;

	--app-shell-aside-width: rem(56px);
	--app-shell-aside-offset: var(--app-shell-aside-width);
	--app-shell-aside-transform: none;

	--app-shell-header-height: rem(56px);
	--app-shell-header-offset: var(--app-shell-header-height);
	--app-shell-header-transform: none;

	--app-shell-footer-height: rem(100px);
	--app-shell-footer-offset: var(--app-shell-footer-height);
	--app-shell-footer-transform: none;

	--color-navbar: var(--color-body);
	--color-aside: var(--color-body);
	--color-header: var(--color-body);
	--color-footer: var(--color-body);

	@mixin where-light {
		--app-shell-border-color: var(--color-gray-3);
	}

	@mixin where-dark {
		--app-shell-border-color: var(--color-dark-8);
	}
}
</style>
