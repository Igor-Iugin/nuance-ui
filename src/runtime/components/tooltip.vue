<script lang="ts">
import type { AlignedPlacement, OffsetOptions, Side, Strategy } from '@floating-ui/vue'
import type { AnyString, NuanceColor, NuanceRadius } from '@nui/types'

import type { ArrowPosition } from './popover/types'
import type { TransitionName, TransitionProps } from './transition/transition.vue'


export interface TooltipVars {
	root:
		| '--tooltip-radius'
		| '--tooltip-bg'
		| '--tooltip-color'
}

export interface TooltipProps {
	/** Tooltip label */
	label?: string

	/** Tooltip position relative to the target element @default `'top'` */
	placement?: Side | AlignedPlacement

	/** Space between target element and tooltip in px @default `5` */
	offset?: OffsetOptions

	/** Open delay in ms @default `0` */
	openDelay?: number

	/** Close delay in ms @default `0` */
	closeDelay?: number

	/** Events used to reveal the tooltip @default `{ hover: true, focus: false }` */
	events?: { hover?: boolean, focus?: boolean }

	/** Determines whether the tooltip has an arrow @default `false` */
	withArrow?: boolean

	/** Arrow size in px @default `4` */
	arrowSize?: number

	/** Arrow offset in px @default `5` */
	arrowOffset?: number

	/** Arrow `border-radius` in px @default `0` */
	arrowRadius?: number

	/** Arrow position */
	arrowPosition?: ArrowPosition

	/** Color from theme */
	color?: NuanceColor | AnyString

	/** Border radius */
	radius?: NuanceRadius

	/**
	 * Props passed down to the `Transition` component that animates tooltip presence
	 * @default `{ name: 'fade', duration: 100 }`
	 */
	transitionProps?: TransitionProps

	/** Disables the tooltip */
	disabled?: boolean

	/**
	 * Changes floating ui [position strategy](https://floating-ui.com/docs/usefloating#strategy)
	 * @default `'absolute'`
	 */
	floatingStrategy?: Strategy
}
</script>

<script setup lang='ts'>
import { useConfig, useVarsResolver } from '@nui/composables'
import { getRadius } from '@nui/utils'
import { unrefElement, useElementHover } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

import { usePopover } from './popover/lib/use-popover'
import Renderless from './renderless/renderless.vue'
import NTransition from './transition/transition.vue'


defineOptions({ inheritAttrs: false })

const {
	label,
	placement = 'bottom',
	offset = 5,
	openDelay = 0,
	closeDelay = 0,
	events = { hover: true, focus: false },
	withArrow,
	arrowSize = 8,
	arrowOffset = 5,
	arrowRadius = 0,
	arrowPosition = 'center',
	color,
	radius,
	transitionProps,
	disabled,
	floatingStrategy = 'absolute',
} = defineProps<TooltipProps>()

const opened = defineModel<boolean>('open', { default: false })

const store = usePopover({
	placement: () => placement,
	strategy: floatingStrategy,
	opened,
	arrowOffset,
	arrowPosition,
	arrowRadius,
	arrowSize,
	offset: typeof offset === 'number' ? offset + (withArrow ? arrowSize / 2 : 0) : offset,
	width: 'max-content',
	withArrow,
})

const target = computed(() => unrefElement(store.targetRef))
const hovered = useElementHover(target, { delayEnter: openDelay, delayLeave: closeDelay })
const focused = ref(false)

watch([hovered, focused], ([isHovered, isFocused]) => {
	const hovered = !!events.hover && isHovered
	const focused = !!events.focus && isFocused

	opened.value = !disabled && (hovered || focused)
})

// ─── Styles ───
const { variantResolver } = useConfig()

const animation = computed(() => {
	const pos = placement.split('-')[0]
	return `fade-${pos === 'top' ? 'up' : pos}` as TransitionName
})

const style = useVarsResolver<TooltipVars>(theme => {
	const { background, text } = variantResolver({ theme, variant: 'filled', color })
	return {
		root: {
			'--tooltip-radius': radius === undefined ? undefined : getRadius(radius),
			'--tooltip-bg': color ? background : undefined,
			'--tooltip-color': color ? text : undefined,
		},
	}
})
</script>

<template>
	<Renderless
		:ref='(el: any) => (store.targetRef.value = unrefElement(el) ?? null)'
		@focusin='events.focus && (focused = true)'
		@focusout='focused = false'
	>
		<slot />
	</Renderless>

	<div
		:ref='(el: any) => (store.dropdownRef.value = unrefElement(el))'
		popover='manual'
		:style='{ ...store.floatingStyles.value, ...style.root }'
		:class='$style.tooltip'
	>
		<NTransition
			:name='animation'
			:duration='100'
			v-bind='transitionProps'
			@before-enter='unrefElement(store.dropdownRef.value)?.showPopover()'
			@after-leave='unrefElement(store.dropdownRef.value)?.hidePopover()'
		>
			<div v-if='opened' :class='$style.body'>
				<slot name='label'>
					{{ label }}
				</slot>
				<span
					v-if='withArrow'
					:ref='(el: any) => (store.arrowRef.value = unrefElement(el))'
					:class='$style.arrow'
					:style='store.arrowStyles.value'
				/>
			</div>
		</NTransition>
	</div>
</template>

<style module>
.tooltip {
	pointer-events: none;

	overflow: visible;

	margin: 0;
	padding: 0;
	border: none;

	background: transparent;
}

.body {
	--tooltip-radius: var(--radius-sm);
	--tooltip-bg: var(--color-body);
	--tooltip-color: var(--color-text);

	position: relative;

	padding: var(--spacing-2xs) var(--spacing-xs);
	border-radius: var(--tooltip-radius);

	font-size: var(--font-size-md);
	line-height: 1;
	color: var(--tooltip-color);

	background-color: var(--tooltip-bg);
	box-shadow: var(--shadow-xs);
}

.arrow {
	--arrow-size: 8px;
	--arrow-radius: 0px;
	--arrow-placement: calc(var(--arrow-size) / 2 * -1);

	position: absolute;
	transform: rotate(45deg);

	width: var(--arrow-size);
	height: var(--arrow-size);

	background-color: inherit;
}
</style>
