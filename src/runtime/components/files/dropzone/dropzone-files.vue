<script lang='ts'>
import type { Classes, NuanceColor, NuanceSize } from '@nui/types'
import type { UseFileDialogReturn } from '@vueuse/core'

import type { ButtonLinkProps, ButtonProps } from '../../button/button.vue'
import type { DropzoneValue } from './dropzone.vue'


export type DzOpenHandler = UseFileDialogReturn['open']
export type DzRemoveHandler = (ix?: number) => void

export interface DropzoneFilesProps {
	/**
   * The layout of how files are displayed.
   * @default 'list'
   */
	layout?: 'list' | 'grid'

	color?: NuanceColor

	/** The icon to display for the file. */
	fileIcon?: string
	/**
   * Preview the file (currently only `<img>` is rendered)
   * When set false, only `fileIcon` is displayed
   * @default true
   */
	fileImage?: boolean
	/** Configure the delete button for the file. */
	fileDelete?: boolean | Omit<ButtonProps, keyof ButtonLinkProps>
	/** The icon displayed to delete a file. */
	fileDeleteIcon?: string

	format?: (bytes: number) => string

	/** @default 'md' */
	size?: NuanceSize

	classes?: DropzoneFilesClasses
}

export type DropzoneFilesClasses = Classes<
	| 'files'
	| 'file'
	| 'fileWrapper'
	| 'fileName'
	| 'fileSize'
	| 'fileTrailingButton'
	| 'fileLeadingAvatar'
>

export interface DropzoneFilesEmits {
	remove: [ix?: number]
}

export interface DropzoneFilesSlots<M extends boolean = false> {
	'files': (props: {
		files: DropzoneValue<M> | null
		remove: DzRemoveHandler
	}) => any
	'files-top': (props: {
		files: DropzoneValue<M> | null
		remove: DzRemoveHandler
	}) => any
	'files-bottom': (props: {
		files: DropzoneValue<M> | null
		remove: DzRemoveHandler
	}) => any
	'file': (props: { file: File, ix: number, remove: DzRemoveHandler }) => any
	'file-leading': (props: { file: File, ix: number, ui?: string }) => any
	'file-name': (props: { file: File, ix: number }) => any
	'file-size': (props: { file: File, ix: number }) => any
	'file-trailing': (props: {
		file: File
		ix: number
		ui?: string
		remove: DzRemoveHandler
	}) => any
}
</script>

<script setup lang='ts' generic='M extends boolean = false'>
import { useConfig } from '@nui/composables'

import Avatar from '../../avatar/avatar.vue'
import Button from '../../button/button.vue'
import css from './dropzone.module.css'


const props = defineProps<DropzoneFilesProps>()

const emit = defineEmits<DropzoneFilesEmits>()
defineSlots<DropzoneFilesSlots<M>>()

const config = useConfig()
const value = defineModel<DropzoneValue<M> | null>({
	default: p => (p.multiple ? [] : null) as unknown as DropzoneValue<M>,
})

const remove = (ix?: number) => emit('remove', ix)

function createObjectUrl(file: File): string | undefined {
	return !props.fileImage ? undefined : URL.createObjectURL(file)
}

function formatter(bytes: number): string {
	if (bytes === 0)
		return '0B'

	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	const value = bytes / k ** i
	const formattedSize = i === 0 ? value.toString() : value.toFixed(0)

	return `${formattedSize}${sizes[i]}`
}
</script>

<template>
	<slot name='files-top' :files='value' :remove='remove' />

	<div :class='css.files'>
		<slot name='files' :files='value' :remove='remove'>
			<div
				v-for='(file, ix) in [value ?? []].flat() as File[]'
				:key='(file as File).name'
				:class='css.file'
			>
				<slot name='file' :file='file' :ix='ix' :remove='remove'>
					<slot
						name='file-leading'
						:file='file'
						:ix='ix'
						:ui='css.fileLeadingAvatar'
					>
						<Avatar
							:src='createObjectUrl(file)'
							:icon='props?.fileIcon || config.icons.file'
							:size='props?.size'
							:class='css.fileLeadingAvatar'
						/>
					</slot>

					<div :class='[css.fileWrapper, classes?.fileWrapper]'>
						<span :class='[css.fileName, classes?.fileName]'>
							<slot name='file-name' :file='file' :ix='ix'>
								{{ (file as File).name }}
							</slot>
						</span>

						<span :class='[css.fileSize, classes?.fileSize]'>
							<slot name='file-size' :file='file' :ix='ix'>
								{{ (props?.format ?? formatter)((file as File).size) }}
							</slot>
						</span>
					</div>

					<slot
						name='file-trailing'
						:file='file'
						:ix='ix'
						:ui='css.fileTrailingButton'
						:remove='remove'
					>
						<Button
							v-if='fileDelete'
							:color='props?.color'
							:variant='props?.layout === "grid" ? "outline" : "filled"'
							:size='props?.layout === "grid" ? size : "xs"'
							v-bind='typeof props?.fileDelete === "object"
								? props?.fileDelete : undefined'
							:icon='props?.fileDeleteIcon || config.icons.close'
							:class='[css.fileTrailingButton, classes?.fileTrailingButton]'
							@click.stop.prevent='remove(ix)'
						/>
					</slot>
				</slot>
			</div>
		</slot>
	</div>

	<slot name='files-bottom' :files='value' :remove='remove' />
</template>

<style module>
.root {
	display: grid;
}
</style>
