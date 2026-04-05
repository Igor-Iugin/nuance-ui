<script setup lang='ts'>
</script>

<template>
	<div class='root'>
		<NButton>
			Test
		</NButton>

		<!-- ─── HORIZONTAL GROUP ─── -->
		<NButtonGroup>
			<NButton size='sm'>
				Left
			</NButton>
			<NButton size='sm'>
				Middle
			</NButton>
			<NButton size='sm'>
				Right
			</NButton>
		</NButtonGroup>

		<!-- ─── VERTICAL GROUP ─── -->
		<NButtonGroup orientation='vertical'>
			<NButton size='sm'>
				Top
			</NButton>
			<NButton size='sm'>
				Middle
			</NButton>
			<NButton size='sm'>
				Bottom
			</NButton>
		</NButtonGroup>

		<!-- ─── MIXED GROUP (Button + ActionIcon) ─── -->
		<NButtonGroup>
			<NButton size='sm'>
				Action
			</NButton>
			<NActionIcon size='input-sm' icon='gravity-ui:trash-bin' />
			<NButton size='sm'>
				More
			</NButton>
		</NButtonGroup>
	</div>
</template>

<style scoped>
.root {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	align-items: flex-start;
}
</style>
