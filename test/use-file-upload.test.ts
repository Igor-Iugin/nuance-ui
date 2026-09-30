import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, useTemplateRef } from 'vue'

import type { FileRejection, UseFileUploadOptions } from '../src/runtime/composables/use-file-upload'

import { useFileUpload } from '../src/runtime/composables/use-file-upload'


async function select(files: File[], options: Omit<UseFileUploadOptions, 'onUpdate'>) {
	const result: { files: File[], rejections: FileRejection[] } = { files: [], rejections: [] }

	const wrapper = mount(defineComponent(() => {
		const input = useTemplateRef<HTMLInputElement>('input')
		const zone = useTemplateRef<HTMLDivElement>('zone')
		useFileUpload(input, zone, {
			...options,
			onUpdate: (accepted, rejections) => Object.assign(result, {
				files: accepted,
				rejections,
			}),
		})
		return () => h('div', { ref: 'zone' }, [
			h('input', { ref: 'input', type: 'file' }),
		])
	}))

	await nextTick()
	const input = wrapper.find('input').element
	Object.defineProperty(input, 'files', { value: files })
	input.dispatchEvent(new Event('change'))

	return result
}

const png = new File(['x'], 'a.png', { type: 'image/png' })
const pdf = new File(['xx'], 'b.pdf', { type: 'application/pdf' })
const big = new File(['x'.repeat(100)], 'c.png', { type: 'image/png' })

describe('useFileUpload', () => {
	it('matches MIME wildcards and extensions', async () => {
		expect((await select([png, pdf], {
			multiple: true,
			accept: 'image/*',
		})).rejections)
			.toEqual([{ file: pdf, errors: ['type'] }])

		expect((await select([png, pdf], {
			multiple: true,
			accept: '.pdf',
		})).files).toEqual([pdf])
	})

	it('rejects by size and custom validator', async () => {
		const { files, rejections } = await select([png, big], {
			multiple: true,
			maxSize: 10,
			validator: file => file.name === 'a.png' ? 'custom' : null,
		})
		expect(files).toEqual([])
		expect(rejections.map(r => r.errors)).toEqual([['custom'], ['size']])
	})

	it('rejects the whole selection above the limit', async () => {
		expect((await select([png, pdf], {
			multiple: true,
			maxFiles: 1,
		})).rejections).toHaveLength(2)
		expect((await select([png, pdf], {})).rejections[0]!.errors).toEqual(['count'])
	})
})
