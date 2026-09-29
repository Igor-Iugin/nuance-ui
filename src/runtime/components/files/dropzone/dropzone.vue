<script lang='ts'>
import type { Classes } from '../../../types/index.ts'
import type { BoxProps } from '../../box/index.ts'
import type { DropzoneFilesClasses, DropzoneFilesEmits, DropzoneFilesProps, DropzoneFilesSlots, DzOpenHandler, DzRemoveHandler } from './dropzone-files.vue'

import Avatar from '../../avatar/avatar.vue'


export type DropzoneValue<M extends boolean> = M extends true ? File[] : File

export interface DropzoneProps<M extends boolean = false>
	extends BoxProps, DropzoneFilesProps {
	id?: string
	/** Input name */
	name?: string
	/** The icon to display. Set to `false` to hide the icon. */
	icon?: string | false
	label?: string
	description?: string
	/**
   * The position of the files.
   * Only works when `layout` is `list`.
   * @default 'outside'
   */
	position?: 'inside' | 'outside'
	/** Highlight the ring color like a focus state. */
	highlight?: boolean
	/**
   * Specifies the allowed file types for the input. Provide a comma-separated list of MIME types or file extensions (e.g., "image/png,application/pdf,.jpg").
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
   * @default '*'
   */
	accept?: string
	multiple?: M & boolean
	/** Reset the file input when the dialog is opened. @default false */
	reset?: boolean
	/**
   * Make the dropzone interactive when the user is clicking on it.
   * @default true
   */
	interactive?: boolean
	required?: boolean
	disabled?: boolean
	/** Show the file preview/list after upload. @default true */
	preview?: boolean
	classes?: Classes<
		| 'root'
		| 'avatar'
		| 'label'
		| 'description'
		| 'actions'
	> & DropzoneFilesClasses
}

export interface DropzoneSlots<M extends boolean = false>
	extends DropzoneFilesSlots<M> {
	default: [
		open: DzOpenHandler,
		removeFile: DzRemoveHandler,
		ui: string,
	]
	leading: [ui: string]
	label: []
	description: []
	actions: [
		files: DropzoneValue<M> | undefined,
		open: DzOpenHandler,
		removeFile: DzRemoveHandler,
	]
}
</script>

<script setup lang='ts' generic='M extends boolean = false'>
import { useConfig, useFileUpload } from '@nui/composables'
import { unrefElement } from '@vueuse/core'
import { pick } from 'es-toolkit'
import { computed, useTemplateRef, watch } from 'vue'

import Box from '../../box/box.vue'
import VisuallyHiddenInput from '../../visually-hidden/visually-hidden-input.vue'
import DropzoneFiles from './dropzone-files.vue'
import css from './dropzone.module.css'


defineOptions({ inheritAttrs: false })

const {
	id,
	name,
	required,
	disabled,
	// ---
	accept = '*',
	interactive = true,
	preview = true,
	position: pos = 'outside',
	multiple,
	reset,
	classes,
	icon: _icon,
	label,
	description,
	// ---
	layout = 'grid',
	color,
	fileIcon,
	fileImage,
	fileDelete,
	fileDeleteIcon,
	format,
	...rest
} = defineProps<DropzoneProps>()

const emits = defineEmits<{ change: [event: Event] } & DropzoneFilesEmits>()

defineSlots<DropzoneSlots<M>>()

const modelValue = defineModel<DropzoneValue<M> | null>()

const config = useConfig()

const icon = computed(() => _icon ?? config.icons.upload)
const position = computed(() => layout === 'grid' && multiple ? 'grid' : pos)

function onUpdate(files: File[], multiple?: boolean) {
	if (disabled)
		return

	if (multiple) {
		if (reset) {
			modelValue.value = files as DropzoneValue<M>
		}
		else {
			const existing = (modelValue.value as File[]) || []
			modelValue.value = [...existing, ...(files || [])] as DropzoneValue<M>
		}
	}
	else {
		modelValue.value = (files?.[0] ?? null) as DropzoneValue<M> | null
	}
	// @ts-expect-error - 'target' does not exist in type 'EventInit'
	const event = new Event('change', { target: { value: modelValue.value } })
	emits('change', event)
}

const dropzoneRef = useTemplateRef<HTMLDivElement>('zone')
const inputRef = useTemplateRef<HTMLInputElement>('input')
const { isOverDropZone, open } = useFileUpload(inputRef, dropzoneRef, {
	multiple,
	accept,
	reset,
	onUpdate,
})

function remove(ix?: number) {
	if (!modelValue.value)
		return

	if (!multiple || ix === undefined) {
		onUpdate([], true)
	}
	else {
		const files = [...modelValue.value as File[]]
		files.splice(ix, 1)

		onUpdate(files, true)
	}

	unrefElement(dropzoneRef)?.focus()
}

watch(modelValue, value => {
	const hasReset = multiple ? !(value as File[]) : !value

	if (hasReset && unrefElement(inputRef))
		unrefElement(inputRef)!.value = ''
})

