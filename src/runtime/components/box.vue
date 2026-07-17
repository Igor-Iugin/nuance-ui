<script setup lang='ts'>
import type { AnyString, NuanceColor, NuanceFontSize, NuanceLineHeight, NuanceRadius, NuanceSpacing } from '@nui/types'
import type { Mod } from '@nui/utils'
import type { Component, CSSProperties } from 'vue'

import { useTheme } from '@nui/composables'
import { getFontSize, getLineHeight, getMod, getRadius, getSpacing, getThemeColor, isFalsy, isNumberLike, rem } from '@nui/utils'
import { computed } from 'vue'


export interface StyleProps {
	/** Margin */
	m?: NuanceSpacing | AnyString
	/** MarginTop */
	mt?: NuanceSpacing | AnyString
	/** MarginBottom */
	mb?: NuanceSpacing | AnyString
	/** MarginLeft */
	ml?: NuanceSpacing | AnyString
	/** MarginRight */
	mr?: NuanceSpacing | AnyString
	/** MarginInlineStart */
	ms?: NuanceSpacing | AnyString
	/** MarginInlineEnd */
	me?: NuanceSpacing | AnyString
	/** MarginInline */
	mx?: NuanceSpacing | AnyString
	/** MarginBlock */
	my?: NuanceSpacing | AnyString
	/** Padding */
	p?: NuanceSpacing | AnyString
	/** PaddingTop */
	pt?: NuanceSpacing | AnyString
	/** PaddingBottom */
	pb?: NuanceSpacing | AnyString
	/** PaddingLeft */
	pl?: NuanceSpacing | AnyString
	/** PaddingRight */
	pr?: NuanceSpacing | AnyString
	/** PaddingInlineStart */
	ps?: NuanceSpacing | AnyString
	/** PaddingInlineEnd */
	pe?: NuanceSpacing | AnyString
	/** PaddingInline */
	px?: NuanceSpacing | AnyString
	/** PaddingBlock */
	py?: NuanceSpacing | AnyString
	/** Border */
	bd?: CSSProperties['border']
	/** Border radius */
	bdrs?: NuanceRadius | AnyString
	/** Background color from theme */
	bg?: NuanceColor | AnyString
	/** Text color from theme */
	c?: NuanceColor | AnyString
	/** CSS opacity */
	opacity?: CSSProperties['opacity']
	/** Font family */
	ff?: 'text' | 'heading' | 'monospace' | AnyString
	/** Font size token */
	fz?: NuanceFontSize | number | AnyString
	/** Font weight */
	fw?: CSSProperties['fontWeight']
	/** Letter spacing */
	lts?: CSSProperties['letterSpacing']
	/** Text align */
	ta?: CSSProperties['textAlign']
	/** Line height token */
	lh?: NuanceLineHeight | number | AnyString
	/** Font style */
	fs?: CSSProperties['fontStyle']
	/** Text transform */
	tt?: CSSProperties['textTransform']
	/** Text decoration */
	td?: CSSProperties['textDecoration']
	/** Width */
	w?: NuanceSpacing | CSSProperties['width']
	/** Min width */
	miw?: NuanceSpacing | CSSProperties['minWidth']
	/** Max width */
	maw?: NuanceSpacing | CSSProperties['maxWidth']
	/** Height */
	h?: NuanceSpacing | CSSProperties['height']
	/** Min height */
	mih?: NuanceSpacing | CSSProperties['minHeight']
	/** Max height */
	mah?: NuanceSpacing | CSSProperties['maxHeight']
	/** Background size */
	bgsz?: CSSProperties['backgroundSize']
	/** Background position */
	bgp?: CSSProperties['backgroundPosition']
	/** Background repeat */
	bgr?: CSSProperties['backgroundRepeat']
	/** Background attachment */
	bga?: CSSProperties['backgroundAttachment']
	/** CSS position */
	pos?: CSSProperties['position']
	/** Top offset */
	top?: CSSProperties['top']
	/** Left offset */
	left?: CSSProperties['left']
	/** Bottom offset */
	bottom?: CSSProperties['bottom']
	/** Right offset */
	right?: CSSProperties['right']
	/** CSS inset */
	inset?: CSSProperties['inset']
	/** CSS display */
	display?: CSSProperties['display']
	/** CSS flex */
	flex?: CSSProperties['flex']
}

export interface BoxProps extends StyleProps {
	/**
	 * Rendered element or component
	 * @default `'div'`
	 */
	is?: keyof HTMLElementTagNameMap | Component

	/** Element modifiers transformed into `data-` attributes, falsy values are removed */
	mod?: Mod | Mod[] | Mod[][] | null
}

const props = defineProps<BoxProps>()

const FONT_FAMILY: Record<string, string> = {
	text: 'var(--font-family)',
	heading: 'var(--font-family-headings)',
	monospace: 'var(--font-family-mono)',
}

const id = (v: unknown) => v as string
const size = (v: unknown) => isNumberLike(v) ? rem(v) : v as string

const STYLE_MAP: Partial<Record<keyof StyleProps, [keyof CSSProperties, (v: unknown) => string | undefined]>> = {
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


const theme = useTheme()

const mod = computed(() => {
	if (!props.mod)
		return null

	if (Array.isArray(props.mod)) {
		return props.mod
			.filter(i => !isFalsy(i))
			.reduce<Mod>((acc, value: Mod | Mod[]) => ({
				...acc,
				...getMod(value),
			}), {})
	}

	return getMod(props.mod)
})

const style = computed(() => {
	const style: Record<string, string | undefined> = {}

	for (const key in STYLE_MAP) {
		const value = props[key as keyof StyleProps]
		if (value === undefined)
			continue
		const [property, resolve] = STYLE_MAP[key as keyof StyleProps]!
		style[property] = resolve(value)
	}

	if (props.bg !== undefined)
		style.background = getThemeColor(props.bg, theme.value)
	if (props.c !== undefined)
		style.color = getThemeColor(props.c, theme.value)

	return style
})
</script>

<template>
	<component :is="props.is ?? 'div'" v-bind='mod' :style='style'>
		<slot />
	</component>
</template>
