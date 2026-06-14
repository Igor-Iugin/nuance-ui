<script setup lang='ts'>
</script>

<template>
	<div class='demo-container'>
		<section>
			<h2>Variant: filled</h2>
			<NGroup gap='sm'>
				<NBadge variant='filled'>
					Default
				</NBadge>
				<NBadge variant='filled' color='green'>
					Green
				</NBadge>
				<NBadge variant='filled' color='red'>
					Red
				</NBadge>
				<NBadge variant='filled' color='blue'>
					Blue
				</NBadge>
				<NBadge variant='filled' dotted>
					With dot
				</NBadge>
				<NBadge variant='filled' color='green' dotted>
					Green dot
				</NBadge>
			</NGroup>
		</section>

		<section>
			<h2>Variant: light</h2>
			<NGroup gap='sm'>
				<NBadge variant='light'>
					Default
				</NBadge>
				<NBadge variant='light' color='green'>
					Green
				</NBadge>
				<NBadge variant='light' color='red'>
					Red
				</NBadge>
				<NBadge variant='light' color='blue'>
					Blue
				</NBadge>
				<NBadge variant='light' dotted>
					With dot
				</NBadge>
				<NBadge variant='light' color='green' dotted>
					Green dot
				</NBadge>
			</NGroup>
		</section>

		<section>
			<h2>Variant: outline</h2>
			<NGroup gap='sm'>
				<NBadge variant='outline'>
					Default
				</NBadge>
				<NBadge variant='outline' color='green'>
					Green
				</NBadge>
				<NBadge variant='outline' color='red'>
					Red
				</NBadge>
				<NBadge variant='outline' color='blue'>
					Blue
				</NBadge>
				<NBadge variant='outline' dotted>
					With dot
				</NBadge>
				<NBadge variant='outline' color='green' dotted>
					Green dot
				</NBadge>
			</NGroup>
		</section>

		<section>
			<h2>Variant: default</h2>
			<NGroup gap='sm'>
				<NBadge variant='default'>
					Default
				</NBadge>
				<NBadge variant='default' color='green'>
					Green
				</NBadge>
				<NBadge variant='default' color='red'>
					Red
				</NBadge>
				<NBadge variant='default' color='blue'>
					Blue
				</NBadge>
				<NBadge variant='default' dotted>
					With dot
				</NBadge>
				<NBadge variant='default' color='green' dotted>
					Green dot
				</NBadge>
			</NGroup>
		</section>

		<section>
			<h2>Variant: subtle</h2>
			<NGroup gap='sm'>
				<NBadge variant='subtle'>
					Default
				</NBadge>
				<NBadge variant='subtle' color='green'>
					Green
				</NBadge>
				<NBadge variant='subtle' color='red'>
					Red
				</NBadge>
				<NBadge variant='subtle' color='blue'>
					Blue
				</NBadge>
				<NBadge variant='subtle' dotted>
					With dot
				</NBadge>
				<NBadge variant='subtle' color='green' dotted>
					Green dot
				</NBadge>
			</NGroup>
		</section>

		<section>
			<h2>Variant: gradient</h2>
			<NGroup gap='sm'>
				<NBadge variant='gradient'>
					Default
				</NBadge>
				<NBadge variant='gradient' color='green'>
					Green
				</NBadge>
				<NBadge variant='gradient' color='red'>
					Red
				</NBadge>
				<NBadge variant='gradient' dotted>
					With dot
				</NBadge>
			</NGroup>
		</section>

		<section>
			<h2>Sizes</h2>
			<NGroup gap='sm'>
				<NBadge size='xs'>
					XS
				</NBadge>
				<NBadge size='sm'>
					SM
				</NBadge>
				<NBadge size='md'>
					MD
				</NBadge>
				<NBadge size='lg'>
					LG
				</NBadge>
				<NBadge size='xl'>
					XL
				</NBadge>
			</NGroup>
		</section>

		<section>
			<h2>Circle badges</h2>
			<NGroup gap='sm'>
				<NBadge circle>
					5
				</NBadge>
				<NBadge circle color='green'>
					3
				</NBadge>
				<NBadge circle color='red'>
					!
				</NBadge>
				<NBadge circle size='lg'>
					99
				</NBadge>
			</NGroup>
		</section>

		<section>
			<h2>With icon</h2>
			<NGroup gap='sm'>
				<NBadge icon='i-heroicons-check-circle'>
					Success
				</NBadge>
				<NBadge variant='light' color='green' icon='i-heroicons-check-circle'>
					Approved
				</NBadge>
				<NBadge variant='outline' color='red' icon='i-heroicons-x-circle'>
					Error
				</NBadge>
			</NGroup>
		</section>

		<section>
			<h2>Full width</h2>
			<NStack gap='xs'>
				<NBadge full-width>
					Full Width Badge
				</NBadge>
				<NBadge full-width variant='light' color='green'>
					Full Width Green
				</NBadge>
			</NStack>
		</section>
	</div>
</template>

<style scoped>
section {
	margin-bottom: 2rem;
}

h2 {
	margin-bottom: 1rem;

	font-size: 1.25rem;
	font-weight: 600;
	color: var(--color-text-base);
}

.demo-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}
</style>
