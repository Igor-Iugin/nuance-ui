<script setup lang='ts'>
import type { BreadcrumbsItem } from '@nui/components'


const items: BreadcrumbsItem[] = [
	{
		to: '/tree',
		label: 'Tree',
	},
	{
		to: '/avatar',
		label: 'Avatar',
	},
	{
		to: '/alert',
		label: 'Alert',
	},
	{
		to: '/breadcrumbs',
		label: 'Breadcrumbs',
		icon: 'gravity-ui:list-check',
	},
]
</script>

<template>
	<NBreadcrumbs :items size='md' />
</template>
