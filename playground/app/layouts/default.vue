<script lang='ts' setup>
useHead({
	title: 'Компоненты',
})

const theme = useTheme()
</script>

<template>
	<NAppShell :class='$style.root' aside footer with-border>
		<NAppShellNavbar :class='$style.navbar'>
			<NNavLink to='/action-icon'>
				Action Icon
			</NNavLink>
			<NNavLink to='/alert'>
				Alert
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
		</NAppShellNavbar>

		<NAppShellHeader :class='$style.header'>
			<NActionIcon
				:icon='theme.value === "light" ? "gravity-ui:moon" : "gravity-ui:sun"'
				@click='theme.preference = theme.value === "light" ? "dark" : "light"'
			/>
		</NAppShellHeader>
		<NAppShellMain>
			<slot />
		</NAppShellMain>
	</NAppShell>
</template>

<style lang='postcss' module>
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
