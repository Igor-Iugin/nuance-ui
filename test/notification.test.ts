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
		Button: { template: '<button class="action"><slot /></button>' },
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

	it('calls action onClick exactly once', async () => {
		let count = 0
		const wrapper = mount(Notification, {
			global,
			props: { actions: [{ label: 'Undo', onClick: () => { count += 1 } }] },
		})
		await wrapper.find('.action').trigger('click')
		expect(count).toBe(1)
	})

	it('renders a VNode object as message', () => {
		const wrapper = mount(Notification, {
			global,
			props: { message: h('span', 'vnode-body') },
		})
		expect(wrapper.html()).toContain('vnode-body')
	})

	it('renders horizontal actions next to the close button', () => {
		const wrapper = mount(Notification, {
			global,
			props: { orientation: 'horizontal', actions: [{ label: 'Retry' }] },
		})
		expect(wrapper.findAll('.action')).toHaveLength(1)
		expect(wrapper.find('.close').exists()).toBe(true)
	})

	it('renders the close button outside the actions container in vertical mode', () => {
		const wrapper = mount(Notification, { global, props: { message: 'x' } })
		// The close button is a direct child of the root box, not nested in an actions wrapper.
		expect(wrapper.find('[data-testid="box"] > .close').exists()).toBe(true)
	})

	it('overrides actions via the #actions slot', () => {
		const wrapper = mount(Notification, {
			global,
			props: { actions: [{ label: 'Undo' }] },
			slots: { actions: '<button class="custom-action">Custom</button>' },
		})
		expect(wrapper.find('.custom-action').exists()).toBe(true)
		expect(wrapper.find('.action').exists()).toBe(false)
	})

	it('emits close when the close button is clicked', async () => {
		const wrapper = mount(Notification, { global, props: { message: 'x' } })
		await wrapper.find('.close').trigger('click')
		expect(wrapper.emitted('close')).toBeTruthy()
	})
})
