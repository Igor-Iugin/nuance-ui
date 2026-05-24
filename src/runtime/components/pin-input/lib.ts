const regex = {
	number: /^\d+$/,
	alphanumeric: /^[a-z0-9]+$/i,
}

export function pinValidate(code: string, type: 'alphanumeric' | 'number' | RegExp) {
	const re = type instanceof RegExp ? type : regex[type] ?? null
	return re?.test(code)
}

export function createPinArray(length: number, value: string): string[] {
	if (length < 1)
		return []

	const values = Array.from<string>({ length }).fill('')

	if (value) {
		const splitted = value.trim().split('')
		for (let i = 0; i < Math.min(length, splitted.length); i += 1)
			values[i] = splitted[i] === ' ' ? '' : splitted[i]!
	}

	return values
}
