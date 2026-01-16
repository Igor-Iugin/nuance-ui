<script setup lang="ts">
const cFile = shallowRef<File | null>(null)
const files = shallowRef<File[] | null>(null)
</script>

<template>
	<NTitle>Components for management files</NTitle>
	<NFileUpload @change='f => cFile = f' />
	<NText v-if='cFile'>
		{{ cFile.name }}
	</NText>

	<hr>

	<NFileUpload multiple @change='f => files = f' />
	<NText v-for='file in files' :key='file.name'>
		{{ file.name }}
	</NText>
</template>
