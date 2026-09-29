import type { MaybeRef, Ref } from 'vue'

import { unrefElement, useDropZone, useFileDialog } from '@vueuse/core'
import { computed, onMounted, toValue } from 'vue'


export interface UseFileUploadOptions {
	/**
	 * Specifies the allowed file types. Provide a comma-separated list of MIME types or file extensions.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
	 * @default '*'
	 */
	accept?: MaybeRef<string>
	reset?: MaybeRef<boolean>
	multiple?: MaybeRef<boolean>
	onUpdate: (files: File[]) => void
}

function parseAcceptToDataTypes(accept: string): string[] {
	if (!accept || accept === '*')
		return []

	return accept
		.split(',')
		.map(type => {
			const trimmedType = type.trim()

			if (trimmedType.includes('/') && trimmedType.endsWith('/*'))
				return trimmedType.split('/')[0] || trimmedType
			return trimmedType
		})
		.filter(type => !type.startsWith('.'))
}


export function useFileUpload(
	inputRef: Readonly<Ref<HTMLInputElement | null>>,
	dropzoneRef: Readonly<Ref<HTMLDivElement | null>>,
	{
		accept = '*',
		reset = false,
		multiple = false,
		onUpdate,
	}: UseFileUploadOptions,
) {
	const dataTypes = computed<readonly string[]>(() => parseAcceptToDataTypes(toValue(accept)))

	const onDrop = (files: FileList | File[] | null, fromDropZone = false) => {
		if (!files || files.length === 0)
			return

		if (files instanceof FileList)
			files = Array.from(files)
		if (files.length > 1 && !toValue(multiple))
			files = [files[0]!]

		// Sync dropped files to the input element for proper native validation
		if (fromDropZone && unrefElement(inputRef)) {
			try {
				const dt = new DataTransfer()
				files.forEach(file => dt.items.add(file))
				unrefElement(inputRef)!.files = dt.files
			}
			catch (e) {
				console.warn('Could not sync files to input element:', e)
			}
		}

		onUpdate(files)
	}

	const { isOverDropZone } = useDropZone(dropzoneRef, {
		dataTypes,
		onDrop: files => onDrop(files, true),
	})

	const { onChange, open } = useFileDialog({
		accept,
		multiple,
		input: inputRef as Readonly<Ref<HTMLInputElement>>,
		reset,
	})

	onMounted(() => {
		onChange(fileList => onDrop(fileList, false))
	})

	return { isOverDropZone, open }
}
