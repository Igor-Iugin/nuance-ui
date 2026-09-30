<script setup lang="ts">
import type { FileRejection } from '@nui/composables'


const files = shallowRef<File | null>(null)

const images = shallowRef<File[] | null>(null)
const docs = shallowRef<File[] | null>(null)
const rejections = shallowRef<FileRejection[]>([])

const formatRejection = ({ file, errors }: FileRejection) => `${file.name}: ${errors.join(', ')}`
</script>

<template>
	<NTitle>Components for management files</NTitle>
	<div :class='$style.buttons'>
		<NFileUploadButton @change='f => files = f' />
		<NFileUploadButton size='compact-sm' @change='f => files = f' />
	</div>
	<NText v-if='files'>
		{{ files.name }}
	</NText>

	<NDivider my='xs' />

	<NTitle order='3'>
		Dropzone: multiple images up to 1MB
	</NTitle>
	<NDropzone
		v-model='images'
		multiple
		layout='list'
		accept='image/*'
		:max-size='1024 ** 2'
		label='Drop an image here or click to select'
		description='PNG, JPG, WEBP up to 1MB'
		@reject='r => rejections = r'
	/>

	<NDivider my='xs' />

	<NTitle order='3'>
		Dropzone: up to 3 documents, custom status slots
	</NTitle>
	<NDropzone
		v-model='docs'
		multiple
		layout='list'
		accept='.pdf,.txt,application/pdf,text/plain'
		:max-files='3'
		:validator='file => file.name.startsWith("draft") ? "draft" : null'
		file-delete
		@reject='r => rejections = r'
	>
		<template #label='{ status }'>
			{{ {
				idle: 'Drop PDF or TXT files',
				accept: 'Release to upload',
				reject: 'Only PDF or TXT, max 3 files',
			}[status] }}
		</template>
		<template #description>
			Files named "draft*" are rejected by a custom validator
		</template>
	</NDropzone>

	<NText v-for='r in rejections' :key='r.file.name' :class='$style.error'>
		{{ formatRejection(r) }}
	</NText>
</template>

<style module>
.buttons {
	display: flex;
	gap: var(--spacing-sm);
}

.error {
	color: var(--color-error);
}
</style>
