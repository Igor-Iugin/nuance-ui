<script setup lang='ts'>
import type { AnyString, Classes, NuanceRadius, NuanceSize, NuanceSpacing } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getRadius, getSize, getSpacing } from '@nui/utils'

import type { AvatarProps } from './avatar/avatar.vue'
import type { BoxProps } from './box/box.vue'
import type { ButtonProps } from './button/button.vue'
import type { LoaderProps } from './loader/loader.vue'

import Avatar from './avatar/avatar.vue'
import Box from './box/box.vue'
import Button from './button/button.vue'
import Loader from './loader/loader.vue'


interface EmptyVars {
	root: '--empty-padding'	| '--empty-radius' | '--empty-avatar-size'
}

export interface EmptyProps extends BoxProps {
	title?: string
	description?: string
	avatar?: AvatarProps

	/** Border radius */
	radius?: NuanceRadius
	padding?: NuanceSpacing | AnyString

	/** Display a list of Button in the body */
	actions?: ButtonProps[]

	/** Loading state */
	loading?: boolean

	loaderType?: LoaderProps['type']

	/** Icon displayed next to the title */
	icon?: string

	/** Component size */
	size?: NuanceSize

	/** Visual variant */
	variant?: 'filled' | 'outline' | 'soft' | 'clear'

	/** Styles API */
	classes?: Classes<
		| 'root'
		| 'header'
		| 'title'
		| 'description'
		| 'body'
		| 'actions'
		| 'footer'
	>
}

const {
	is = 'section',
	variant = 'clear',
	mod,
	icon,
	title,
	description,
	actions,
	size = 'sm',
	avatar,
	classes,
	loaderType = 'oval',
	padding,
	radius,
	bdrs,
	...rest
} = defineProps<EmptyProps>()

const style = useVarsResolver<EmptyVars>(() => ({
	root: {
		'--empty-padding': getSpacing(padding),
		'--empty-radius': radius || bdrs ? getRadius(radius || bdrs) : undefined,
		'--empty-avatar-size': getSize(size, 'empty-avatar-size'),
	},
}))
</script>

<template>
	<Box
		:is
		:mod='[{ variant }, mod]'
		:style='style.root'
		:class='[$style.root, classes?.root]'
		v-bind='rest'
	>
		<header class='slot-empty' :class='[$style.header, classes?.header]'>
			<slot name='header'>
				<slot name='leading'>
					<Avatar v-if='!!avatar || icon' v-bind='avatar' :class='$style.avatar' :icon>
						<Loader v-if='loading' :type='loaderType' />
					</Avatar>
				</slot>

				<h2 class='slot-empty' :class='[$style.title, classes?.title]'>
					<slot name='title'>
						{{ title }}
					</slot>
				</h2>

				<div class='slot-empty' :class='[$style.description, classes?.description]'>
					<slot name='description'>
						{{ description }}
					</slot>
				</div>
			</slot>
		</header>

		<div class='slot-empty' :class='[$style.body, classes?.body]'>
			<slot name='body'>
				<div class='slot-empty' :class='[$style.actions, classes?.actions]'>
					<slot name='actions'>
						<Button v-for='(action, ix) in actions' :key='ix' :size v-bind='action'>
							{{ action?.label }}
						</Button>
					</slot>
				</div>
			</slot>
		</div>

		<footer class='slot-empty' :class='[$style.footer, classes?.footer]'>
			<slot name='footer' />
		</footer>
	</Box>
</template>

<style module>
.root {
	--empty-avatar-size-xs: rem(32px);
	--empty-avatar-size-sm: rem(36px);
	--empty-avatar-size-md: rem(40px);
	--empty-avatar-size-lg: rem(44px);
	--empty-avatar-size-xl: rem(48px);

	--empty-radius: var(--radius-default);
	--empty-spacing: var(--spacing-md);
	--empty-padding: var(--spacing-sm);
	--empty-bd: transparent;
	--empty-bg: transparent;

	position: relative;

	display: flex;
	flex-direction: column;
	gap: var(--empty-spacing);
	align-items: center;
	justify-content: center;

	min-width: 0;
	padding: var(--empty-padding);
	border: rem(1px) solid var(--empty-bd);
	border-radius: var(--empty-radius);

	color: var(--empty-color);

	background-color: var(--empty-bg);

	&[data-variant='filled'] {
		@mixin where-light {
			--empty-bg: var(--color-gray-2);
		}

		@mixin where-dark {
			--empty-bg: var(--color-dark-7);
		}
	}

	&[data-variant='soft'] {
		@mixin where-light {
			--empty-bg: var(--color-gray-2);
		}

		@mixin where-dark {
			--empty-bg: alpha(var(--color-dark-7), .5);
		}
	}

	&[data-variant='outline'] {
		--empty-bd: var(--color-default-border);
	}
}

.header {
	display: flex;
	flex-direction: column;
	gap: calc(var(--empty-spacing) / 2);
	align-items: center;

	max-width: 24rem;

	text-align: center;
}

.body {
	display: flex;
	flex-direction: column;
	gap: var(--empty-spacing);
	align-items: center;

	max-width: 24rem;
}

.title {
	font-weight: 600;
	text-wrap: pretty;
}

.description {
	color: var(--color-dimmed);
	text-align: center;
	text-wrap: balance;
}

.actions {
	display: flex;
	flex-shrink: 0;
	flex-wrap: wrap;
	gap: calc(var(--empty-spacing) / 2);
	align-items: center;
}

.avatar {
	--avatar-size: var(--empty-avatar-size)
}

.footer {
	display: flex;
	flex-direction: column;
	gap: calc(var(--empty-spacing) / 2);
	align-items: center;

	max-width: 24rem;
}
</style>
