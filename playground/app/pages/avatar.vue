<script lang='ts' setup>
import type { NuanceSize } from '@nui/types'


const sizes: NuanceSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
	<NGroup align='center' gap='md'>
		<NAvatar
			v-for='size in sizes'
			:key='size'
			:size
			name='test test'
			color='initials'
		/>
	</NGroup>

	<NGroup v-for='size in sizes' :key='size' align='center' gap='md'>
		<NAvatarGroup>
			<NAvatar :size name='test test' color='initials' />
			<NAvatar :size name='test vest' color='initials' />
			<NAvatar :size name='test fest' color='initials' />
			<NAvatar :size name='test sest' color='initials' />
			<NAvatar :size>
				+5
			</NAvatar>
		</NAvatarGroup>
	</NGroup>

	<NGroup direction='column' align='flex-start' gap='lg' mt='lg'>
		<NStack gap='2xs'>
			<NProfile
				v-for='size in sizes'
				:key='size'
				title='John Doe'
				description='john.doe@example.com'
				indicator
				:size
			/>
		</NStack>

		<NProfile title='Jane Doe' description='Online' indicator />

		<NProfile
			title='Jane Doe'
			description='Away'
			:indicator='{ color: "orange" }'
		/>

		<NProfile title='John Doe' description='john.doe@example.com'>
			<template #actions>
				<NButton size='xs'>
					Edit
				</NButton>
			</template>
		</NProfile>

		<NProfile
			title='John Doe'
			description='john.doe@example.com'
			orientation='vertical'
			indicator
		>
			<template #actions>
				<NButton size='xs'>
					Edit
				</NButton>
			</template>
		</NProfile>

		<NProfile title='John Doe' description='Go to profile' to='/alert' />
	</NGroup>
</template>
