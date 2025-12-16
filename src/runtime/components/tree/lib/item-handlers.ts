import type { Ref } from 'vue'

import { useRovingFocus } from '@nui/components'

import { useTreeState } from './context'


export function useTreeItemHandlers(path: string, isFolder: Ref<boolean>, expanded: Ref<boolean>) {
	const ctx = useTreeState()

	const { focus } = useRovingFocus()

	function handleClick(event: MouseEvent) {
		if (event.shiftKey)
			ctx.toggle('select', path, 'range') // Shift + Click - выбор диапазона
		else if (event.ctrlKey || event.metaKey)
			ctx.toggle('select', path, 'multiple') // Ctrl/Cmd + Click - множественный выбор
		else
			ctx.toggle('select', path, 'single') // Обычный клик - одиночный выбор

		// Раскрываем/закрываем папку только при обычном клике
		if (isFolder.value && !event.ctrlKey && !event.metaKey && !event.shiftKey)
			ctx.toggle('expand', path)
	}

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			// Arrow Left - закрыть папку или перейти к родителю
			case 'ArrowLeft': {
				event.preventDefault()
				if (isFolder.value && expanded.value)
					return ctx.off('expand', path)
				else
					return focus('prev', event.currentTarget as HTMLElement)
			}
			// Arrow Right - открыть папку или перейти к первому ребенку
			case 'ArrowRight': {
				event.preventDefault()
				if (isFolder.value && !expanded.value)
					return ctx.on('expand', path)
				else if (expanded.value)
					return focus('next', event.currentTarget as HTMLElement)
				break
			}
			// Enter/Space - выбор элемента
			case 'Enter': {
				ctx.on('select', path)
				return ctx.setActive(path)
			}
			case ' ': {
				event.preventDefault()
				if (event.shiftKey)
					return ctx.toggle('select', path, 'range')
				else if (event.ctrlKey || event.metaKey)
					return ctx.toggle('select', path, 'multiple')

				return ctx.toggle('select', path, 'single')
			}
		}
	}

	return {
		handleClick,
		handleKeyDown,
	}
}
