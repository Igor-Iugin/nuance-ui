export function getInitials(name: string, limit = 2) {
	const split = name.split(' ')

	if (split.length === 1)
		return name.slice(0, limit).toUpperCase()

	return split
		.map(word => word[0])
		.slice(0, limit)
		.join('')
		.toUpperCase()
}
