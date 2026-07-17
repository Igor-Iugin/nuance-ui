import type {
	AnyString,
	NuanceColor,
	NuanceFontSize,
	NuanceLineHeight,
	NuanceRadius,
	NuanceSpacing,
} from '@nui/types'
import type { CSSProperties } from 'vue'


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
	c?: NuanceColor | 'dimmed' | AnyString
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
