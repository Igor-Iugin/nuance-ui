<script setup lang="ts">
const cFile = shallowRef<File | null>(null)
const files = shallowRef<File[] | null>(null)
</script>

<template>
	<NTitle>Components for management files</NTitle>
	<div :class='$style.buttons'>
		<NFileUploadIcon @change='f => cFile = f' />
		<NFileUploadButton size='compact-sm' @change='f => cFile = f' />
	</div>
	<NText v-if='cFile'>
		{{ cFile.name }}
	</NText>

	<hr>

	<div :class='$style.buttons'>
		<NFileUploadIcon multiple @change='f => files = f' />
		<NFileUploadButton size='compact-sm' multiple @change='f => files = f' />
	</div>
	<NText v-for='file in files' :key='file.name'>
		{{ file.name }}
	</NText>
</template>

<style lang="postcss" module>
.buttons {
	display: flex;
	gap: var(--spacing-sm);
}
</style>
