<script lang='ts' setup generic='Multiple extends boolean = false'>
import type { UseFileDialogOptions } from '@vueuse/core'
import type { MaybeRef } from 'vue'

import { useFileDialog } from '@vueuse/core'
import { computed, toValue } from 'vue'

import type { ButtonProps } from '../button'

import Button from '../button/button.vue'


export interface FileUploadButtonProps<M extends boolean> extends ButtonProps, UseFileDialogOptions {
	/** Icon passed to leftSection */
	icon?: string
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
	icon = 'gravity-ui:plus',
	...props
} = defineProps<FileUploadButtonProps<Multiple>>()

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
	<Button v-bind='props' @click='open'>
		<template #leftSection>
			<slot name='leftSection'>
				<Icon :name='icon' />
			</slot>
		</template>
		<template v-if='!!$slots.rightSection' #rightSection>
			<slot name='rightSection' />
		</template>

		<slot>Загрузить файл</slot>
	</Button>
</template>
