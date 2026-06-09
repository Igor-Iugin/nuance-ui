<script setup lang='ts'>
import type { TimelineItem } from '@nui/components'

import { useTimeAgo } from '@vueuse/core'


const active = ref(2)

const items: TimelineItem[] = [
	{
		id: '1',
		label: 'Order placed',
		description: 'Your order has been received and is being processed.',
	},
	{
		id: '2',
		label: 'Payment confirmed',
		description: 'Payment was successfully verified.',
	},
	{
		id: '3',
		label: 'Shipped',
		description: 'Package is on its way to the destination.',
	},
	{
		id: '4',
		label: 'Delivered',
		description: 'Package was delivered successfully.',
	},
]

const itemsWithIcons: TimelineItem[] = [
	{ id: '1', label: 'Draft', icon: 'gravity-ui:pencil' },
	{ id: '2', label: 'Review', icon: 'gravity-ui:magnifier' },
	{ id: '3', label: 'Approved', icon: 'gravity-ui:check' },
	{ id: '4', label: 'Published', icon: 'gravity-ui:rocket' },
]

interface ActivityItem extends TimelineItem {
	username: string
	date: string
	action: string
}

const activityItems: ActivityItem[] = [
	{
		id: '1',
		label: '',
		username: 'J-Michalek',
		date: '2025-05-24T14:58:55Z',
		action: 'opened this',
		icon: 'gravity-ui:circle-plus',
	},
	{
		id: '2',
		label: '',
		username: 'J-Michalek',
		date: '2025-05-26T19:30:14Z',
		action: 'marked as ready for review',
		icon: 'gravity-ui:circle-check',
	},
	{
		id: '3',
		label: '',
		username: 'benjamincanac',
		date: '2025-05-27T11:01:20Z',
		action: 'commented on this',
		description: "I've made a few changes, let me know what you think! Updated the design, removed unnecessary divs.",
		icon: 'gravity-ui:comment',
	},
	{
		id: '4',
		label: '',
		username: 'J-Michalek',
		date: '2025-05-27T13:00:00Z',
		action: 'commented on this',
		description: 'Looks great! Good job on cleaning it up.',
		icon: 'gravity-ui:comment',
	},
	{
		id: '5',
		label: '',
		username: 'benjamincanac',
		date: '2025-05-28T09:15:00Z',
		action: 'merged this',
		icon: 'gravity-ui:branches-right',
	},
]

const lastSelected = ref<string | null>(null)
</script>

<template>
	<div class='page'>
		<NTitle>NTimeline Component Testing</NTitle>

		<NTitle order='3'>
			1. Vertical (default)
		</NTitle>
		<NTimeline v-model='active' :items />

		<NTitle order='3'>
			2. Vertical, align right
		</NTitle>
		<NTimeline v-model='active' :items align='right' />

		<NTitle order='3'>
			3. Vertical with icons
		</NTitle>
		<NTimeline v-model='active' :items='itemsWithIcons' />

		<NTitle order='3'>
			4. Horizontal
		</NTitle>
		<NTimeline v-model='active' :items orientation='horizontal' />

		<NTitle order='3'>
			5. Horizontal with icons
		</NTitle>
		<NTimeline v-model='active' :items='itemsWithIcons' orientation='horizontal' />

		<NTitle order='3'>
			6. Custom color &amp; line width
		</NTitle>
		<NTimeline
			v-model='active'
			:items
			color='grape'
			:line-width='2'
		/>

		<NTitle order='3'>
			7. Active step control
		</NTitle>
		<NTimeline v-model='active' :items color='teal' />
		<NNumberInput v-model='active' :min='-1' :max='items.length - 1' />

		<NTitle order='3'>
			8. @select event
		</NTitle>
		<NTimeline
			v-model='lastSelected'
			:items
			color='red'
			value-key='id'
			@select='item => lastSelected = item.id'
		/>
		<NText v-if='lastSelected'>
			Selected: <b>{{ lastSelected }}</b>
		</NText>

		<NTitle order='3'>
			9. Custom slots (activity feed)
		</NTitle>
		<NTimeline :items='activityItems'>
			<template #label='{ item }'>
				<NText fw='600' inherit>
					{{ item.username }}
				</NText>
				<NText c='dimmed'>
					&nbsp;{{ item.action }}
				</NText>
			</template>
			<template #content='{ item }'>
				<NText size='xs' c='dimmed'>
					{{ useTimeAgo(new Date(item.date)) }}
				</NText>
				<NCard v-if='item.description' with-border mt='xs' p='xs' radius='sm'>
					{{ item.description }}
				</NCard>
			</template>
		</NTimeline>
	</div>
</template>

<style scoped>
.page {
	display: grid;
	gap: var(--spacing-xs);

	h3 {
		margin-top: 1rem;
	}
}
</style>
