<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { getRadius, getThemeColor, useVarsResolver } from '#imports'

import type { Classes, NuanceColor, NuanceRadius, StringOrVNode } from '../types'
import type { ActionIconProps } from './action-icon/action-icon.vue'
import type { BoxProps } from './box.vue'
import type { ButtonProps } from './button/button.vue'
import type { LoaderProps } from './loader'

import ActionIcon from './action-icon/action-icon.vue'
import Box from './box.vue'
import Button from './button/button.vue'
import Loader from './loader/loader.vue'


export type NotificationOrientation = 'vertical' | 'horizontal'

export interface NotificationAction extends ButtonProps {
	/** Button label */
	label: string
	/** Click handler */
	onClick?: (event: MouseEvent) => void
}

type NotificationClasses
	= | 'root'
		| 'icon'
		| 'loader'
		| 'body'
		| 'title'
		| 'description'
		| 'actions'
		| 'closeButton'

interface NotificationVars {
	root: '--notification-radius' | '--notification-color'
}

export interface NotificationProps extends BoxProps {
	/**
	* Controls icon background color or notification accent line color, key of `theme.colors` or any valid CSS color.
	* When `icon` is provided, sets the icon background color.
	* When no icon is provided, sets the colored accent line on the left.
	*  @default theme.primaryColor
	*/
	color?: NuanceColor

	/**
	 * Key of `theme.radius` or any valid CSS value to set `border-radius`
	 * @default theme.defaultRadius
	 */
	radius?: NuanceRadius

	/** Notification icon, replaces color line */
	icon?: string

	/** Notification title, displayed above the message body */
	title?: StringOrVNode

	/** Notification body. When no title is provided, this is the main message. */
	message?: StringOrVNode

	/** Action buttons */
	actions?: NotificationAction[]

	/** Actions/close layout @default 'vertical' */
	orientation?: NotificationOrientation

	/** If set, displays a `Loader` component instead of the icon. Takes precedence over the `icon` prop if both are provided. */
	loading?: boolean

	/** Adds border to the root element */
	withBorder?: boolean

	/** If set, the close button is visible @default true */
	withCloseButton?: boolean

	/** Props passed down to the close button */
	closeButtonProps?: ActionIconProps

	/** Props passed down to the `Loader` component */
	loaderProps?: LoaderProps & HTMLAttributes

	role?: string

	classes?: Classes<NotificationClasses>
}

const {
	withCloseButton = true,
	radius,
	color,
	mod,
	loading,
	withBorder,
	role = 'alert',
	icon,
	loaderProps,
	title,
	message,
	actions,
	orientation = 'vertical',
	closeButtonProps,
	classes,
} = defineProps<NotificationProps>()

defineEmits<{
	/** Called when the close button is clicked */
	close: []
}>()

const style = useVarsResolver<NotificationVars>(theme => ({
	root: {
		'--notification-radius': radius === undefined ? undefined : getRadius(radius),
		'--notification-color': color ? getThemeColor(color, theme) : undefined,
	},
}))

// Strip `label` so it is not forwarded as an attribute to `Button`. `onClick`
// stays in the spread and is bound once as the button's click handler.
function actionProps({ label: _label, ...rest }: NotificationAction): ButtonProps {
	return rest
}
</script>

