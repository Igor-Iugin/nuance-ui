import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import NotificationContainer from '../src/runtime/notifications/notification-container.vue'


const global = {
	stubs: {
		Notification: {
			props: ['message'],
			template: '<div class="n"><slot /></div>',
			emits: ['close'],
		},
		Progress: { props: ['modelValue'], template: '<div class="progress" />' },
	},
}

function makeData(overrides = {}) {
	return { id: 'a', message: 'hi', ...overrides }
}

describe('notificationContainer', () => {
	beforeEach(() => vi.useFakeTimers())
	afterEach(() => vi.useRealTimers())

	it('emits hide after the auto-close timeout', async () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData(), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		vi.advanceTimersByTime(1100)
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('hide')).toBeTruthy()
		expect(wrapper.emitted('hide')![0]).toEqual(['a'])
	})

	it('does not auto-close when autoClose resolves to false', async () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData({ autoClose: false }), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		vi.advanceTimersByTime(5000)
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('hide')).toBeFalsy()
	})

	it('pauses the timer while paused is true', async () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData(), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		await wrapper.setProps({ paused: true })
		vi.advanceTimersByTime(2000)
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('hide')).toBeFalsy()
		await wrapper.setProps({ paused: false })
		vi.advanceTimersByTime(1100)
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('hide')).toBeTruthy()
	})

	it('calls onOpen on mount', () => {
		const onOpen = vi.fn()
		mount(NotificationContainer, {
			global,
			props: { data: makeData({ onOpen }), autoClose: false, transitionDuration: 0, paused: false },
		})
		expect(onOpen).toHaveBeenCalledWith('a')
	})

	it('renders a progress bar when auto-close is a number', () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData(), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		expect(wrapper.find('.progress').exists()).toBe(true)
	})

	it('renders no progress bar when auto-close is false', () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData({ autoClose: false }), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		expect(wrapper.find('.progress').exists()).toBe(false)
	})

	it('emits hoverStart/hoverEnd on mouse enter/leave', async () => {
		const wrapper = mount(NotificationContainer, {
			global,
			props: { data: makeData({ autoClose: false }), autoClose: 1000, transitionDuration: 0, paused: false },
		})
		await wrapper.trigger('mouseenter')
		await wrapper.trigger('mouseleave')
		expect(wrapper.emitted('hoverStart')).toBeTruthy()
		expect(wrapper.emitted('hoverEnd')).toBeTruthy()
	})
})
