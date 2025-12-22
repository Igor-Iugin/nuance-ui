<script setup lang='ts'>
import { createColumnHelper } from '@tanstack/vue-table'


interface Payment {
	id: string
	date: string
	email: string
	amount: number
	children?: Payment[]
}

const data = ref<Payment[]>([
	{
		id: '4600',
		date: '2024-03-11T15:30:00',
		email: 'james.anderson@example.com',
		amount: 594,
		children: [
			{
				id: '4599',
				date: '2024-03-11T10:10:00',
				email: 'mia.white@example.com',
				amount: 276,
			},
			{
				id: '4598',
				date: '2024-03-11T08:50:00',
				email: 'william.brown@example.com',
				amount: 315,
			},
			{
				id: '4597',
				date: '2024-03-10T19:45:00',
				email: 'emma.davis@example.com',
				amount: 529,
				children: [
					{
						id: '4592',
						date: '2024-03-09T18:45:00',
						email: 'benjamin.jackson@example.com',
						amount: 851,
					},
					{
						id: '4591',
						date: '2024-03-09T16:05:00',
						email: 'sophia.miller@example.com',
						amount: 762,
					},
					{
						id: '4590',
						date: '2024-03-09T14:20:00',
						email: 'noah.clark@example.com',
						amount: 573,
						children: [
							{
								id: '4596',
								date: '2024-03-10T15:55:00',
								email: 'ethan.harris@example.com',
								amount: 639,
							},
							{
								id: '4595',
								date: '2024-03-10T13:40:00',
								email: 'ava.thomas@example.com',
								amount: 428,
							},
						],
					},
				],
			},
		],
	},
	{
		id: '4589',
		date: '2024-03-09T11:35:00',
		email: 'isabella.lee@example.com',
		amount: 389,
	},
])


const helper = createColumnHelper<Payment>()

const Checkbox = resolveComponent('NCheckbox')
const Text = resolveComponent('NText')
const Icon = resolveComponent('Icon')

const columns = [
	helper.display({
		id: 'select',
		header: ({ table }) => h(Checkbox, {
			'modelValue': table.getIsSomePageRowsSelected()
				? 'indeterminate'
				: table.getIsAllPageRowsSelected(),
			'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
				table.toggleAllPageRowsSelected(!!value),
			'aria-label': 'Select all',
		}),
		cell: ({ row }) => h(Checkbox, {
			'modelValue': row.getIsSelected(),
			'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
			'aria-label': 'Select row',
		}),
		size: 40,
	}),
	helper.display({
		id: 'icon',
		cell: () => h(Icon, { name: 'gravity-ui:folder', size: 20 }),
		size: 40,
	}),
	helper.accessor('date', {
		header: 'Дата',
		cell: ({ getValue }) => h(Text, getValue()),
	}),
	helper.accessor('amount', {
		header: 'Количество',
		cell: ({ getValue }) => h(Text, getValue()),
		size: 80,
	}),
]
</script>

<template>
	<NTable :data :columns vertical-align='middle' />
</template>

<style lang="css" module>
	.cell {
		text-align: center;
	}
</style>

