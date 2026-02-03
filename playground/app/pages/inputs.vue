<template>
	<NEmailInput label='Email input' />
	<NNumberInput label='Number input' />
	<NPasswordInput label='Password input' />
	<NTextInput label='Text input' />
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
</template>

<style lang="postcss" module>
.flex {
	display: flex;
	gap: .5rem;
}
</style>
