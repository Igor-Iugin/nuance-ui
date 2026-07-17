<script lang="ts">
import type { Classes } from '@nui/types'

import type { BoxProps } from './box/box.vue'

import Box from './box/box.vue'


export type CollapseClasses = 'root' | 'trigger' | 'content'

/** Props passed to the trigger slot, spread onto a custom toggle element for a11y. */
export interface CollapseTriggerProps {
	'aria-controls': string
	'aria-expanded': boolean
	'disabled': boolean | undefined
	'data-state': 'open' | 'closed'
	'data-disabled': '' | undefined
}

export interface CollapseProps extends BoxProps {
	/**
	 * The open state of the collapsible when it is initially rendered.
	 * Use when you do not need to control its open state.
	 * @default false
	 */
	defaultOpen?: boolean

	/** Disables the component */
	disabled?: boolean

	/**
	 * If set, the content stays mounted when collapsed.
	 * When `false`, content is unmounted after the exit transition.
	 * @default true
	 */
	keepMounted?: boolean

	/** Transition duration in ms @default 200 */
	transitionDuration?: number

	/** Transition timing function @default 'ease' */
	transitionTimingFunction?: string

	/** If set, opacity is animated alongside height @default true */
	animateOpacity?: boolean

	/** Styles API */
	classes?: Classes<CollapseClasses>
}

export interface CollapseSlots {
	/** Collapsible content */
	default?: (props: { open: boolean }) => any
	/** Toggle control. Spread `props` onto a button to get a11y wiring. */
	trigger?: (props: {
		open: boolean
		toggle: () => void
		props: CollapseTriggerProps
	}) => any
}
</script>

<script setup lang='ts'>
import { unrefElement, usePreferredReducedMotion } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, useId, useTemplateRef, watch } from 'vue'


const {
	disabled,
	keepMounted = true,
	transitionDuration = 200,
	transitionTimingFunction = 'ease',
	animateOpacity = true,
	mod,
	classes,
	...rest
} = defineProps<CollapseProps>()

defineSlots<CollapseSlots>()

const opened = defineModel<boolean>('open', { default: p => p.defaultOpen })

const contentId = useId()

const reducedMotion = usePreferredReducedMotion()
const duration = computed(() => reducedMotion.value === 'reduce' ? 0 : transitionDuration)

function toggle() {
	if (disabled)
		return
	opened.value = !opened.value
}

const dataState = computed<'open' | 'closed'>(() => opened.value ? 'open' : 'closed')

const triggerProps = computed<CollapseTriggerProps>(() => ({
	'aria-controls': contentId,
	'aria-expanded': opened.value,
	'disabled': disabled || undefined,
	'data-state': dataState.value,
	'data-disabled': disabled ? '' : undefined,
}))

// ─── Height transition ───

const el = useTemplateRef<HTMLElement>('content')

// node is unmounted while closed only when `keepMounted` is false
const mounted = ref(keepMounted || opened.value)
let timer: ReturnType<typeof setTimeout> | undefined

function transitionStyle() {
	const opacity = animateOpacity ? `, opacity ${duration.value}ms ${transitionTimingFunction}` : ''
	return `height ${duration.value}ms ${transitionTimingFunction}${opacity}`
}

function expand(node: HTMLElement, instant: boolean) {
	clearTimeout(timer)
	node.style.overflow = 'hidden'

	if (instant) {
		node.style.height = ''
		node.style.opacity = ''
		node.style.transition = ''
		node.style.overflow = ''
		return
	}

	node.style.height = '0px'
	if (animateOpacity)
		node.style.opacity = '0'
	void node.offsetHeight

	node.style.transition = transitionStyle()
	node.style.height = `${node.scrollHeight}px`
	if (animateOpacity)
		node.style.opacity = '1'

	timer = setTimeout(() => {
		// release to auto so nested content can resize freely once open
		node.style.transition = ''
		node.style.height = ''
		node.style.overflow = ''
		node.style.opacity = ''
	}, duration.value)
}

function collapse(node: HTMLElement, instant: boolean) {
	clearTimeout(timer)
	node.style.overflow = 'hidden'
	node.style.height = `${node.scrollHeight}px`
	void node.offsetHeight

	if (instant) {
		node.style.transition = ''
		node.style.height = '0px'
		if (animateOpacity)
			node.style.opacity = '0'
		if (!keepMounted)
			mounted.value = false
		return
	}

	node.style.transition = transitionStyle()
	node.style.height = '0px'
	if (animateOpacity)
		node.style.opacity = '0'

	timer = setTimeout(() => {
		if (!keepMounted)
			mounted.value = false
	}, duration.value)
}

// set initial closed state on the node so JS-driven expand() has a known starting point
onMounted(() => {
	const node = unrefElement(el)
	if (!node || opened.value)
		return
	node.style.height = '0px'
	node.style.overflow = 'hidden'
	if (animateOpacity)
		node.style.opacity = '0'
})

watch(opened, async value => {
	if (value) {
		// ensure the node exists before measuring it
		if (!mounted.value) {
			mounted.value = true
			await nextTick()
		}
		if (el.value)
			expand(unrefElement(el)!, duration.value === 0)
	}
	else if (el.value) {
		collapse(unrefElement(el)!, duration.value === 0)
	}
})
</script>

<template>
	<Box
		v-bind='rest'
		:mod='[{ disabled, state: dataState }, mod]'
		:class='classes?.root'
	>
		<slot
			name='trigger'
			:open='opened'
			:toggle='toggle'
			:props='triggerProps'
		/>

		<Box
			v-if='mounted'
			:id='contentId'
			ref='content'
			:class='classes?.content'
			:mod='{ disabled, open: opened }'
		>
			<slot :open='opened' />
		</Box>
	</box>
</template>
