import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import RadioCard from '../src/runtime/components/radio/radio-card.vue'
import RadioGroup from '../src/runtime/components/radio/radio-group.vue'
import RadioIndicator from '../src/runtime/components/radio/radio-indicator.vue'
import Radio from '../src/runtime/components/radio/radio.vue'


describe('radio', () => {
	it('selects a standalone value and forwards native attributes to the input', async () => {
		const wrapper = mount(Radio, {
			props: { value: 'vue', label: 'Vue', name: 'framework', modelValue: null },
			attrs: { 'form': 'settings', 'aria-label': 'Framework', 'class': 'custom-root' },
		})
		const input = wrapper.get('input')
		expect(input.attributes()).toMatchObject({
			'type': 'radio',
			'name': 'framework',
			'form': 'settings',
			'aria-label': 'Framework',
		})
		expect(wrapper.classes()).toContain('custom-root')
		expect(input.classes()).not.toContain('custom-root')
		expect(wrapper.get('label')
			.attributes('for'))
			.toBe(input.attributes('id'))
		await input.setValue()
		expect(wrapper.emitted('update:modelValue')).toEqual([['vue']])
	})

	it('shares one selection between ordinary radios and cards through arbitrary wrappers', async () => {
		const selection = ref<string | null>('vue')
		const wrapper = mount(defineComponent({
			setup: () => () => h('form', {}, [
				h(RadioGroup, {
					'modelValue': selection.value,
					'onUpdate:modelValue': value => selection.value = value ?? null,
					'name': 'framework',
					'label': 'Framework',
				}, () => [
					h('div', {}, h(Radio, { value: 'vue', label: 'Vue' })),
					h(RadioCard, { value: 'react' }, () => [
						h(RadioIndicator),
						h('span', 'React'),
					]),
				]),
			]),
		}))
		const inputs = wrapper.findAll<HTMLInputElement>('input')
		expect(inputs.map(input => input.element.checked)).toEqual([true, false])
		await inputs[1]!.setValue()
		expect(selection.value).toBe('react')
		expect(inputs.map(input => input.element.checked)).toEqual([false, true])
		expect(wrapper.get('fieldset').get('legend').text()).toBe('Framework')
		expect(wrapper.findComponent(RadioIndicator)
			.attributes('data-checked'))
			.toBeUndefined()

		expect(wrapper.findComponent(RadioCard)
			.findComponent(RadioIndicator)
			.attributes('data-checked'))
			.toBe('true')
		expect(new FormData(wrapper.element as HTMLFormElement)
			.getAll('framework'))
			.toEqual(['react'])
	})

	it('updates inherited state and size after group props change', async () => {
		const wrapper = mount(RadioGroup, {
			props: { modelValue: 'one', size: 'xs', disabled: false },
			slots: { default: () => h(RadioCard, { value: 'one' }, () => h(RadioIndicator)) },
		})
		const input = wrapper.get<HTMLInputElement>('input')
		expect(input.element.disabled).toBe(false)
		await wrapper.setProps({ disabled: true, size: 'xl' })
		expect(input.element.disabled).toBe(true)
		expect(wrapper.findComponent(RadioIndicator)
			.attributes('style'))
			.toContain('var(--radio-size-xl)')
		expect(wrapper.findComponent(RadioIndicator)
			.attributes('data-disabled'))
			.toBe('true')
	})

	it('keeps read-only groups focusable while preventing pointer and keyboard changes', async () => {
		const wrapper = mount(RadioGroup, {
			props: { modelValue: 'one', readOnly: true },
			slots: {
				default: () => [
					h(Radio, { value: 'one', label: 'One' }),
					h(Radio, { value: 'two', label: 'Two' }),
				],
			},
		})
		const input = wrapper.findAll<HTMLInputElement>('input')[1]!
		expect(input.element.disabled).toBe(false)
		expect(input.attributes('aria-readonly')).toBe('true')
		const click = new MouseEvent('click', { bubbles: true, cancelable: true })
		input.element.dispatchEvent(click)
		expect(click.defaultPrevented).toBe(true)
		const arrow = new KeyboardEvent('keydown', {
			key: 'ArrowRight',
			bubbles: true,
			cancelable: true,
		})
		input.element.dispatchEvent(arrow)
		expect(arrow.defaultPrevented).toBe(true)
		await input.setValue()
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	it('connects individual and group errors to the native input', () => {
		const wrapper = mount(RadioGroup, {
			props: { error: 'Choose a framework', required: true },
			slots: { default: () => h(Radio, {
				label: 'Vue',
				value: 'vue',
				description: 'Progressive framework',
			}) },
		})
		const input = wrapper.get<HTMLInputElement>('input')
		expect(input.element.required).toBe(true)
		expect(input.attributes('aria-invalid')).toBe('true')
		const ids = input.attributes('aria-describedby')!.split(' ')
		expect(ids.map(id => wrapper.get(`[id="${id}"]`)
			.text()))
			.toEqual(['Progressive framework', 'Choose a framework'])
	})

	it('gives unnamed groups distinct native names', () => {
		const wrapper = mount(defineComponent({
			setup: () => () => h('div', [
				h(RadioGroup, {}, () => h(Radio, { label: 'First' })),
				h(RadioGroup, {}, () => h(Radio, { label: 'Second' })),
			]),
		}))
		const inputs = wrapper.findAll('input')
		expect(inputs[0]!.attributes('name')).toBeTruthy()
		expect(inputs[0]!.attributes('name')).not.toBe(inputs[1]!.attributes('name'))
	})

	it('renders standalone indicators as decorative content', () => {
		const wrapper = mount(RadioIndicator, { props: { checked: true, disabled: true } })
		expect(wrapper.attributes('aria-hidden')).toBe('true')
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.attributes('tabindex')).toBeUndefined()
	})
})
