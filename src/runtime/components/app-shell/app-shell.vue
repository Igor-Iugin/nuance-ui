<script setup lang='ts'>
import type { DateConfig } from '@nui/composals'

import { useProvideDatesConfig } from '@nui/composals'
import { computed } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import { useProvideAppShell } from './context'


export interface AppShellProps extends BoxProps {
	/** Determines how Navbar/Aside are arranged relative to Header/Footer, `default` by default */
	layout?: 'default' | 'alt'

	withBorder?: boolean

	/** Provide app config for dates */
	dateConfig?: Partial<DateConfig>
}

const {
	is,
	mod,
	layout = 'default',
	withBorder = false,
	dateConfig,
} = defineProps<AppShellProps>()

const aside = defineModel<boolean>('aside', { default: false })
const header = defineModel<boolean>('header', { default: false })
const navbar = defineModel<boolean>('navbar', { default: false })
const footer = defineModel<boolean>('footer', { default: false })

useProvideAppShell({ aside, footer, header, navbar	})
useProvideDatesConfig(dateConfig)

const style = computed(() => ({
	'--app-shell-navbar-transform': navbar.value ? 'translateX(calc(-1 * var(--app-shell-navbar-width)))' : undefined,
	'--app-shell-navbar-offset': navbar.value ? '0rem' : undefined,
	'--app-shell-aside-transform': aside.value ? 'translateX(var(--app-shell-aside-width))' : undefined,
	'--app-shell-aside-offset': aside.value ? '0rem' : undefined,
	'--app-shell-header-transform': header.value ? 'translateY(calc(-1 * var(--app-shell-header-height)))' : undefined,
	'--app-shell-header-offset': header.value ? '0rem' : undefined,
	'--app-shell-footer-transform': footer.value ? 'translateY(var(--app-shell-footer-height))' : undefined,
	'--app-shell-footer-offset': footer.value ? '0rem' : undefined,
}))
</script>

<template>
	<Box :is :style :class='$style.root' :mod='[mod, { layout, "with-border": withBorder }]'>
		<slot />
	</Box>
</template>

<style module lang='postcss'>
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

	@mixin light {
		--app-shell-border-color: var(--color-gray-3);
	}

	@mixin dark {
		--app-shell-border-color: var(--color-slate-8);
	}
}
</style>
