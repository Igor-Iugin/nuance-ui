let counter = 0

/** Unique id for a notification. */
export function createId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
		return crypto.randomUUID()

	counter += 1
	return `notification-${Date.now()}-${counter}`
}

/** Resolves the effective auto-close: a notification number/false wins, else the global value. */
export function getAutoClose(
	global: number | false,
	notification: number | false | undefined,
): number | false {
	if (typeof notification === 'number')
		return notification

	if (notification === false || global === false)
		return false

	return global
}
