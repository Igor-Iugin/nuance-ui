<script lang='ts'>
import type { Classes, NuanceColor, NuanceSize } from '@nui/types'
import type { UseFileDialogReturn } from '@vueuse/core'

import type { ButtonLinkProps, ButtonProps } from '../button/button.vue'
import type { DropzoneValue } from './dropzone.vue'


export type DzOpenHandler = UseFileDialogReturn['open']
export type DzRemoveHandler = (ix?: number) => void

export interface DropzoneFilesProps<M extends boolean = false> {
	multiple?: M & boolean

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

import Avatar from '../avatar/avatar.vue'
import Box from '../box/box.vue'
import Button from '../button/button.vue'


const props = defineProps<DropzoneFilesProps<M>>()

const emit = defineEmits<DropzoneFilesEmits>()
defineSlots<DropzoneFilesSlots<M>>()

const config = useConfig()
const value = defineModel<DropzoneValue<M> | null>({
	default: p => (p.multiple ? [] : null) as unknown as DropzoneValue<M>,
})

const remove = (ix?: number) => emit('remove', ix)

function createObjectUrl(file: File): string | undefined {
	return props.fileImage && file.type.startsWith('image/')
		? URL.createObjectURL(file)
		: undefined
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

	<Box
		is='ul'
		:class='$style.root'
		:mod='{
			layout: props.layout,
			multiple: props.multiple,
		}'
	>
		<slot name='files' :files='value' :remove='remove'>
			<li
				v-for='(file, ix) in [value ?? []].flat() as File[]'
				:key='(file as File).name'
				:class='$style.file'
			>
				<slot name='file' :file='file' :ix='ix' :remove='remove'>
					<slot
						name='file-leading'
						:file='file'
						:ix='ix'
						:ui='$style.fileLeadingAvatar'
					>
						<Avatar
							:src='createObjectUrl(file)'
							:icon='props?.fileIcon || config.icons.file'
							:size='props?.size'
							:class='$style.fileLeadingAvatar'
						/>
					</slot>

					<div :class='[$style.fileWrapper, classes?.fileWrapper]'>
						<span :class='[$style.fileName, classes?.fileName]'>
							<slot name='file-name' :file='file' :ix='ix'>
								{{ (file as File).name }}
							</slot>
						</span>

						<span :class='[$style.fileSize, classes?.fileSize]'>
							<slot name='file-size' :file='file' :ix='ix'>
								{{ (props?.format ?? formatter)((file as File).size) }}
							</slot>
						</span>
					</div>

					<slot
						name='file-trailing'
						:file='file'
						:ix='ix'
						:ui='$style.fileTrailingButton'
						:remove='remove'
					>
						<Button
							v-if='fileDelete'
							:color='props?.layout === "grid" ? "black" : "gray"'
							:variant='props?.layout === "grid" ? "filled" : "subtle"'
							:size='props?.layout === "grid" ? "xs" : "sm"'
							v-bind='typeof props?.fileDelete === "object"
								? props?.fileDelete : undefined'
							:icon='props?.fileDeleteIcon || config.icons.close'
							:class='[$style.fileTrailingButton, classes?.fileTrailingButton]'
							@click.stop.prevent='remove(ix)'
						/>
					</slot>
				</slot>
			</li>
		</slot>
	</Box>

	<slot name='files-bottom' :files='value' :remove='remove' />
</template>

<style module>
.root {
	&:where([data-layout='list']) {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);

		width: 100%;
	}

	&:where([data-layout='grid'][data-multiple]) {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-md);

		width: 100%;

		@media (min-width: 62em) {
			grid-template-columns: repeat(4, 1fr);
		}
	}
}

.file {
	position: relative;

	display: flex;
	gap: var(--dropzone-file-gap);
	align-items: center;

	padding: var(--dropzone-file-gap) var(--dropzone-file-px);

	font-size: var(--dropzone-file-fz);

	:where([data-layout='list']) & {
		width: 100%;
		min-width: 0;

		border: rem(1px) solid var(--color-default-border);
		border-radius: var(--radius-default);
	}

	:where([data-layout='grid'][data-multiple]) & {
		aspect-ratio: 1;
	}
}

.fileLeadingAvatar {
	flex-shrink: 0;

	:where([data-layout='grid']) & {
		width: 100%;
		height: 100%;
		border-radius: var(--dropzone-bdrs);
	}
}

.fileWrapper {
	display: flex;
	flex-direction: column;

	min-width: 0;

	:where([data-size='xs'], [data-size='sm']) & {
		flex-direction: row;
		gap: var(--spacing-2xs);
	}

	:where([data-layout='grid']) & {
		display: none;
	}
}

.fileName {
	overflow: hidden;

	color: var(--color-text);
	text-overflow: ellipsis;
	white-space: nowrap;
}

.fileSize {
	overflow: hidden;

	color: var(--color-dimmed);
	text-overflow: ellipsis;
	white-space: nowrap;
}

.fileTrailingButton {
	:where([data-layout='list']) & {
		margin-inline: auto calc(var(--dropzone-file-gap) * -1);
	}

	:where([data-layout='grid']) & {
		position: absolute;
		inset-block-start: rem(-6px);
		inset-inline-end: rem(-6px);

		padding: 0;

		border: 2px solid var(--color-body);
		border-radius: 1000px;
	}
}
</style>
