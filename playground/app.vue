<script lang='ts' setup>
const theme = useTheme()
</script>

<template>
	<NAppShell aside footer navbar with-border>
		<NAppShellHeader :class='$style.header'>
			<NActionIcon @click='theme.preference = theme.value === "light" ? "dark" : "light"'>
				<Icon :name='theme.value === "light" ? "gravity-ui:moon" : "gravity-ui:sun"' />
			</NActionIcon>
		</NAppShellHeader>
		<NAppShellMain>
			<slot />
		</NAppShellMain>
	</NAppShell>
</template>

<style lang='postcss' module>
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