defineExpose({
	input: inputRef,
	dropzone: dropzoneRef,
})
</script>

<template>
	<Box v-bind='rest'>
		<slot :open='open' :remove='remove' :ui='css.root'>
			<Box
				ref='zone'
				:class='[css.root, classes?.root]'
				:aria-disabled='disabled || undefined'
				:mod='{ dragging: isOverDropZone }'
				:tab-index='interactive && !disabled ? 0 : -1'
				@click='interactive && !disabled && open()'
				@keydown.space.prevent
				@keydown.enter.space='interactive && !disabled && open()'
			>
				<DropzoneFiles
					v-if='position === "outside"'
					v-model='modelValue'
					:classes='classes && pick(classes, [
						"files",
						"file",
						"fileName",
						"fileSize",
						"fileWrapper",
						"fileTrailingButton",
						"fileLeadingAvatar",
					])'
					:color
					:file-delete
					:file-delete-icon
					:file-icon
					:file-image
					:format
					@remove='ix => $emit("remove", ix)'
				>
					<template v-if='$slots["files-top"]' #files-top>
						<slot
							name='files-top'
							:files='modelValue'
							:open='open'
							:remove='remove'
						/>
					</template>

					<template #file='{ file, ix, remove }'>
						<slot name='file' :file :ix :remove />
					</template>

					<template #files='{ files, remove }'>
						<slot name='files' :files :remove />
					</template>

					<template #file-name='{ file, ix }'>
						<slot name='file-name' :file :ix />
					</template>

					<template #file-leading='{ file, ix, ui }'>
						<slot name='file-leading' :file :ix :ui />
					</template>

					<template #file-size='{ file, ix }'>
						<slot name='file-size' :file :ix />
					</template>

					<template #file-trailing='{ file, ix, ui, remove }'>
						<slot name='file-trailing' :file :ix :ui :remove />
					</template>

					<template v-if='!!$slots["files-bottom"]' #files-bottom>
						<slot
							name='files-bottom'
							:files='modelValue'
							:open='open'
							:remove='remove'
						/>
					</template>
				</DropzoneFiles>

				<div
					v-if='position === "inside"
						? !preview || (
							multiple ? (modelValue as File[])?.length : !modelValue
						)
						: true'
					:class='css.wrapper'
				>
					<slot name='leading' :ui='css.avatar'>
						<Avatar
							v-if='icon !== false'
							:icon
							:size
							:class='[css.avatar, classes?.avatar]'
						/>
					</slot>

					<div
						v-if='label || !!$slots.label'
						:class='[css.label, classes?.label]'
					>
						<slot name='label'>
							{{ label }}
						</slot>
					</div>
					<div
						v-if='description || !!$slots.description'
						:class='[css.description, classes?.description]'
					>
						<slot name='description'>
							{{ description }}
						</slot>
					</div>

					<div
						v-if='!!$slots.actions'
						:class='[css.actions, classes?.actions]'
					>
						<slot
							name='actions'
							:files='modelValue'
							:open='open'
							:remove-file='remove'
						/>
					</div>
				</div>
			</Box>

			<DropzoneFiles
				v-if='position === "outside"'
				v-model='modelValue'
				:classes='classes && pick(classes, [
					"files",
					"file",
					"fileName",
					"fileSize",
					"fileWrapper",
					"fileTrailingButton",
					"fileLeadingAvatar",
				])'
				:color
				:file-delete
				:file-delete-icon
				:file-icon
				:file-image
				:format
				@remove='ix => $emit("remove", ix)'
			>
				<template v-if='$slots["files-top"]' #files-top>
					<slot
						name='files-top'
						:files='modelValue'
						:open='open'
						:remove='remove'
					/>
				</template>

				<template #file='{ file, ix, remove }'>
					<slot name='file' :file :ix :remove />
				</template>

				<template #files='{ files, remove }'>
					<slot name='files' :files :remove />
				</template>

				<template #file-name='{ file, ix }'>
					<slot name='file-name' :file :ix />
				</template>

				<template #file-leading='{ file, ix, ui }'>
					<slot name='file-leading' :file :ix :ui />
				</template>

				<template #file-size='{ file, ix }'>
					<slot name='file-size' :file :ix />
				</template>

				<template #file-trailing='{ file, ix, ui, remove }'>
					<slot name='file-trailing' :file :ix :ui :remove />
				</template>

				<template v-if='!!$slots["files-bottom"]' #files-bottom>
					<slot
						name='files-bottom'
						:files='modelValue'
						:open='open'
						:remove='remove'
					/>
				</template>
			</DropzoneFiles>
		</slot>


		<VisuallyHiddenInput
			:id
			ref='input'
			type='file'
			:name='name'
			:accept
			:multiple
			:required
			:disabled
			v-bind='$attrs'
		/>
	</Box>
</template>
