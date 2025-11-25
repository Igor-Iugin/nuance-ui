import { nextTick } from 'vue'

import type { ComboboxAttrs } from '../const'

import { getFirstIndex, getNextIndex, getPreviousIndex } from './get-index'


type ComboboxHandlerOptions<T extends Record<string, unknown> = Record<string, unknown>> = {
	listId: string
	attrs: ComboboxAttrs
} & T

export type SelectHandlerReturn = {
	ix: number
	value: string | null
} | void

type ExtFn = (ix: number) => unknown
type DefaultFn = (ix: number) => unknown


export function clearSelected({ listId, attrs }: ComboboxHandlerOptions) {
	const selected = document.querySelector(`#${listId} [${attrs.selected}]`)
	selected?.removeAttribute(attrs.selected)
	selected?.removeAttribute('aria-selected')
}

export function selectOption(
	ix: number,
	{
		listId,
		attrs,
		scrollBehavior,
		clearFn,
	}: ComboboxHandlerOptions<{
		scrollBehavior: ScrollBehavior
		clearFn: (listId: string) => void
	}>,
): SelectHandlerReturn {
	const items = document.querySelectorAll(`#${listId} [${attrs.option}]`)

	if (!items)
		return

	const nextIndex = ix >= items!.length ? 0 : ix < 0 ? items!.length - 1 : ix

	if (items?.[nextIndex] && !items[nextIndex].hasAttribute(attrs.disabled)) {
		clearFn(listId)

		const item = items[nextIndex]
		item.setAttribute(attrs.selected, 'true')
		item.setAttribute('aria-selected', 'true')
		item.scrollIntoView({ block: 'nearest', behavior: scrollBehavior })

		return { ix: nextIndex, value: item.id }
	}

	return { ix: nextIndex, value: null }
}


export function selectActiveOption<T extends ExtFn = DefaultFn>({
	listId,
	attrs,
	selectFn,
}: ComboboxHandlerOptions<{ selectFn: T }>) {
	const activeOption = document.querySelector<HTMLDivElement>(`#${listId} [${attrs.active}]`)

	if (activeOption) {
		const items = document.querySelectorAll<HTMLDivElement>(`#${listId} [${attrs.option}]`)
		const index = Array.from(items).findIndex(option => option === activeOption)
		return selectFn(index) as ReturnType<T>
	}

	return selectFn(0) as ReturnType<T>
}

export function selectNextOption<T extends ExtFn = DefaultFn>(ix: number, {
	listId,
	loop,
	attrs,
	selectFn,
}: ComboboxHandlerOptions<{
	loop: boolean
	selectFn: T
}>) {
	return selectFn(getNextIndex(
		ix,
		document.querySelectorAll<HTMLDivElement>(`#${listId} [${attrs.option}]`),
		loop,
		attrs.disabled,
	)) as ReturnType<T>
}

export function selectPrevOption<T extends ExtFn = DefaultFn>(ix: number, {
	listId,
	loop,
	attrs,
	selectFn,
}: ComboboxHandlerOptions<{
	loop: boolean
	selectFn: T
}>) {
	return selectFn(getPreviousIndex(
		ix,
		document.querySelectorAll<HTMLDivElement>(`#${listId} [${attrs.option}]`),
		loop,
		attrs.disabled,
	)) as ReturnType<T>
}

export function selectFirstOption<T extends ExtFn = DefaultFn>({ listId, attrs, selectFn }: ComboboxHandlerOptions<{
	loop: boolean
	selectFn: T
}>) {
	return selectFn(
		getFirstIndex(document.querySelectorAll<HTMLDivElement>(`#${listId} [${attrs.option}]`), attrs.disabled),
	) as ReturnType<T>
}


export function updateSelectedOptionIx(
	target: 'active' | 'selected' = 'selected',
	{ listId, attrs, scrollIntoView, scrollBehavior }: ComboboxHandlerOptions<{
		scrollIntoView?: boolean
		scrollBehavior: ScrollBehavior
	}>,
) {
	let ix = -1

	nextTick(() => {
		const items = document.querySelectorAll(`#${listId} [${attrs.option}]`)
		const index = Array.from(items).findIndex(option => option.hasAttribute(attrs[target]))

		ix = index

		if (scrollIntoView)
			items[index]?.scrollIntoView({ block: 'nearest', behavior: scrollBehavior })
	})

	return ix
}
