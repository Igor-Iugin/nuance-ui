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
		icon: 'gravity-ui:laptop',
	},
	{
		to: '/products/electronics/phones',
		label: 'Phones',
		icon: 'gravity-ui:smartphone',
	},
]
</script>

<template>
	<div class='test-page'>
		<h1>NBreadcrumbs Component Testing</h1>

		<!-- Секция 1: Базовый пример с ручными items -->
		<section class='test-section'>
			<h2>1. Manual Items (Basic)</h2>
			<NBreadcrumbs :items='manualItems' size='md' />
			<div class='code-example'>
				<code>:items="manualItems"</code>
			</div>
		</section>

		<!-- Секция 2: С иконками -->
		<section class='test-section'>
			<h2>2. Manual Items with Icons</h2>
			<NBreadcrumbs :items='itemsWithIcons' size='lg' />
			<div class='code-example'>
				<code>:items="itemsWithIcons" size="lg"</code>
			</div>
		</section>

		<!-- Секция 3: Кастомный разделитель -->
		<section class='test-section'>
			<h2>3. Custom Separator</h2>
			<NBreadcrumbs :items='manualItems' separator='gravity-ui:arrow-right' spacing='md' />
			<div class='code-example'>
				<code>separator="gravity-ui:arrow-right" spacing="md"</code>
			</div>
		</section>

		<!-- Секция 4: Разные размеры -->
		<section class='test-section'>
			<h2>4. Different Sizes</h2>
			<div class='size-examples'>
				<div>
					<p><strong>Small:</strong></p>
					<NBreadcrumbs :items='manualItems' size='sm' />
				</div>
				<div>
					<p><strong>Medium (default):</strong></p>
					<NBreadcrumbs :items='manualItems' size='md' />
				</div>
				<div>
					<p><strong>Large:</strong></p>
					<NBreadcrumbs :items='manualItems' size='lg' />
				</div>
			</div>
		</section>

		<!-- Секция 5: Разные spacing -->
		<section class='test-section'>
			<h2>5. Different Spacing</h2>
			<div class='spacing-examples'>
				<div>
					<p><strong>XS (default):</strong></p>
					<NBreadcrumbs :items='manualItems' spacing='xs' />
				</div>
				<div>
					<p><strong>SM:</strong></p>
					<NBreadcrumbs :items='manualItems' spacing='sm' />
				</div>
				<div>
					<p><strong>MD:</strong></p>
					<NBreadcrumbs :items='manualItems' spacing='md' />
				</div>
				<div>
					<p><strong>LG:</strong></p>
					<NBreadcrumbs :items='manualItems' spacing='lg' />
				</div>
			</div>
		</section>

		<!-- Секция 6: Custom slot -->
		<section class='test-section'>
			<h2>6. Custom Slot Example</h2>
			<NBreadcrumbs :items='manualItems'>
				<template #item='{ item, active }'>
					<span :style="{ fontWeight: active ? 'bold' : 'normal', color: active ? '#007bff' : 'inherit' }">
						{{ item.label.toUpperCase() }}
					</span>
				</template>
			</NBreadcrumbs>
		</section>
	</div>
</template>

<style scoped>
.test-page {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
	font-family: system-ui, -apple-system, sans-serif;
}

h1 {
	font-size: 2rem;
	margin-bottom: 2rem;
	color: #333;
}

.test-section {
	margin-bottom: 3rem;
	padding: 1.5rem;
	background: #f8f9fa;
	border-radius: 8px;
	border: 1px solid #dee2e6;
}

h2 {
	font-size: 1.5rem;
	margin-bottom: 1rem;
	color: #495057;
}

.description {
	margin-bottom: 1rem;
	color: #6c757d;
	font-size: 0.9rem;
}

.description code {
	background: #e9ecef;
	padding: 0.2rem 0.4rem;
	border-radius: 3px;
	font-size: 0.85rem;
}

.code-example {
	margin-top: 1rem;
	padding: 0.75rem;
	background: #e9ecef;
	border-radius: 4px;
	font-family: 'Courier New', monospace;
	font-size: 0.85rem;
}

.controls {
	margin-top: 1rem;
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

button {
	padding: 0.5rem 1rem;
	background: #007bff;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 0.9rem;
	transition: background 0.2s;
}

button:hover {
	background: #0056b3;
}

button:active {
	transform: translateY(1px);
}

.size-examples,
.spacing-examples {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.size-examples > div,
.spacing-examples > div {
	padding: 1rem;
	background: white;
	border-radius: 4px;
	border: 1px solid #dee2e6;
}

.size-examples p,
.spacing-examples p {
	margin-bottom: 0.5rem;
	color: #6c757d;
	font-size: 0.9rem;
}
</style>
