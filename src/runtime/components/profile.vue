<script lang="ts" setup>
import type { Classes, NuanceSize } from '@nui/types'

import { computed } from 'vue'

import type { AvatarProps } from './avatar'
import type { BoxProps } from './box'
import type { IndicatorProps } from './indicator.vue'
import type { LinkProps } from './link'

import Avatar from './avatar/avatar.vue'
import Box from './box/box.vue'
import Group from './group.vue'
import Indicator from './indicator.vue'
import Link from './link/link.vue'
import Text from './text.vue'
import Title from './title.vue'


type ProfileLinkProps = Pick<LinkProps, 'to' | 'target'>

export interface ProfileProps extends BoxProps, ProfileLinkProps {
	title?: string
	description?: string | null
	/** Avatar props, or a shorthand `src` string */
	avatar?: AvatarProps['src'] | AvatarProps
	/** Component size @default `'md'` */
	size?: NuanceSize
	/** Indicator rendered on top of the avatar */
	indicator?: boolean | Omit<IndicatorProps, 'inline' | 'disabled'>
	/**
	 * Layout direction
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical'
	onClick?: (event: MouseEvent) => void
	classes?: Classes<
		| 'root'
		| 'avatar'
		| 'wrapper'
		| 'title'
		| 'description'
	>
}

const {
	is = 'div',
	title,
	avatar,
	description,
	classes,
	fw,
	indicator,
	size = 'md',
	orientation = 'horizontal',
	to,
	target,
	onClick,
	mod,
	...rest
} = defineProps<ProfileProps>()

const avatarProps = computed(() => (typeof avatar === 'string'
	? { src: avatar }
	: avatar) ?? {})
</script>

<template>
	<Box
		:is='to ? Link : is'
		:to
		:target
		:class='$style.root'
		:mod='[{
			"with-actions": !!$slots.actions,
			orientation,
			size,
		}, mod]'
		:role='!to && onClick ? "button" : undefined'
		:tabindex='!to && onClick ? 0 : undefined'
		v-bind='rest'
		@click='onClick'
		@keydown.enter='!to ? onClick?.($event) : undefined'
	>
		<Indicator
			:size
			:disabled='typeof indicator === "object" ? false : !indicator'
			inset
			v-bind='typeof indicator === "object" ? indicator : {}'
			:class='[$style.avatar, classes?.avatar]'
		>
			<Avatar
				radius='full'
				variant='filled'
				color='initials'
				:name='title'
				:size
				v-bind='avatarProps'
			/>
		</Indicator>

		<div :class='[$style.wrapper, classes?.wrapper]'>
			<Title order='3' :class='[$style.name, classes?.title]' :fw>
				<slot name='title'>
					{{ title }}
				</slot>
			</Title>
			<Text c='dimmed' :class='[$style.data, classes?.description]'>
				<slot>{{ description }}</slot>
			</Text>
		</div>

		<Group v-if='$slots.actions' align='center' gap='sm' :class='$style.actions'>
			<slot name='actions' />
		</Group>
	</Box>
</template>

<style module>
.root {
	display: grid;
	grid-template-areas: 'avatar wrapper';
	grid-template-columns: auto 1fr;
	column-gap: var(--spacing-sm);
	align-items: center;

	&[data-with-actions] {
		grid-template-areas: 'avatar wrapper actions';
		grid-template-columns: auto 1fr auto;
	}

	&[data-orientation='vertical'] {
		grid-template-areas:
			'avatar'
			'wrapper';
		grid-template-columns: 1fr;
		justify-items: start;

		&[data-with-actions] {
			grid-template-areas:
				'avatar actions'
				'wrapper wrapper';
			grid-template-columns: auto 1fr;
		}
	}

	.wrapper {
		grid-area: wrapper;
	}

	.avatar {
		--avatar-placeholder-fz: 1.5rem;

		grid-area: avatar;
	}

	.actions {
		grid-area: actions;
	}


	&[data-size='xs'] {
		column-gap: var(--spacing-xs);

		.wrapper {
			display: flex;
			gap: var(--spacing-xs);
		}

		.name,
		.data {
			font-size: var(--font-size-xs);
		}
	}

	&[data-size='sm'] {
		column-gap: var(--spacing-xs);

		.name,
		.data {
			font-size: var(--font-size-xs);
		}
	}

	&[data-size='md'],
	&[data-size='lg'] {
		.name {
			font-size: var(--font-size-sm);
		}

		.data {
			font-size: var(--font-size-xs);
		}
	}

	&[data-size='xl'] {

		.name,
		.data {
			font-size: var(--font-size-md);
		}
	}
}
</style>
