<script lang='ts'>
import type { FileError, FileRejection, FileUploadStatus } from '@nui/composables'
import type { Classes } from '@nui/types'

import type { BoxProps } from '../box/index.ts'
import type {
	DropzoneFilesClasses,
	DropzoneFilesProps,
	DropzoneFilesSlots,
	DzOpenHandler,
	DzRemoveHandler,
} from './file-list.vue'

import Avatar from '../avatar/avatar.vue'


export interface DropzoneVars {
	root:
		| '--dropzone-fz'
		| '--dropzone-file-fz'
		| '--dropzone-file-px'
		| '--dropzone-file-gap'
		| '--dropzone-color'
}

export type DropzoneValue<M extends boolean> = M extends true ? File[] : File

export interface DropzoneProps<M extends boolean = false>
	extends BoxProps, DropzoneFilesProps<M> {
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
import { useConfig, useFileUpload, useVarsResolver } from '@nui/composables'
import { getSize, getThemeColor } from '@nui/utils'
import { createReusableTemplate, unrefElement } from '@vueuse/core'
import { pick } from 'es-toolkit'
import { computed, shallowRef, useTemplateRef, watch } from 'vue'

import Box from '../box/box.vue'
import VisuallyHiddenInput from '../visually-hidden/visually-hidden-input.vue'
import FileList from './file-list.vue'


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
	maxSize,
	maxFiles,
	validator,
	reset,
	classes,
	icon: _icon = undefined,
	label,
	description,
	// ---
	multiple,
	layout = 'grid',
	color,
	fileIcon,
	fileImage = true,
	fileDelete = true,
	fileDeleteIcon,
	format,
	size = 'md',
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

const style = useVarsResolver<DropzoneVars>(theme => ({
	root: {
		'--dropzone-fz': getSize(size, 'dropzone-fz'),
		'--dropzone-file-fz': getSize(size, 'dropzone-file-fz'),
		'--dropzone-file-px': getSize(size, 'dropzone-file-px'),
		'--dropzone-file-gap': getSize(size, 'dropzone-file-gap'),
		'--dropzone-color': color ? getThemeColor(color, theme) : undefined,
	},
}))

const [DefineFiles, ReuseFiles] = createReusableTemplate()

const icon = computed(() => _icon ?? config.icons.upload)
const position = computed(() => layout === 'grid' ? 'inside' : pos)

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
	idle: icon.value !== false ? icon.value : config.icons.upload,
	accept: config.icons.check,
	reject: config.icons.close,
})[status.value])

const noValue = computed(() => multiple
	? !(modelValue.value as File[])?.length
	: !modelValue.value)

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
	<Box
		v-bind='rest'
		:class='$style.wrapper'
		:style='style.root'
		:mod='[{
			status: !disabled && status,
			position,
			size,
			highlight,
			interactive,
			disabled,
		}]'
	>
		<DefineFiles>
			<FileList
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
				:layout
				:multiple
				:size
				@remove='remove'
			>
				<template v-for='(_, slot) in $slots' #[slot]='scope'>
					<slot
						:name='slot as keyof DropzoneSlots<M>'
						v-bind='scope'
					/>
				</template>
			</FileList>
		</DefineFiles>

		<slot :open :remove :ui='$style.root' :status :rejections>
			<Box
				ref='zone'
				:class='[$style.root, classes?.root]'
				:aria-disabled='disabled || undefined'
				:mod='{ dragging: isOverDropZone }'
				:tab-index='interactive && !disabled ? 0 : -1'
				@click='interactive && !disabled && open()'
				@keydown.space.prevent
				@keydown.enter.space='interactive && !disabled && open()'
			>
				<ReuseFiles v-if='preview && !noValue && position === "inside"' />

				<div
					v-if='position === "inside" ? !preview || noValue : true'
					:class='$style.inner'
				>
					<slot name='leading' :ui='$style.avatar' :status>
						<Avatar
							v-if='icon !== false'
							:fallback='statusIcon'
							:size
							:class='[$style.avatar, classes?.avatar]'
						/>
					</slot>

					<div
						v-if='label || !!$slots.label'
						:class='[$style.label, classes?.label]'
					>
						<slot name='label' :status>
							{{ label }}
						</slot>
					</div>
					<div
						v-if='description || !!$slots.description'
						:class='[$style.description, classes?.description]'
					>
						<slot name='description' :status>
							{{ description }}
						</slot>
					</div>

					<div
						v-if='!!$slots.actions'
						:class='[$style.actions, classes?.actions]'
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

			<ReuseFiles v-if='preview && !noValue && position === "outside"' />
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

