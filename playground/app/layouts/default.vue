<script lang='ts' setup>
import { NModalsProvider } from '@nui/modals'


useHead({
	title: 'Компоненты',
})
</script>

<template>
	<NAppShell
		:class='$style.root'
		hide-aside
		hide-footer
		with-border
		:date-config='{ locale: "ru-RU" }'
	>
		<NAppShellNavbar :class='$style.navbar'>
			<NNavLink to='/button'>
				Button
			</NNavLink>
			<NNavLink to='/badge'>
				Badge
			</NNavLink>
			<NNavLink to='/file'>
				Files
			</NNavLink>
			<NNavLink to='/inputs'>
				Inputs
			</NNavLink>
			<NNavLink to='/action-icon'>
				Action Icon
			</NNavLink>
			<NNavLink to='/alert'>
				Alert
			</NNavLink>
			<NNavLink to='/dates'>
				Dates
			</NNavLink>
			<NNavLink to='/avatar'>
				Avatar
			</NNavLink>
			<NNavLink to='/breadcrumbs'>
				Breadcrumbs
			</NNavLink>
			<NNavLink to='/tree'>
				Tree
			</NNavLink>
			<NNavLink to='/table'>
				Table
			</NNavLink>
			<NNavLink to='/progress'>
				Progress
			</NNavLink>
			<NNavLink to='/checkbox'>
				Checkbox
			</NNavLink>
			<NNavLink to='/form'>
				Form
			</NNavLink>
			<NNavLink to='/modals'>
				Modals
			</NNavLink>
			<NNavLink to='/segmented-control'>
				Segmented control
			</NNavLink>
			<NNavLink to='/tabs'>
				Tabs
			</NNavLink>
			<NNavLink to='/scroll-area'>
				ScrollArea
			</NNavLink>
			<NNavLink to='/collapsible'>
				Collapsible
			</NNavLink>
			<NNavLink to='/timeline'>
				Timeline
			</NNavLink>
		</NAppShellNavbar>

		<NAppShellHeader :class='$style.header'>
			<NThemeToggle />
		</NAppShellHeader>
		<NAppShellMain>
			<slot />
		</NAppShellMain>
		<NModalsProvider />
	</NAppShell>
</template>

<style module>
.root {
	--app-shell-navbar-width: rem(250px);
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.navbar {
	padding: var(--spacing-sm) var(--spacing-xs);
}
</style>
