import { beforeEach, describe, expect, it } from 'vitest'

import { NotificationsStore } from './notifications-store'


function makeStore() {
	// Bypass the singleton for isolated tests.
	return (NotificationsStore as unknown as { new(): NotificationsStore })
		.prototype.constructor
		? Reflect.construct(NotificationsStore, []) as NotificationsStore
		: new (NotificationsStore as any)()
}

describe('NotificationsStore', () => {
	let store: NotificationsStore

	beforeEach(() => {
		store = makeStore()
		store.updateState(s => ({ ...s, limit: 2 }))
	})

	it('show returns an id and adds a visible notification', () => {
		const id = store.show({ title: 'a' })
		expect(typeof id).toBe('string')
		expect(store.state.notifications).toHaveLength(1)
		expect(store.state.notifications[0]!.id).toBe(id)
	})

	it('queues notifications beyond the limit', () => {
		store.show({ title: 'a' })
		store.show({ title: 'b' })
		store.show({ title: 'c' })
		expect(store.state.notifications).toHaveLength(2)
		expect(store.state.queue).toHaveLength(1)
	})

	it('hide frees a slot and pulls the next from the queue (FIFO)', () => {
		const a = store.show({ title: 'a' })
		store.show({ title: 'b' })
		const cId = store.show({ title: 'c' })
		store.hide(a)
		expect(store.state.notifications.map(n => n.id)).toContain(cId)
		expect(store.state.queue).toHaveLength(0)
	})

	it('show with an existing id updates in place, no duplicate', () => {
		const id = store.show({ id: 'x', title: 'a' })
		store.show({ id: 'x', title: 'b' })
		expect(store.state.notifications).toHaveLength(1)
		expect(store.state.notifications[0]!.title).toBe('b')
		expect(store.state.notifications[0]!.id).toBe(id)
	})

	it('update patches an existing notification', () => {
		const id = store.show({ title: 'a' })
		store.update(id, { title: 'b', color: 'green' })
		expect(store.state.notifications[0]!.title).toBe('b')
		expect(store.state.notifications[0]!.color).toBe('green')
	})

	it('update of an unknown id is a no-op', () => {
		store.update('missing', { title: 'b' })
		expect(store.state.notifications).toHaveLength(0)
	})

	it('clean removes visible and queued notifications', () => {
		store.show({ title: 'a' })
		store.show({ title: 'b' })
		store.show({ title: 'c' })
		store.clean()
		expect(store.state.notifications).toHaveLength(0)
		expect(store.state.queue).toHaveLength(0)
	})

	it('cleanQueue removes only the queue', () => {
		store.show({ title: 'a' })
		store.show({ title: 'b' })
		store.show({ title: 'c' })
		store.cleanQueue()
		expect(store.state.notifications).toHaveLength(2)
		expect(store.state.queue).toHaveLength(0)
	})
})
