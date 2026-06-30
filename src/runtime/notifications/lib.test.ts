import { describe, expect, it } from 'vitest'

import { createId, getAutoClose } from './lib'


describe('getAutoClose', () => {
	it('returns the notification value when it is a number', () => {
		expect(getAutoClose(4000, 1000)).toBe(1000)
	})

	it('returns false when the notification value is false', () => {
		expect(getAutoClose(4000, false)).toBe(false)
	})

	it('returns false when the global value is false and no override', () => {
		expect(getAutoClose(false, undefined)).toBe(false)
	})

	it('falls back to the global value when override is undefined', () => {
		expect(getAutoClose(4000, undefined)).toBe(4000)
	})
})

describe('createId', () => {
	it('returns a non-empty unique string', () => {
		expect(createId()).not.toBe(createId())
		expect(createId().length).toBeGreaterThan(0)
	})
})
