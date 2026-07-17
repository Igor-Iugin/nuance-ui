import type { CSSProperties } from 'vue'

import {
	getFontSize,
	getLineHeight,
	getRadius,
	getSpacing,
	isNumberLike,
	rem,
} from '@nui/utils'

import type { StyleProps } from './types'


const FONT_FAMILY: Record<string, string> = {
	text: 'var(--font-family)',
	heading: 'var(--font-family-headings)',
	monospace: 'var(--font-family-mono)',
}

const id = (v: unknown) => v as string
const size = (v: unknown) => isNumberLike(v) ? rem(v) : v as string

export const STYLE_MAP: Partial<Record<
	keyof StyleProps,
	[keyof CSSProperties, (v: unknown) => string | undefined]
>> = {
	m: ['margin', getSpacing],
	mt: ['marginTop', getSpacing],
	mb: ['marginBottom', getSpacing],
	ml: ['marginLeft', getSpacing],
	mr: ['marginRight', getSpacing],
	ms: ['marginInlineStart', getSpacing],
	me: ['marginInlineEnd', getSpacing],
	mx: ['marginInline', getSpacing],
	my: ['marginBlock', getSpacing],
	p: ['padding', getSpacing],
	pt: ['paddingTop', getSpacing],
	pb: ['paddingBottom', getSpacing],
	pl: ['paddingLeft', getSpacing],
	pr: ['paddingRight', getSpacing],
	ps: ['paddingInlineStart', getSpacing],
	pe: ['paddingInlineEnd', getSpacing],
	px: ['paddingInline', getSpacing],
	py: ['paddingBlock', getSpacing],
	bd: ['border', id],
	bdrs: ['borderRadius', getRadius],
	opacity: ['opacity', id],
	ff: ['fontFamily', v => FONT_FAMILY[v as string] ?? v as string],
	fz: ['fontSize', getFontSize],
	fw: ['fontWeight', id],
	lts: ['letterSpacing', size],
	ta: ['textAlign', id],
	lh: ['lineHeight', getLineHeight],
	fs: ['fontStyle', id],
	tt: ['textTransform', id],
	td: ['textDecoration', id],
	w: ['width', getSpacing],
	h: ['height', getSpacing],
	miw: ['minWidth', getSpacing],
	maw: ['maxWidth', getSpacing],
	mih: ['minHeight', getSpacing],
	mah: ['maxHeight', getSpacing],
	bgsz: ['backgroundSize', size],
	bgp: ['backgroundPosition', id],
	bgr: ['backgroundRepeat', id],
	bga: ['backgroundAttachment', id],
	pos: ['position', id],
	top: ['top', size],
	left: ['left', size],
	bottom: ['bottom', size],
	right: ['right', size],
	inset: ['inset', size],
	display: ['display', id],
	flex: ['flex', id],
}
