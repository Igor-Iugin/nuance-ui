<script setup lang='ts'>
import type { HTMLAttributes } from 'vue'

import { getRadius, getThemeColor, useVarsResolver } from '#imports'

import type { AnyString, Classes, NuanceColor, NuanceRadius } from '../types'
import type { ActionIconProps } from './action-icon'
import type { BoxProps } from './box.vue'
import type { LoaderProps } from './loader'

import ActionIcon from './action-icon/action-icon.vue'
import Box from './box.vue'
import Loader from './loader/loader.vue'


interface ToastVars {
	root: '--toast-radius' | '--toast-color'
}

export interface ToastProps extends BoxProps {
	/** Called when the close button is clicked */
	onClose?: () => void

	/** Controls icon background color or notification accent line color, key of `theme.colors` or any valid CSS color.
	 *
	 * When `icon` is provided, sets the icon background color.
	 * When no icon is provided, sets the colored accent line on the left. @default theme.primaryColor
	 * */
	color?: NuanceColor

	/** Key of `theme.radius` or any valid CSS value to set `border-radius` @default theme.defaultRadius */
	radius?: NuanceRadius | AnyString

	/** Notification icon, replaces color line */
	icon?: string

	/** Notification title, displayed above the message body */
	title?: string

	/** If set, displays a `Loader` component instead of the icon. Takes precedence over the `icon` prop if both are provided. */
	loading?: boolean

	/** Adds border to the root element */
	withBorder?: boolean

	/** If set, the close button is visible @default true */
	withCloseButton?: boolean

	/** Props passed down to the close button */
	closeButtonProps?: ActionIconProps

	/** Props passed down to the `Loader` component */
	loaderProps?: LoaderProps

	/** Styles API */
	classes?: Classes<
		| 'root'
		| 'icon'
		| 'loader'
		| 'body'
		| 'title'
		| 'description'
	>

	role?: HTMLAttributes['role']
}

const {
	classes,
	mod,
	role,
	icon,
	loading,
	closeButtonProps,
	loaderProps,
	color,
	onClose,
	withBorder,
	withCloseButton,
	radius,
	title,
} = defineProps<ToastProps>()

const style = useVarsResolver<ToastVars>(theme => ({
	root: {
		'--toast-radius': radius === undefined ? undefined : getRadius(radius),
		'--toast-color': color ? getThemeColor(color, theme) : undefined,
	},
}))
</script>

<template>
	<Box
		:is
		:class='[$style.root, classes?.root]'
		:mod='[{
			"with-icon": !!icon || loading,
			"with-border": withBorder,
		}, mod]'
		:role='role || "alert"'
		:style='style.root'
	>
		<div
			v-if='(icon || $slots.icon) && !loading'
			:class='[$style.icon, classes?.icon]'
		>
			<slot name='icon'>
				<Icon :name='icon!' />
			</slot>
		</div>

		<Loader
			v-if='loading'
			size='28px'
			:color
			v-bind='loaderProps'
			:class='[$style.loader, classes?.loader]'
		/>

		<div :class='[$style.body, classes?.body]'>
			<span
				v-if='title'
				:class='[$style.title, classes?.title]'
			>
				{{ title }}
			</span>

			<Box
				:mod='{ "with-title": !!title }'
				:class='[$style.description, classes?.description]'
			>
				<slot />
			</Box>
		</div>

		<ActionIcon
			v-if='withCloseButton'
			icon='gravity-ui:xmark'
			variant='subtle'
			tabindex='0'
			v-bind='closeButtonProps'
			:class='$style.closeButton'
			@click='onClose?.()'
		/>
	</Box>
</template>

<style module>
.root {
  --toast-radius: var(--radius-default);
  --toast-color: var(--color-primary-filled);

  position: relative;

  overflow: hidden;
  display: flex;
  align-items: center;

  box-sizing: border-box;
  padding-top: var(--spacing-xs);
  padding-bottom: var(--spacing-xs);
  padding-inline-start: 22px;
  padding-inline-end: var(--spacing-xs);
  border-radius: var(--toast-radius);

  box-shadow: var(--shadow-lg);

  &::before {
    content: '';

    position: absolute;
    top: var(--toast-radius);
    bottom: var(--toast-radius);
    inset-inline-start: 4px;

    display: block;

    width: 6px;
    border-radius: var(--toast-radius);

    background-color: var(--toast-color);
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

  @mixin where-light {
    background-color: var(--color-white);
  }

  @mixin where-dark {
    background-color: var(--color-dark-6);
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

  background-color: var(--toast-color);
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
  font-weight: var(--font-weight-medium);
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

  &:where([data-with-title]) {
    @mixin where-light {
      color: var(--color-gray-6);
    }

    @mixin where-dark {
      color: var(--color-dark-2);
    }
  }

  @mixin where-light {
    color: var(--color-black);
  }

  @mixin where-dark {
    color: var(--color-dark-0);
  }
}

.closeButton {
  @mixin hover {
    @mixin where-light {
      background-color: var(--color-gray-0);
    }

    @mixin where-dark {
      background-color: var(--color-dark-8);
    }
  }
}
</style>
