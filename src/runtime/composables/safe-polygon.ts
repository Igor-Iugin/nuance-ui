import type { Placement } from '@floating-ui/vue'


type Point = [number, number]
type Side = 'top' | 'right' | 'bottom' | 'left'

export interface SafePolygonOptions {
	/** Buffer in px around the polygon @default `0.5` */
	buffer?: number

	/** Requires a fast pointer movement towards the floating element @default `true` */
	requireIntent?: boolean
}

export interface SafePolygonContext {
	x: number
	y: number
	placement: Placement
	reference: HTMLElement
	floating: HTMLElement
	onClose: () => void
}

function isPointInPolygon(point: Point, polygon: Point[]) {
	const [x, y] = point
	let isInside = false

	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const [xi, yi] = polygon[i]!
		const [xj, yj] = polygon[j]!

		const intersect = (yi >= y) !== (yj >= y) && x <= (xj - xi) * (y - yi) / (yj - yi) + xi
		if (intersect)
			isInside = !isInside
	}

	return isInside
}

function isInside(point: Point, rect: DOMRect) {
	return point[0] >= rect.left && point[0] <= rect.right && point[1] >= rect.top && point[1] <= rect.bottom
}

/**
 * Port of floating-ui/react's `safePolygon`: builds a dynamic safe area between the reference
 * and floating elements so the pointer can travel from one to the other without closing it.
 * @see https://floating-ui.com/docs/useHover#safepolygon
 */
