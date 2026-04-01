<script setup lang='ts'>
import { useModal } from '@nui/modals'


const commands = computed(() => [])
const cursor = computed(() => -1)

const { opened } = useModal('map-history')
</script>

<template>
	<NModalRoot
		v-model:open='opened'
		:within-portal='false'
		:close-on-click-outside='false'
		without-overlay
		transition='slide-right'
	>
		<NModalHeader :class='$style.header'>
			<NModalTitle order='3' fz='1rem' fw='600'>
				История
			</NModalTitle>
			<NActionIconGroup>
				<NActionIcon
					icon='gravity-ui:arrow-uturn-ccw-left'
					size='sm'
				/>
				<NActionIcon
					icon='gravity-ui:arrow-uturn-cw-right'
					size='sm'
				/>
			</NActionIconGroup>
			<NModalCloseButton />
		</NModalHeader>

		<ul :class='$style.list'>
			<template v-if='commands.length > 0'>
				<NBox
					is='li'
					v-for='(cmd, ix) in commands'
					:key='ix'
					:class='$style.item'
					:mod='{ active: ix <= cursor, current: ix === cursor }'
				>
					<span :class='$style.index'>{{ ix + 1 }}</span>
					<span :class='$style.label'>{{ 'TEST' }}</span>
				</NBox>
			</template>
			<div v-else :class='$style.empty'>
				Нет операций
			</div>
		</ul>
	</NModalRoot>
</template>

<style lang='postcss' module>
.sidebar {
	position: absolute;
	z-index: 2;
	top: 2.25rem;
	left: 0;

	display: flex;
	flex-direction: column;

	width: 260px;
	border-radius: var(--radius-sm);

	background: var(--color-body);
	box-shadow: var(--shadow-md);
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	padding: .5rem .75rem;

	border-bottom: 1px solid var(--color-gray-2);
}

.list {
	overflow-y: auto;
	flex: 1;

	padding-left: 0;
}

.item {
	cursor: default;

	display: flex;
	gap: .5rem;
	align-items: center;

	padding: .35rem .75rem;

	font-size: .8rem;
	color: var(--color-dimmed);

	opacity: 0.45;

	transition: opacity 150ms, background 150ms;

	&[data-active] {
		color: var(--color-text);

		opacity: 1;
	}

	&[data-current] {
		font-weight: 500;

		background: var(--color-default-hover);
	}
}

.index {
	flex-shrink: 0;

	font-size: .75rem;
	color: var(--color-dimmed);
	text-align: right;
}

.label {
	overflow: hidden;

	text-overflow: ellipsis;
	white-space: nowrap;
}

.empty {
	padding: 1rem;

	font-size: .8rem;
	color: var(--color-dimmed);
	text-align: center;
}
</style>
