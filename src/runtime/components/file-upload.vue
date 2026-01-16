<script lang='ts' setup generic='Multiple extends boolean = false'>
import type { UseFileDialogOptions } from '@vueuse/core'
import type { MaybeRef } from 'vue'

import { useFileDialog } from '@vueuse/core'
import { computed, toValue } from 'vue'

import type { ActionIconProps } from './action-icon/action-icon.vue'

import ActionIcon from './action-icon/action-icon.vue'


export interface FileUploadProps<M extends boolean> extends ActionIconProps, UseFileDialogOptions {
	/**
	 * @default false
	 */
	multiple?: MaybeRef<M>
	/**
	 * @default '*'
	 */
	accept?: MaybeRef<string>
	/**
	 * Reset when open file dialog.
	 * @default false
	 */
	reset?: MaybeRef<boolean>
	/**
	 * Select directories instead of files.
	 * @see [HTMLInputElement webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory)
	 * @default false
	 */
	directory?: MaybeRef<boolean>
}
type FileUploadFiles<M> = (M extends true ? File[] : File) | null

const {
	multiple,
	accept,
	reset: _reset,
	directory,
	icon = 'gravity-ui:arrow-shape-up-from-line',
	...props
} = defineProps<FileUploadProps<Multiple>>()

const emit = defineEmits<{
	change: [files: FileUploadFiles<Multiple>]
	cancel: []
}>()


const isMultiple = computed(() => {
	const val = toValue(multiple)
	// @ts-expect-error
	return val === true || val === '' || val === 'true'
})

const { files, open, onChange, onCancel, reset } = useFileDialog({
	multiple: isMultiple,
	accept,
	reset: _reset,
	directory,
})

onChange(fileList => {
	if (!fileList)
		return emit('change', null)

	const filesArray = Array.from(fileList)

	if (isMultiple.value) {
		emit('change', filesArray as FileUploadFiles<Multiple>)
	}
	else {
		emit('change', (filesArray[0] || null) as FileUploadFiles<Multiple>)
	}
})
onCancel(() => emit('cancel'))

defineExpose({ files, reset })
</script>

<template>
	<ActionIcon :icon v-bind='props' @click='open' />
</template>