export function safePolygon(options: SafePolygonOptions = {}) {
	const { buffer = 0.5, requireIntent = true } = options

	let timeout = -1
	let hasLanded = false
	let lastX: number | null = null
	let lastY: number | null = null
	let lastTime = typeof performance !== 'undefined' ? performance.now() : 0

	function getCursorSpeed(x: number, y: number): number | null {
		const currentTime = performance.now()
		const elapsedTime = currentTime - lastTime

		if (lastX === null || lastY === null || elapsedTime === 0) {
			lastX = x
			lastY = y
			lastTime = currentTime
			return null
		}

		const deltaX = x - lastX
		const deltaY = y - lastY
		const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / elapsedTime

		lastX = x
		lastY = y
		lastTime = currentTime

		return speed
	}

	return ({ x, y, placement, reference, floating, onClose }: SafePolygonContext) => {
		return function onMouseMove(event: MouseEvent) {
			function close() {
				window.clearTimeout(timeout)
				onClose()
			}

			window.clearTimeout(timeout)

			const { clientX, clientY } = event
			const clientPoint: Point = [clientX, clientY]
			const target = event.target as Element | null
			const isLeave = event.type === 'mouseleave'
			const isOverFloatingEl = !!target && floating.contains(target)
			const isOverReferenceEl = !!target && reference.contains(target)
			const refRect = reference.getBoundingClientRect()
			const rect = floating.getBoundingClientRect()
			const side = placement.split('-')[0] as Side
			const cursorLeaveFromRight = x > rect.right - rect.width / 2
			const cursorLeaveFromBottom = y > rect.bottom - rect.height / 2
			const isOverReferenceRect = isInside(clientPoint, refRect)
			const isFloatingWider = rect.width > refRect.width
			const isFloatingTaller = rect.height > refRect.height
			const left = (isFloatingWider ? refRect : rect).left
			const right = (isFloatingWider ? refRect : rect).right
			const top = (isFloatingTaller ? refRect : rect).top
			const bottom = (isFloatingTaller ? refRect : rect).bottom

			if (isOverFloatingEl) {
				hasLanded = true
				if (!isLeave)
					return
			}

			if (isOverReferenceEl)
				hasLanded = false

			if (isOverReferenceEl && !isLeave) {
				hasLanded = true
				return
			}

			// Prevent overlapping floating element from being stuck in an open-close loop.
			if (isLeave && event.relatedTarget instanceof Element && floating.contains(event.relatedTarget))
				return

			// If the pointer is leaving from the opposite side, the buffer logic creates a point
			// where the floating element remains open, but should be ignored.
			if (
				(side === 'top' && y >= refRect.bottom - 1)
				|| (side === 'bottom' && y <= refRect.top + 1)
				|| (side === 'left' && x >= refRect.right - 1)
				|| (side === 'right' && x <= refRect.left + 1)
			) {
				return close()
			}

			// Ignore when the cursor is within the rectangular trough between the two elements.
			let rectPoly: Point[] = []

			switch (side) {
				case 'top':
					rectPoly = [[left, refRect.top + 1], [left, rect.bottom - 1], [right, rect.bottom - 1], [right, refRect.top + 1]]
					break
				case 'bottom':
					rectPoly = [[left, rect.top + 1], [left, refRect.bottom - 1], [right, refRect.bottom - 1], [right, rect.top + 1]]
					break
				case 'left':
					rectPoly = [[rect.right - 1, bottom], [rect.right - 1, top], [refRect.left + 1, top], [refRect.left + 1, bottom]]
					break
				case 'right':
					rectPoly = [[refRect.right - 1, bottom], [refRect.right - 1, top], [rect.left + 1, top], [rect.left + 1, bottom]]
					break
			}

			function getPolygon([x, y]: Point): Point[] {
				switch (side) {
					case 'top': {
						const p1: Point = [isFloatingWider ? x + buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y + buffer + 1]
						const p2: Point = [isFloatingWider ? x - buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y + buffer + 1]
						const common: [Point, Point] = [
							[rect.left, cursorLeaveFromRight ? rect.bottom - buffer : isFloatingWider ? rect.bottom - buffer : rect.top],
							[rect.right, cursorLeaveFromRight ? (isFloatingWider ? rect.bottom - buffer : rect.top) : rect.bottom - buffer],
						]
						return [p1, p2, ...common]
					}
					case 'bottom': {
						const p1: Point = [isFloatingWider ? x + buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y - buffer]
						const p2: Point = [isFloatingWider ? x - buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y - buffer]
						const common: [Point, Point] = [
							[rect.left, cursorLeaveFromRight ? rect.top + buffer : isFloatingWider ? rect.top + buffer : rect.bottom],
							[rect.right, cursorLeaveFromRight ? (isFloatingWider ? rect.top + buffer : rect.bottom) : rect.top + buffer],
						]
						return [p1, p2, ...common]
					}
					case 'left': {
						const p1: Point = [x + buffer + 1, isFloatingTaller ? y + buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4]
						const p2: Point = [x + buffer + 1, isFloatingTaller ? y - buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4]
						const common: [Point, Point] = [
							[cursorLeaveFromBottom ? rect.right - buffer : isFloatingTaller ? rect.right - buffer : rect.left, rect.top],
							[cursorLeaveFromBottom ? (isFloatingTaller ? rect.right - buffer : rect.left) : rect.right - buffer, rect.bottom],
						]
						return [...common, p1, p2]
					}
					case 'right': {
						const p1: Point = [x - buffer, isFloatingTaller ? y + buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4]
						const p2: Point = [x - buffer, isFloatingTaller ? y - buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4]
						const common: [Point, Point] = [
							[cursorLeaveFromBottom ? rect.left + buffer : isFloatingTaller ? rect.left + buffer : rect.right, rect.top],
							[cursorLeaveFromBottom ? (isFloatingTaller ? rect.left + buffer : rect.right) : rect.left + buffer, rect.bottom],
						]
						return [p1, p2, ...common]
					}
				}
			}

			if (isPointInPolygon([clientX, clientY], rectPoly))
				return

			if (hasLanded && !isOverReferenceRect)
				return close()

			if (!isLeave && requireIntent) {
				const speed = getCursorSpeed(clientX, clientY)
				if (speed !== null && speed < 0.1)
					return close()
			}

			if (!isPointInPolygon([clientX, clientY], getPolygon([x, y])))
				close()
			else if (!hasLanded && requireIntent)
				timeout = window.setTimeout(close, 40)
		}
	}
}
