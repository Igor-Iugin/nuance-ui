<script setup lang="ts">
import { splitTimeString } from '@nui/components'


const date = ref(new Date().toISOString())
const time = computed({
	get: () => date.value,
	set: (newTime: string) => {
		const data = new Date()
		const { hours, minutes, seconds } = splitTimeString(newTime)

		hours && data.setHours(hours)
		minutes && data.setMinutes(minutes)
		seconds && data.setSeconds(seconds)

		date.value = data.toISOString()
	},
})
</script>

<template>
	<section :class='$style.root'>
		<div :class='$style.flex'>
			<NEmailInput label='Email input' />
			<NNumberInput label='Number input' />
			<NPasswordInput label='Password input' />
			<NTextInput label='Text input' autocomplete='off' />
		</div>

		<NTextarea label='Textarea' multiline />

		<div :class='$style.flex'>
			<NSelect
				label='Select input'
				:data='[
					{ value: "1", label: "first" },
					{ value: "2", label: "second" },
					{ value: "3", label: "third" },
				]'
			/>
			<NSelect
				label='Select input'
				searchable
				:data='[
					{ value: "1", label: "first" },
					{ value: "2", label: "second" },
					{ value: "3", label: "third" },
				]'
			/>
		</div>
		<div :class='$style.flex'>
			<NDatePicker v-model='time' label='Date picker' />
			<NTimePicker v-model='time' label='Time picker' with-seconds />
			<NDateTimePicker v-model='time' label='Datetime picker' with-seconds />
		</div>
	</section>
</template>

<style lang="postcss" module>
.root {
	display: grid;
	gap: 1.5rem;
}

.flex {
	display: flex;
	gap: .5rem;
}
</style>
