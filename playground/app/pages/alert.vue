<script setup lang='ts'>
</script>

<template>
	<NStack gap='2xl' p='lg'>
		<!-- ─── Variants ─── -->
		<NStack gap='sm'>
			<NAlert title='Filled' icon='gravity-ui:triangle-exclamation' color='blue' variant='filled'>
				Something went wrong
			</NAlert>
			<NAlert title='Light' icon='gravity-ui:triangle-exclamation' color='blue' variant='light'>
				Something went wrong
			</NAlert>
			<NAlert title='Outline' icon='gravity-ui:triangle-exclamation' color='blue' variant='outline'>
				Something went wrong
			</NAlert>
			<NAlert title='Light-outline' icon='gravity-ui:triangle-exclamation' color='blue' variant='light-outline'>
				Something went wrong
			</NAlert>
			<NAlert title='Default' icon='gravity-ui:triangle-exclamation' color='blue' variant='default'>
				Something went wrong
			</NAlert>
		</NStack>

		<!-- ─── Sizes ─── -->
		<NStack gap='sm'>
			<NAlert title='XS size' icon='gravity-ui:circle-info' color='orange' size='xs'>
				Extra small alert
			</NAlert>
			<NAlert title='SM size' icon='gravity-ui:circle-info' color='orange' size='sm'>
				Small alert
			</NAlert>
			<NAlert title='MD size' icon='gravity-ui:circle-info' color='orange' size='md'>
				Medium alert (default)
			</NAlert>
			<NAlert title='LG size' icon='gravity-ui:circle-info' color='orange' size='lg'>
				Large alert
			</NAlert>
			<NAlert title='XL size' icon='gravity-ui:circle-info' color='orange' size='xl'>
				Extra large alert
			</NAlert>
		</NStack>

		<!-- ─── Colors ─── -->
		<NStack gap='sm'>
			<NAlert
				v-for='color in ["red", "orange", "yellow", "green", "teal", "blue", "violet", "grape"]'
				:key='color'
				:title='color'
				icon='gravity-ui:circle-info'
				:color='color'
				variant='light'
			>
				Light variant with {{ color }} color
			</NAlert>
		</NStack>

		<!-- ─── With close button ─── -->
		<NAlert title='Dismissible' icon='gravity-ui:circle-info' color='green' variant='light-outline' with-close-button>
			This alert can be closed
		</NAlert>

		<!-- ─── No icon / no title ─── -->
		<NAlert color='red' variant='light'>
			Alert without icon or title
		</NAlert>
	</NStack>
</template>
