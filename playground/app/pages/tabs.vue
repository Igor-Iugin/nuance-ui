<script lang='ts' setup>
</script>

<template>
	<div class='root'>
		<!-- ─── Basic (default) ─── -->
		<section>
			<p class='label'>
				Tabs basic
			</p>
			<NTabsRoot default-tab='gallery'>
				<NTabsList>
					<NTabsTab value='gallery'>
						Gallery
					</NTabsTab>
					<NTabsTab value='messages'>
						Messages
					</NTabsTab>
					<NTabsTab value='settings'>
						Settings
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='gallery'>
					Gallery panel content
				</NTabsPanel>
				<NTabsPanel value='messages'>
					Messages panel content
				</NTabsPanel>
				<NTabsPanel value='settings'>
					Settings panel content
				</NTabsPanel>
			</NTabsRoot>
		</section>
	</div>
</template>

<style scoped>
.root {
	display: flex;
	flex-direction: column;

	gap: 2rem;

	padding: 2rem;
}

.label {
	margin: 0;

	font-size: 0.75rem;
	color: var(--color-gray-6);
}
</style>
