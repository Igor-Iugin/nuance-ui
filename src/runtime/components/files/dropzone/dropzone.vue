<script lang='ts'>
import type { FileError, FileRejection, FileUploadStatus } from '../../../composables/use-file-upload.ts'
import type { Classes } from '../../../types/index.ts'
import type { BoxProps } from '../../box/index.ts'
import type { DropzoneFilesClasses, DropzoneFilesProps, DropzoneFilesSlots, DzOpenHandler, DzRemoveHandler } from './dropzone-files.vue'

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
	/** Maximum file size in bytes */
	maxSize?: number
	/** Maximum number of files per selection, exceeding it rejects the whole selection */
	maxFiles?: number
	/** Custom check, returns an error code for an invalid file */
	validator?: (file: File) => FileError | null | undefined
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
	default: (props: {
		open: DzOpenHandler
		remove: DzRemoveHandler
		ui: string
		status: FileUploadStatus
		rejections: FileRejection[]
	}) => any
	leading: (props: { ui: string, status: FileUploadStatus }) => any
	label: (props: { status: FileUploadStatus }) => any
	description: (props: { status: FileUploadStatus }) => any
	actions: (props: {
		files: DropzoneValue<M> | null | undefined
		open: DzOpenHandler
		remove: DzRemoveHandler
		rejections: FileRejection[]
	}) => any
}
</script>

<script setup lang='ts' generic='M extends boolean = false'>
import { useConfig, useFileUpload } from '@nui/composables'
import { createReusableTemplate, unrefElement } from '@vueuse/core'
import { pick } from 'es-toolkit'
import { computed, shallowRef, useTemplateRef, watch } from 'vue'

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
	maxSize,
	maxFiles,
	validator,
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
	fileDelete = true,
	fileDeleteIcon,
	format,
	...rest
} = defineProps<DropzoneProps<M>>()

const emits = defineEmits<{
	change: [event: Event]
	/** Some of the selected files failed validation */
	reject: [rejections: FileRejection[]]
}>()

defineSlots<DropzoneSlots<M>>()

const modelValue = defineModel<DropzoneValue<M> | null>({
	default: p => (p.multiple ? [] : null) as unknown as DropzoneValue<M>,
})

const config = useConfig()

const [DefineFiles, ReuseFiles] = createReusableTemplate()

const icon = computed(() => _icon ?? config.icons.upload)
const position = computed(() => layout === 'grid' && multiple ? 'grid' : pos)

const rejections = shallowRef<FileRejection[]>([])

function setFiles(files: File[], replace = reset) {
	if (disabled)
		return

	if (multiple) {
		const existing = replace ? [] : (modelValue.value as File[] | null) ?? []
		modelValue.value = [...existing, ...files] as DropzoneValue<M>
	}
	else {
		modelValue.value = (files[0] ?? null) as DropzoneValue<M> | null
	}
	// @ts-expect-error - 'target' does not exist in type 'EventInit'
	const event = new Event('change', { target: { value: modelValue.value } })
	emits('change', event)
}

function onUpdate(files: File[], rejected: FileRejection[]) {
	if (disabled)
		return

	rejections.value = rejected
	if (rejected.length)
		emits('reject', rejected)
	if (files.length)
		setFiles(files)
}

const dropzoneRef = useTemplateRef<HTMLDivElement>('zone')
const inputRef = useTemplateRef<HTMLInputElement>('input')
const { isOverDropZone, status, open } = useFileUpload(inputRef, dropzoneRef, {
	multiple,
	accept,
	reset,
	maxSize: () => maxSize,
	maxFiles: () => maxFiles,
	validator: file => validator?.(file),
	onUpdate,
})

const statusIcon = computed(() => ({
	idle: icon.value as string,
	accept: config.icons.check,
	reject: config.icons.close,
})[status.value])

function remove(ix?: number) {
	if (!modelValue.value)
		return

	if (!multiple || ix === undefined) {
		setFiles([], true)
	}
	else {
		const files = [...modelValue.value as File[]]
		files.splice(ix, 1)

		setFiles(files, true)
	}

	unrefElement(dropzoneRef)?.focus()
}

watch(modelValue, value => {
	const hasReset = multiple ? !(value as File[]) : !value

	if (hasReset && unrefElement(inputRef))
		unrefElement(inputRef)!.value = ''
})

defineExpose({
	$el: inputRef,
	dropzone: dropzoneRef,
	open,
})
</script>

<template>
	<Box v-bind='rest'>
		<DefineFiles>
			<DropzoneFiles
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
				@remove='remove'
			>
				<template v-for='(_, slot) in $slots' #[slot]='scope'>
					<slot
						:name='slot as keyof DropzoneSlots<M>'
						v-bind='scope'
					/>
				</template>
			</DropzoneFiles>
		</DefineFiles>

		<slot :open :remove :ui='css.root' :status :rejections>
			<Box
				ref='zone'
				:class='[css.root, classes?.root]'
				:aria-disabled='disabled || undefined'
				:mod='{ dragging: isOverDropZone, status: !disabled && status }'
				:tab-index='interactive && !disabled ? 0 : -1'
				@click='interactive && !disabled && open()'
				@keydown.space.prevent
				@keydown.enter.space='interactive && !disabled && open()'
			>
				<ReuseFiles v-if='preview && position === "inside"' />

				<div
					v-if='position === "inside" ? !preview || (
						multiple ? (modelValue as File[])?.length : !modelValue
					) : true'
					:class='css.wrapper'
				>
					<slot name='leading' :ui='css.avatar' :status>
						<Avatar
							v-if='icon !== false'
							:icon='statusIcon'
							:size
							:class='[css.avatar, classes?.avatar]'
						/>
					</slot>

					<div
						v-if='label || !!$slots.label'
						:class='[css.label, classes?.label]'
					>
						<slot name='label' :status>
							{{ label }}
						</slot>
					</div>
					<div
						v-if='description || !!$slots.description'
						:class='[css.description, classes?.description]'
					>
						<slot name='description' :status>
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
							:remove='remove'
							:rejections
						/>
					</div>
				</div>
			</Box>

			<ReuseFiles v-if='preview && position === "outside"' />
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