<style module>
.wrapper {
	--dropzone-fz-xs: var(--font-size-sm);
	--dropzone-fz-sm: var(--font-size-sm);
	--dropzone-fz-md: var(--font-size-md);
	--dropzone-fz-lg: var(--font-size-md);
	--dropzone-fz-xl: var(--font-size-lg);

	--dropzone-file-fz-xs: var(--font-size-sm);
	--dropzone-file-fz-sm: var(--font-size-sm);
	--dropzone-file-fz-md: var(--font-size-sm);
	--dropzone-file-fz-lg: var(--font-size-md);
	--dropzone-file-fz-xl: var(--font-size-md);

	--dropzone-file-px-xs: rem(8px);
	--dropzone-file-px-sm: rem(10px);
	--dropzone-file-px-md: rem(10px);
	--dropzone-file-px-lg: rem(12px);
	--dropzone-file-px-xl: rem(12px);

	--dropzone-file-gap-xs: rem(4px);
	--dropzone-file-gap-sm: rem(6px);
	--dropzone-file-gap-md: rem(6px);
	--dropzone-file-gap-lg: rem(8px);
	--dropzone-file-gap-xl: rem(8px);

	--dropzone-fz: var(--dropzone-fz-md);
	--dropzone-file-fz: var(--dropzone-file-fz-md);
	--dropzone-file-px: var(--dropzone-file-px-md);
	--dropzone-file-gap: var(--dropzone-file-gap-md);
	--dropzone-color: var(--color-primary-filled);
	--dropzone-bdrs: var(--radius-default);

	position: relative;

	display: flex;
	flex-direction: column;
	gap: var(--spacing-xs);

	&:where([data-disabled]) {
		cursor: not-allowed;

		opacity: .75;
	}
}

/* ─── ZONE ─── */

.root {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: var(--spacing-xs);
	align-items: stretch;
	justify-content: center;

	width: 100%;
	min-width: 0;
	padding: var(--spacing-md);
	border: rem(1px) dashed var(--color-default-border);
	border-radius: var(--dropzone-bdrs);

	font-size: var(--dropzone-fz);

	background-color: var(--color-default);

	transition: background-color 200ms ease-out;

	&:focus-visible {
		border-color: var(--dropzone-color);

		outline: 3px solid alpha(var(--dropzone-color), 0.25);
	}

	&:where([data-dragging]) {
		background-color: alpha(var(--color-default-hover), 0.25);
	}

	:where([data-highlight]) & {
		border-color: var(--dropzone-color);
	}

	:where([data-interactive]:not([data-disabled])) & {
		cursor: pointer;

		@mixin hover {
			background-color: alpha(var(--color-default-hover), 0.25);
		}
	}
}

.inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	padding: var(--spacing-sm) var(--spacing-md);

	text-align: center;
}

.avatar {
	flex-shrink: 0;
}

.label {
	margin-top: var(--spacing-xs);

	font-weight: 500;
	color: var(--color-text);
}

.description {
	margin-top: var(--spacing-2xs);

	color: var(--color-dimmed);
}

.actions {
	display: flex;
	flex-shrink: 0;
	flex-wrap: wrap;
	gap: rem(6px);

	margin-top: var(--spacing-md);
}
</style>
