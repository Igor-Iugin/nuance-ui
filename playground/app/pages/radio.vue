<script setup lang='ts'>
const framework = ref<string | null>('vue')
const plan = ref<string | null>('personal')
const locked = ref(false)
const disabled = ref(false)
const submitted = ref('')

function onSubmit(event: Event) {
	submitted.value = JSON.stringify(Object.fromEntries(new FormData(event.target as HTMLFormElement)))
}
</script>

<template>
	<div :class='$style.page'>
		<NTitle>Radio</NTitle>
		<form :class='$style.examples' @submit.prevent='onSubmit'>
			<NRadioGroup
				v-model='framework'
				name='framework'
				label='Framework'
				description='Choose one framework'
				required
			>
				<NGroup>
					<NRadio value='vue' label='Vue' description='The progressive framework' />
					<NRadio value='react' label='React' variant='outline' />
					<NRadio value='angular' label='Angular' disabled />
				</NGroup>
			</NRadioGroup>

			<NGroup>
				<NCheckbox v-model='locked' label='Read only' />
				<NCheckbox v-model='disabled' label='Disabled' />
			</NGroup>
			<NRadioGroup
				v-model='plan'
				name='plan'
				label='Plan'
				:read-only='locked'
				:disabled
				size='md'
			>
				<div :class='$style.cards'>
					<NRadioCard
						v-for='option in ["personal", "team", "enterprise"]'
						:key='option'
						:value='option'
					>
						<NGroup p='md'>
							<NRadioIndicator />
							<span>{{ option }}</span>
						</NGroup>
					</NRadioCard>
				</div>
			</NRadioGroup>
			<NGroup>
				<NRadioIndicator />
				<NRadioIndicator checked />
				<NRadioIndicator checked variant='outline' color='teal' />
				<NRadioIndicator checked disabled />
			</NGroup>
			<NRadioGroup label='Sizes'>
				<NGroup>
					<NRadio v-for='size in (["xs", "sm", "md", "lg", "xl"] as const)' :key='size' :size :value='size' :label='size' />
				</NGroup>
			</NRadioGroup>
			<NRadio error='Choose an available option' label='Error state' />
			<NRadio label-position='left' label='Label on the left' />
			<NButton type='submit'>
				Submit
			</NButton>
			<output>{{ submitted }}</output>
		</form>
	</div>
</template>

<style module>
.page,
.examples {
	display: grid;
	gap: var(--spacing-xl);
}

.cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
	gap: var(--spacing-sm);
}
</style>
