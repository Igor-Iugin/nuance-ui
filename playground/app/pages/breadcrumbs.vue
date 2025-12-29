<script setup lang='ts'>
import type { BreadcrumbsItem } from '@nui/components'


// Manual items для первого примера
const manualItems: BreadcrumbsItem[] = [
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

// Manual items с иконками
const itemsWithIcons: BreadcrumbsItem[] = [
	{
		to: '/',
		label: 'Home',
		icon: 'gravity-ui:house',
	},
	{
		to: '/products',
		label: 'Products',
		icon: 'gravity-ui:shopping-cart',
	},
	{
		to: '/products/electronics',
		label: 'Electronics',
		icon: 'gravity-ui:tv',
	},
	{
		to: '/products/electronics/phones',
		label: 'Phones',
		icon: 'gravity-ui:smartphone',
	},
]
</script>

<template>
	<div class='page'>
		<NTitle>NBreadcrumbs Component Testing</NTitle>

		<!-- Секция 1: Базовый пример с ручными items -->
		<NTitle order='3'>
			1. Manual Items (Basic)
		</NTitle>
		<NBreadcrumbs :items='manualItems' />

		<!-- Секция 2: С иконками -->
		<NTitle order='3'>
			2. Manual Items with Icons
		</NTitle>
		<NBreadcrumbs :items='itemsWithIcons' size='lg' />

		<!-- Секция 3: Кастомный разделитель -->
		<NTitle order='3'>
			3. Custom Separator
		</NTitle>
		<NBreadcrumbs :items='manualItems' separator='gravity-ui:arrow-right' spacing='md' />

		<!-- Секция 4: Разные размеры -->
		<NTitle order='3'>
			4. Different Sizes
		</NTitle>
		<div class='spacing'>
			<NCard with-border>
				<NText fw='600'>
					Small:
				</NText>
				<NBreadcrumbs :items='manualItems' size='sm' />
			</NCard>
			<NCard with-border>
				<NText fw='600'>
					Medium (default):
				</NText>
				<NBreadcrumbs :items='manualItems' size='md' />
			</NCard>
			<NCard with-border>
				<NText fw='600'>
					Large:
				</NText>
				<NBreadcrumbs :items='manualItems' size='lg' />
			</NCard>
		</div>

		<!-- Секция 5: Разные spacing -->
		<NTitle order='3'>
			5. Different Spacing
		</NTitle>
		<div class='spacing'>
			<NCard with-border>
				<NText fw='600'>
					XS (default):
				</NText>
				<NBreadcrumbs :items='manualItems' spacing='xs' />
			</NCard>
			<NCard with-border>
				<NText fw='600'>
					SM:
				</NText>
				<NBreadcrumbs :items='manualItems' spacing='sm' />
			</NCard>
			<NCard with-border>
				<NText fw='600'>
					MD:
				</NText>
				<NBreadcrumbs :items='manualItems' spacing='md' />
			</NCard>
			<NCard with-border>
				<NText fw='600'>
					LG:
				</NText>
				<NBreadcrumbs :items='manualItems' spacing='lg' />
			</NCard>
		</div>
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

.spacing {
	display: grid;
	gap: var(--spacing-sm);
}
</style>
