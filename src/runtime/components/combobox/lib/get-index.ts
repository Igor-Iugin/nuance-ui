export function getPreviousIndex(
	currentIndex: number,
	elements: NodeListOf<HTMLDivElement> | HTMLDivElement[],
	loop: boolean,
	disabledAttr: string,
) {
	for (let i = currentIndex - 1; i >= 0; i -= 1) {
		if (!elements[i]?.hasAttribute(disabledAttr))
			return i
	}

	if (loop) {
		for (let i = elements.length - 1; i > -1; i -= 1) {
			if (!elements[i]?.hasAttribute(disabledAttr))
				return i
		}
	}

	return currentIndex
}

export function getNextIndex(
	currentIndex: number,
	elements: NodeListOf<HTMLDivElement> | HTMLDivElement[],
	loop: boolean,
	disabledAttr: string,
) {
	for (let i = currentIndex + 1; i < elements.length; i += 1) {
		if (!elements[i]?.hasAttribute(disabledAttr))
			return i
	}

	if (loop) {
		for (let i = 0; i < elements.length; i += 1) {
			if (!elements[i]?.hasAttribute(disabledAttr))
				return i
		}
	}

	return currentIndex
}

export function getFirstIndex(elements: NodeListOf<HTMLDivElement> | HTMLDivElement[], disabledAttr: string) {
	for (let i = 0; i < elements.length; i += 1) {
		if (!elements[i]?.hasAttribute(disabledAttr))
			return i
	}

	return -1
}
