<script setup lang='ts'>
import type { Classes, NuanceColor, NuanceRadius, NuanceSize } from '@nui/types'

import { useConfig, useVarsResolver } from '@nui/composables'
import { getFontSize, getRadius } from '@nui/utils'
import { useId } from 'vue'

import type { BoxProps } from './box.vue'

import ActionIcon from './action-icon/action-icon.vue'
import Box from './box.vue'


export type AlertClasses = 'root' | 'icon' | 'body' | 'title' | 'label' | 'message' | 'closeButton'

export type AlertVariant = 'filled' | 'light' | 'outline' | 'light-outline' | 'default'

export interface AlertVars {
	root: '--alert-radius' | '--alert-bg' | '--alert-color' | '--alert-bd' | '--alert-font-size'
}

export interface AlertProps extends BoxProps {
	/** Border radius */
	radius?: NuanceRadius

	/** Color from theme */
	color?: NuanceColor

	/** Alert title */
	title?: string

	/** Icon displayed next to the title */
	icon?: string

	/** Renders a close button in the top-right corner */
	withCloseButton?: boolean

	/** Called when the close button is clicked */
	onClose?: () => void

	/** `aria-label` for the close button */
	closeButtonLabel?: string

	/** Component size */
	size?: NuanceSize

	/** Visual variant */
	variant?: AlertVariant

	/** Styles API */
	classes?: Classes<AlertClasses>
}

const {
	mod,
	icon,
	color,
	title,
	radius,
	size = 'md',
	variant = 'light',
	withCloseButton,
	classes,
} = defineProps<AlertProps>()

defineEmits<{
	close: []
}>()

const id = useId()
const { icons, variantResolver } = useConfig()

const style = useVarsResolver<AlertVars>(theme => {
	const { background, border, text } = variantResolver({ variant, color, theme })
	return {
		root: {
			'--alert-radius': radius === undefined ? undefined : getRadius(radius),
			'--alert-bg': color || variant ? background : undefined,
			'--alert-color': text,
			'--alert-bd': color || variant ? border : undefined,
			'--alert-font-size': getFontSize(size),
		},
	}
})
</script>

<template>
	<Box
		role='alert'
		:style='style.root'
		:class='[$style.root, classes?.root]'
		:mod='[{ variant }, mod]'
		:aria-describedby='$slots.default ? `${id}-body` : undefined'
		:aria-labelledby='$slots.label ? `${id}-title` : undefined'
	>
		<Icon
			v-if='icon'
			:name='icon'
			:class='[$style.icon, classes?.icon]'
		/>

		<div :class='[$style.body, classes?.body]'>
			<Box v-if='title || $slots.title' :class='[$style.title, classes?.title]'>
				<span :id='`${id}-title`' :class='[$style.label, classes?.label]'>
					<slot name='title'>
						{{ title }}
					</slot>
				</span>
			</Box>

			<Box
				v-if='$slots.default'
				:id='`${id}-body`'
				:class='[$style.message, classes?.message]'
				:mod='{ variant }'
			>
				<slot />
			</Box>
		</div>

		<ActionIcon
			v-if='withCloseButton'
			:class='[$style.closeButton, classes?.closeButton]'
			variant='subtle'
			:icon='icons.close'
			size='sm'
			:color
			@click='$emit("close")'
		/>
	</Box>
</template>

<style module>
.root {
	--alert-radius: var(--radius-default);
	--alert-bg: var(--color-primary-light);
	--alert-bd: 1px solid transparent;
	--alert-color: var(--color-primary-light-color);

	position: relative;

	overflow: hidden;
	display: flex;
	gap: var(--spacing-xs);

	padding: var(--spacing-sm);
	border: var(--alert-bd);
	border-radius: var(--alert-radius);

	color: var(--alert-color);

	background-color: var(--alert-bg);
}

.body {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.title {
	display: flex;
	align-items: center;
	justify-content: space-between;

	font-size: var(--alert-font-size, var(--font-size-md));
	font-weight: 700;
}

.label {
	overflow: hidden;
	display: block;

	text-overflow: ellipsis;
}

.icon {
	display: flex;
	align-items: center;
	justify-content: flex-start;

	width: calc(var(--alert-font-size) * 1.3);
	height: calc(var(--alert-font-size) * 1.3);
	margin-top: 1px;

	font-size: var(--alert-font-size);
	line-height: 1;
}

.message {
	overflow: hidden;

	font-size: var(--alert-font-size, var(--font-size-md));
	text-overflow: ellipsis;

	:where([data-mantine-color-scheme='light']) & {
		color: var(--color-black);
	}

	:where([data-mantine-color-scheme='dark']) & {
		color: var(--color-white);
	}

	&:where([data-variant='filled']) {
		color: var(--alert-color);
	}

	&:where([data-variant='white']) {
		color: var(--color-black);
	}
}

.closeButton {
	width: 20px;
	height: 20px;

	color: var(--alert-color);
}
</style>
