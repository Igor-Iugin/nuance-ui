<script lang='ts' setup generic='Multiple extends boolean = false'>
import type { UseFileDialogOptions } from '@vueuse/core'
import type { MaybeRef } from 'vue'

import { useConfig } from '@nui/composables'
import { useFileDialog } from '@vueuse/core'
import { computed, toValue } from 'vue'

import type { ButtonProps, ButtonSlots } from '../button'

import Button from '../button/button.vue'


export interface FileUploadButtonProps<M extends boolean> extends ButtonProps, UseFileDialogOptions {
	/** Icon passed to leftSection */
	icon?: string

	/**
	 * Allows selecting multiple files
	 * @default false
	 */
	multiple?: MaybeRef<M>

	/**
	 * Accepted file types
	 * @default '*'
	 */
	accept?: MaybeRef<string>

	/**
	 * Resets selected files when the dialog opens
	 * @default false
	 */
	reset?: MaybeRef<boolean>

	/**
	 * Selects directories instead of files
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
	icon: _icon,
	square = undefined,
	...props
} = defineProps<FileUploadButtonProps<Multiple>>()

const emit = defineEmits<{
	change: [files: FileUploadFiles<Multiple>]
	cancel: []
}>()

defineSlots<ButtonSlots>()

const { icons } = useConfig()
const icon = computed(() => _icon ?? icons.upload)

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
	<Button v-bind='props' :square :icon @click='open()'>
		<template v-for='(_, slot) in $slots' #[slot]='scope'>
			<slot :name='slot as keyof ButtonSlots' v-bind='scope' />
		</template>
	</Button>
</template>
