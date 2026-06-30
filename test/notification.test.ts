import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Notification from '../src/runtime/components/notification.vue'


// Stub auto-imported global components used inside notification.vue.
const global = {
	stubs: {
		Box: { template: '<div data-testid="box"><slot /></div>' },
		Icon: { template: '<i />' },
		Loader: { template: '<span />' },
		ActionIcon: { template: '<button class="close" @click="$emit(\'click\')" />' },
		Button: { props: ['label'], template: '<button class="action">{{ label }}</button>' },
	},
}

describe('notification', () => {
	it('renders a string message', () => {
		const wrapper = mount(Notification, { global, props: { message: 'hello' } })
		expect(wrapper.text()).toContain('hello')
	})

	it('renders a VNode-returning function as title', () => {
		const wrapper = mount(Notification, {
			global,
			props: { title: () => h('b', 'bold-title') },
		})
		expect(wrapper.html()).toContain('bold-title')
	})

	it('renders action buttons via Button', () => {
		const wrapper = mount(Notification, {
			global,
			props: { actions: [{ label: 'Undo' }, { label: 'Retry' }] },
		})
		const actions = wrapper.findAll('.action')
		expect(actions).toHaveLength(2)
		expect(actions[0]!.text()).toBe('Undo')
	})

	it('calls action onClick', async () => {
		let clicked = false
		const wrapper = mount(Notification, {
			global,
			props: { actions: [{ label: 'Undo', onClick: () => { clicked = true } }] },
		})
		await wrapper.find('.action').trigger('click')
		expect(clicked).toBe(true)
	})

	it('emits close when the close button is clicked', async () => {
		const wrapper = mount(Notification, { global, props: { message: 'x' } })
		await wrapper.find('.close').trigger('click')
		expect(wrapper.emitted('close')).toBeTruthy()
	})
})
