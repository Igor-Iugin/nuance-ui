import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import NumberInput from '../src/runtime/components/input/number-input.vue'


vi.mock('@nui/composables', () => ({
	useConfig: () => ({ icons: { chevronUp: 'up', chevronDown: 'down' } }),
}))

function input(props = {}) {
	const wrapper = mount(NumberInput, {
		props: {
			'modelValue': 0.1,
			'step': 0.01,
			...props,
			'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }),
		},
		global: {
			stubs: {
				InputWrapper: { template: '<div><slot /></div>' },
				BaseInput: { inheritAttrs: false, template: '<div><slot id="number" :css="{}" /><slot name="rightSection" /></div>' },
				UnstyledButton: { template: '<button type="button"><slot /></button>' },
				Icon: true,
				NuxtIcon: true,
			},
		},
	})
	return wrapper
}

describe('numberInput stepping', () => {
	it.each([
		[0.1, 0.01, 0.11],
		[0.2, 0.1, 0.3],
		[0.125, 0.01, 0.135],
		[-0.02, 0.01, -0.01],
		[1e-7, 1e-8, 1.1e-7],
		[1, 1, 2],
	])('increments %s by %s without decimal artifacts', async (value, step, expected) => {
		const wrapper = input({ modelValue: value, step })
		await wrapper.findAll('button')[0]!.trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([expected])
	})

	it('keeps extreme values finite when decimal scaling would overflow', async () => {
		const wrapper = input({ modelValue: 1e-309, step: 1e-309 })
		await wrapper.findAll('button')[0]!.trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1e-309 + 1e-309])
		await wrapper.setProps({ modelValue: 1e20, step: 1e20, max: Infinity })
		await wrapper.findAll('button')[0]!.trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2e20])
	})

	it('decrements without decimal artifacts', async () => {
		const wrapper = input({ modelValue: 0.3, step: 0.1 })
		await wrapper.findAll('button')[1]!.trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0.2])
	})

	it('uses the same arithmetic for the wheel and keyboard arrows', async () => {
		const wrapper = input({ modelValue: 0.2, step: 0.1 })
		const field = wrapper.find('input')
		await field.trigger('focus')
		await field.trigger('wheel', { deltaY: 1, deltaX: 0 })
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0.3])
		await field.trigger('keydown', { key: 'ArrowUp' })
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0.4])
		await field.trigger('keydown', { key: 'ArrowDown' })
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0.3])
	})

	it('clamps to the configured bounds', async () => {
		const wrapper = input({ modelValue: 0.125, step: 0.01, max: 0.13 })
		await wrapper.findAll('button')[0]!.trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0.13])
		await wrapper.setProps({ modelValue: -0.125, min: -0.13 })
		await wrapper.findAll('button')[1]!.trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([-0.13])
	})

	it.each([{ disabled: true }, { readonly: true }])('does not step when %o', async props => {
		const wrapper = input(props)
		const field = wrapper.find('input')
		await field.trigger('focus')
		await field.trigger('wheel', { deltaY: 1, deltaX: 0 })
		await field.trigger('keydown', { key: 'ArrowUp' })
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})
})
