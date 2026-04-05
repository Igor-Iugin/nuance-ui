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

const select = ref(['2', '1'])
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
				:options='[
					{ value: "1", label: "first" },
					{ value: "2", label: "second" },
					{ value: "3", label: "third" },
				]'
			/>
			<NSelect
				v-model='select'
				multiple
				label='Select input'
				searchable
				:options='[
					{ value: "1", label: "first" },
					{ value: "2", label: "second" },
					{ value: "3", label: "third" },
				]'
			/>
			<NSelect
				label='Select input'
				searchable
				:options='[
					{
						group: "Backend",
						items: [
							{ value: "express", label: "Express" },
							{ value: "django", label: "Django" },
						],
					},
					{
						group: "Frontend",
						items: [
							{ value: "react", label: "React" },
							{ value: "ng", label: "Angular" },
						],
					},

				]'
			/>
		</div>
		<div :class='$style.flex'>
			<NDatePicker v-model='time' label='Date picker' />
			<NTimePicker v-model='time' label='Time picker' with-seconds />
			<NDateTimePicker v-model='time' label='Datetime picker' with-seconds />
		</div>

		<div :class='$style.flex'>
			<NSwitchGroup>
				<NSwitch size='xs' value='1' label='test' on-label='ON' off-label='OFF' />
				<NSwitch size='sm' value='2' on-label='ON' off-label='OFF' />
				<NSwitch size='md' value='3' on-label='ON' off-label='OFF' />
				<NSwitch size='lg' value='4' on-label='ON' off-label='OFF' />
				<NSwitch size='xl' value='5' on-label='ON' off-label='OFF' />
			</NSwitchGroup>
			<NSwitch value='5' on-label='ON' off-label='OFF' />
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
