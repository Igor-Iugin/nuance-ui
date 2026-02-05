<template>
	<section :class='$style.root'>
		<div :class='$style.flex'>
			<NEmailInput label='Email input' />
			<NNumberInput label='Number input' />
			<NPasswordInput label='Password input' />
			<NTextInput label='Text input' />
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
			<NDatePicker label='Date picker' mode='range' />
			<NTimePicker label='Time picker' />
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
