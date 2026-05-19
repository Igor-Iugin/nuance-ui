<script setup lang='ts'>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'


const schema = toTypedSchema(z.object({
	username: z.string().min(3, 'Минимум 3 символа'),
	email: z.email('Некорректный email'),
	password: z.string().min(6, 'Минимум 6 символов'),
}))

const { handleSubmit } = useForm({ validationSchema: schema })

const result = ref<Record<string, string> | null>(null)

const onSubmit = handleSubmit(values => {
	result.value = values
})
</script>

<template>
	<div :class='$style.root'>
		<h2>Form (vee-validate)</h2>

		<form :class='$style.form' @submit.prevent='onSubmit'>
			<NTextField name='username' label='Username' placeholder='johndoe' />
			<NTextField name='email' label='Email' placeholder='john@example.com' />
			<NTextField name='password' label='Password' placeholder='••••••' />

			<NButton type='submit'>
				Submit
			</NButton>
		</form>

		<pre v-if='result' :class='$style.result'>
			{{ JSON.stringify(result, null, 2) }}
		</pre>
	</div>
</template>

<style module>
.root {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-md);

	padding: var(--spacing-md);
}

.form {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);

	max-width: rem(360px);
}

.result {
	padding: var(--spacing-sm);
	border-radius: var(--radius-sm);

	font-size: var(--font-size-sm);

	background: var(--color-default-hover);
}
</style>
