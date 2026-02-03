<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'

import { format } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { ref, watch } from 'vue'

import type { TextInputProps } from './text-input.vue'

import Calendar from '../calendar/calendar.vue'
import PopoverDropdown from '../popover/popover-dropdown.vue'
import PopoverTarget from '../popover/popover-target.vue'
import Popover from '../popover/popover.vue'
import TextInput from './text-input.vue'


export interface DateInputProps extends TextInputProps {

}

const props = defineProps<DateInputProps>()

const config = useDatesConfig()

const select = ref<DateInput>()
const value = defineModel<string>({ default: '' })

watch(select, date => {
	if (!date)
		value.value = ''
	else
		value.value = format({ date, format: 'short', ...config })
})

const opened = ref(false)
</script>

<template>
	<Popover v-model:open='opened'>
		<PopoverTarget>
			<TextInput
				v-bind='props'
				v-model='value'
				type='text'
				@click='opened = true'
			>
				<template v-if='!!$slots.leftSection' #leftSection>
					<slot name='leftSection' />
				</template>
				<template v-if='!!$slots.rightSection' #rightSection>
					<slot name='rightSection' />
				</template>

				<template v-if='!!$slots.label' #label>
					<slot name='label' />
				</template>
				<template v-if='!!$slots.error' #error>
					<slot name='error' />
				</template>
				<template v-if='!!$slots.description' #description>
					<slot name='description' />
				</template>
			</TextInput>
		</PopoverTarget>
		<PopoverDropdown>
			<Calendar v-model:value='select' />
		</PopoverDropdown>
	</Popover>
</template>