<template>
	<Box
		:style='style.root'
		:class='[$style.root, classes?.root]'
		:role
		:mod='[{
			"with-icon": !!icon || !!$slots.icon || loading,
			"with-border": withBorder,
			orientation,
		}, mod]'
	>
		<div v-if='icon && !loading' :class='[$style.icon, classes?.icon]'>
			<slot name='icon'>
				<Icon :name='icon' />
			</slot>
		</div>

		<Loader
			v-if='loading'
			size='28px'
			:color
			v-bind='loaderProps'
			:class='[$style.loader, loaderProps?.class, classes?.loader]'
		/>

		<div :class='[$style.body, classes?.body]'>
			<div v-if='title || $slots.title' :class='[$style.title, classes?.title]'>
				<slot name='title'>
					<component :is='title()' v-if='typeof title === "function"' />
					<component :is='title' v-else-if='title && typeof title === "object"' />
					<template v-else>
						{{ title }}
					</template>
				</slot>
			</div>

			<Box
				:class='[$style.description, classes?.description]'
				:mod='{ "with-title": !!title || !!$slots.title }'
			>
				<slot>
					<component :is='message()' v-if='typeof message === "function"' />
					<component :is='message' v-else-if='message && typeof message === "object"' />
					<template v-else>
						{{ message }}
					</template>
				</slot>
			</Box>

			<div
				v-if='orientation === "vertical" && (actions?.length || $slots.actions)'
				:class='[$style.actions, classes?.actions]'
			>
				<slot name='actions'>
					<Button
						v-for='(action, index) in actions'
						:key='index'
						size='compact-sm'
						:color
						v-bind='actionProps(action)'
					>
						{{ action.label }}
					</Button>
				</slot>
			</div>
		</div>

		<div
			v-if='orientation === "horizontal" && (actions?.length || $slots.actions)'
			:class='[$style.actions, classes?.actions]'
			data-position='end'
		>
			<slot name='actions'>
				<Button
					v-for='(action, index) in actions'
					:key='index'
					size='compact-sm'
					:color
					v-bind='actionProps(action)'
				>
					{{ action.label }}
				</Button>
			</slot>
		</div>

		<ActionIcon
			v-if='withCloseButton'
			icon='lucide:x'
			variant='subtle'
			:class='[$style.closeButton, classes?.closeButton]'
			v-bind='closeButtonProps'
			@click='$emit("close")'
		/>
	</Box>
</template>

<style module>
.root {
	--notification-radius: var(--radius-default);
	--notification-color: var(--color-primary-filled);

	position: relative;

	overflow: hidden;
	display: flex;
	align-items: center;

	box-sizing: border-box;
	padding-top: var(--spacing-xs);
	padding-bottom: var(--spacing-xs);
	padding-inline-start: 22px;
	padding-inline-end: var(--spacing-xs);
	border-radius: var(--notification-radius);

	box-shadow: var(--shadow-lg);

	&::before {
		content: '';

		position: absolute;
		top: var(--notification-radius);
		bottom: var(--notification-radius);
		inset-inline-start: 4px;

		display: block;

		width: 6px;
		border-radius: var(--notification-radius);

		background-color: var(--notification-color);
	}

	@mixin where-light {
		background-color: var(--color-white);
	}

	@mixin where-dark {
		background-color: var(--color-dark-6);
	}

	&:where([data-with-icon]) {
		&::before {
			display: none;
		}
	}

	&:where([data-with-border]) {
		@mixin where-light {
			border: 1px solid var(--color-gray-3);
		}

		@mixin where-dark {
			border: 1px solid var(--color-dark-4);
		}
	}
}

.icon {
	display: flex;
	align-items: center;
	justify-content: center;

	box-sizing: border-box;
	width: 28px;
	height: 28px;
	margin-inline-end: var(--spacing-md);
	border-radius: 28px;

	color: var(--color-white);

	background-color: var(--notification-color);
}

.loader {
	margin-inline-end: var(--spacing-md);
}

.body {
	overflow: hidden;
	flex: 1;

	margin-inline-end: var(--spacing-xs);
}

.title {
	overflow: hidden;

	margin-bottom: 2px;

	font-size: var(--font-size-sm);
	font-weight: 500;
	line-height: var(--line-height-sm);
	text-overflow: ellipsis;

	@mixin where-light {
		color: var(--color-gray-9);
	}

	@mixin where-dark {
		color: var(--color-white);
	}
}

.description {
	overflow: hidden;

	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	text-overflow: ellipsis;

	@mixin where-light {
		color: var(--color-black);
	}

	@mixin where-dark {
		color: var(--color-dark-0);
	}

	&:where([data-with-title]) {
		@mixin where-light {
			color: var(--color-gray-6);
		}

		@mixin where-dark {
			color: var(--color-dark-2);
		}
	}
}

.actions {
	display: flex;
	gap: var(--spacing-xs);
	align-items: center;
}

.body .actions {
	margin-top: var(--spacing-xs);
}

.actions[data-position='end'] {
	margin-inline-start: var(--spacing-xs);
}

.closeButton {
	margin-inline-start: var(--spacing-xs);
}
</style>
