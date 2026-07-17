<script setup lang='ts'>
</script>

<template>
	<div class='root'>
		<NTooltip
			label='Текст'
			content='Подпись на карте'
			footer='Test: work mode'
		>
			<NButton>
				Test
			</NButton>
		</NTooltip>

		<NButtonGroup>
			<NActionIcon
				icon='lucide:box'
			/>
			<NActionIcon
				icon='lucide:chevron-down'
				w='12px'
				miw='auto'
				icon-size='100%'
			/>
		</NButtonGroup>

		<!-- ─── HORIZONTAL GROUP ─── -->
		<NButtonGroup>
			<NTooltip label='Test'>
				<NButton size='sm'>
					Left
				</NButton>
			</NTooltip>
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
			<NButton>
				Action
			</NButton>
			<NActionIcon size='sm' icon='lucide:trash' />
			<NButton>
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
