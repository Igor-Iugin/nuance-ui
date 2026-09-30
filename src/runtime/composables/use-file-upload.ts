import type { MaybeRef, MaybeRefOrGetter, Ref } from 'vue'

import { unrefElement, useDropZone, useFileDialog } from '@vueuse/core'
import { computed, onMounted, shallowRef, toValue } from 'vue'

import type { AnyString } from '../types'


/** Drag state of the drop zone */
export type FileUploadStatus = 'idle' | 'accept' | 'reject'

/** Built-in error codes, custom `validator` codes are allowed */
export type FileError = 'type' | 'size' | 'count' | AnyString

export interface FileRejection {
	file: File
	errors: FileError[]
}

export interface UseFileUploadOptions {
	/**
	 * Specifies the allowed file types. Provide a comma-separated list of MIME types or file extensions.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
	 * @default '*'
	 */
	accept?: MaybeRef<string>
	reset?: MaybeRef<boolean>
	multiple?: MaybeRef<boolean>
	/** Maximum file size in bytes */
	maxSize?: MaybeRefOrGetter<number | undefined>
	/** Maximum number of files per selection, exceeding it rejects the whole selection */
	maxFiles?: MaybeRefOrGetter<number | undefined>
	/** Custom check, returns an error code for an invalid file */
	validator?: (file: File) => FileError | null | undefined
	/** Called on every selection with accepted and rejected files */
	onUpdate: (files: File[], rejections: FileRejection[]) => void
}

export interface UseFileUploadReturn {
	/** Files are dragged over the drop zone */
	isOverDropZone: Readonly<Ref<boolean>>
	status: Readonly<Ref<FileUploadStatus>>
	/** Opens the file dialog */
	open: ReturnType<typeof useFileDialog>['open']
}

function matchesAccept(accept: string, type: string, name?: string): boolean {
	if (!accept || accept === '*')
		return true

	type = type.toLowerCase()

	return accept.split(',').some(rule => {
		rule = rule.trim().toLowerCase()

		// Extensions are unknown while dragging
		if (rule.startsWith('.'))
			return name === undefined || name.toLowerCase().endsWith(rule)
		if (rule.endsWith('/*'))
			return type.startsWith(rule.slice(0, -1))
		return type === rule
	})
}

/**
 * File selection via dialog and drag & drop with shared validation.
 * Rejected files are reported instead of being silently dropped, `status` reflects the dragged files validity.
 */
export function useFileUpload(
	inputRef: Readonly<Ref<HTMLInputElement | null>>,
	dropzoneRef: Readonly<Ref<HTMLDivElement | null>>,
	{
		accept = '*',
		reset = false,
		multiple = false,
		maxSize,
		maxFiles,
		validator,
		onUpdate,
	}: UseFileUploadOptions,
): UseFileUploadReturn {
	const maxCount = () => toValue(multiple) ? toValue(maxFiles) : 1

	function validate(files: File[]) {
		const max = maxCount()
		const tooMany = max !== undefined && files.length > max
		const size = toValue(maxSize)

		const accepted: File[] = []
		const rejections: FileRejection[] = []

		for (const file of files) {
			const errors = [
				!matchesAccept(toValue(accept), file.type, file.name) && 'type',
				size !== undefined && file.size > size && 'size',
				tooMany && 'count',
				validator?.(file),
			].filter(Boolean) as FileError[]

			if (errors.length)
				rejections.push({ file, errors })
			else
				accepted.push(file)
		}

		return { accepted, rejections }
	}

	const onDrop = (files: FileList | File[] | null, fromDropZone = false) => {
		if (!files || files.length === 0)
			return

		const { accepted, rejections } = validate(Array.from(files))

		// Sync dropped files to the input element for proper native validation
		if (fromDropZone && accepted.length && unrefElement(inputRef)) {
			try {
				const dt = new DataTransfer()
				accepted.forEach(file => dt.items.add(file))
				unrefElement(inputRef)!.files = dt.files
			}
			catch (e) {
				console.warn('Could not sync files to input element:', e)
			}
		}

		onUpdate(accepted, rejections)
	}

	// ─── Drag status ───

	const isDragReject = shallowRef(false)

	function checkDrag(_: unknown, event: DragEvent) {
		const items = Array.from(event.dataTransfer?.items ?? [])
			.filter(item => item.kind === 'file')
		const max = maxCount()

		// Safari may report empty types while dragging
		isDragReject.value = !items.length
			|| (max !== undefined && items.length > max)
			|| items.some(item => item.type && !matchesAccept(toValue(accept), item.type))
	}

	const { isOverDropZone } = useDropZone(dropzoneRef, {
		// Accept every drag so rejected files are reported instead of ignored
		checkValidity: () => true,
		onEnter: checkDrag,
		onOver: checkDrag,
		onDrop: files => onDrop(files, true),
	})

	const status = computed<FileUploadStatus>(() => !isOverDropZone.value
		? 'idle'
		: isDragReject.value ? 'reject' : 'accept')

	// ─── Dialog ───

	const { onChange, open } = useFileDialog({
		accept,
		multiple,
		input: inputRef as Readonly<Ref<HTMLInputElement>>,
		reset,
	})

	onMounted(() => {
		onChange(fileList => onDrop(fileList, false))
	})

	return { isOverDropZone, status, open }
}
