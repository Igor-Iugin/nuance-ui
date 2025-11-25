import type { AlignedPlacement, Alignment, Side } from '@floating-ui/vue'
import type { CSSProperties } from 'vue'

import type { ArrowPosition } from '../types'


function horizontalSide(
	placement: Alignment | 'center',
	arrowY: number | undefined,
	arrowOffset: number,
	arrowPosition: ArrowPosition,
) {
	switch (placement) {
		case 'center':
			return arrowPosition === 'center' ? { top: arrowY && `${arrowY}px` } : {}
		case 'end':
			return { bottom: `${arrowOffset}px` }
		case 'start':
			return { top: `${arrowOffset}px` }
		default:
			return {}
	}
}

function verticalSide(
	placement: Alignment | 'center',
	arrowX: number | undefined,
	arrowOffset: number,
	arrowPosition: ArrowPosition,
	dir: 'rtl' | 'ltr',
) {
	switch (placement) {
		case 'center':
			return arrowPosition === 'center' ? { left: arrowX && `${arrowX}px` } : {}
		case 'end':
			return { [dir === 'ltr' ? 'right' : 'left']: `${arrowOffset}px` }
		case 'start':
			return { [dir === 'ltr' ? 'left' : 'right']: `${arrowOffset}px` }
		default:
			return {}
	}
}

const radiusByFloatingSide: Record<
	Side,
	keyof Pick<CSSProperties, 'borderBottomLeftRadius' | 'borderBottomRightRadius' | 'borderTopLeftRadius' | 'borderTopRightRadius'>
> = {
	bottom: 'borderTopLeftRadius',
	left: 'borderTopRightRadius',
	right: 'borderBottomLeftRadius',
	top: 'borderBottomRightRadius',
}


const PLACEMENT_VAR = 'var(--arrow-placement)'

export function getArrowPosition({
	placement: _placement,
	arrowSize,
	arrowOffset,
	arrowRadius,
	arrowPosition,
	arrowX,
	arrowY,
	dir = 'ltr',
}: {
	placement: Side | AlignedPlacement
	arrowSize?: number
	arrowOffset: number
	arrowRadius?: number
	arrowPosition: ArrowPosition
	arrowX: number | undefined
	arrowY: number | undefined
	dir?: 'rtl' | 'ltr'
}) {
	const [side, placement = 'center'] = _placement.split('-') as [Side, Alignment]
	const baseStyles = {
		'--arrow-size': arrowSize || undefined,
		'--arrow-radius': arrowRadius || undefined,
		[radiusByFloatingSide[side]]: 'var(--arrow-radius)',
	}

	switch (side) {
		case 'left':
			return ({
				...baseStyles,
				...horizontalSide(placement, arrowY, arrowOffset, arrowPosition),
				right: PLACEMENT_VAR,
				borderLeftColor: 'transparent',
				borderBottomColor: 'transparent',
				clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
			})
		case 'right':
			return ({
				...baseStyles,
				...horizontalSide(placement, arrowY, arrowOffset, arrowPosition),
				left: PLACEMENT_VAR,
				borderRightColor: 'transparent',
				borderTopColor: 'transparent',
				clipPath: 'polygon(0 100%, 0 0, 100% 100%)',
			})
		case 'top':
			return ({
				...baseStyles,
				...verticalSide(placement, arrowX, arrowOffset, arrowPosition, dir),
				bottom: PLACEMENT_VAR,
				borderTopColor: 'transparent',
				borderLeftColor: 'transparent',
				clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
			})
		case 'bottom':
			return ({
				...baseStyles,
				...verticalSide(placement, arrowX, arrowOffset, arrowPosition, dir),
				top: PLACEMENT_VAR,
				borderBottomColor: 'transparent',
				borderRightColor: 'transparent',
				clipPath: 'polygon(0 100%, 0 0, 100% 0)',
			})
		default:
			return {}
	}
}
