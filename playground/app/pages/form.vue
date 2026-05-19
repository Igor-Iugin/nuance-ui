<script setup lang='ts'>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'


const schema = toTypedSchema(z.object({
	username: z.string().min(3, 'Минимум 3 символа'),
	email: z.email('Некорректный email'),
	password: z.string().min(6, 'Минимум 6 символов'),
	bio: z.string().max(200, 'Максимум 200 символов').optional(),
	age: z.number({ error: 'Укажите возраст' }).min(18, 'Минимум 18 лет').max(120, 'Максимум 120 лет'),
	role: z.string({ error: 'Выберите роль' }).nonempty('Выберите роль'),
	permissions: z.array(z.string()).min(1, 'Выберите хотя бы одно'),
	features: z.array(z.string()),
	date: z.string({ error: 'Выберите дату' }).nonempty('Выберите дату'),
	time: z.string({ error: 'Укажите время' }).nonempty('Укажите время'),
	appointment: z.string({ error: 'Выберите дату и время' }).nonempty('Выберите дату и время'),
	notifications: z.boolean(),
	agree: z.boolean().refine(v => v, 'Необходимо согласиться'),
}))

const { handleSubmit } = useForm({ validationSchema: schema })

const result = ref<Record<string, unknown> | null>(null)

const onSubmit = handleSubmit(values => {
	result.value = values
})
</script>

<template>
	<div :class='$style.root'>
		<h2>Form fields</h2>

		<form :class='$style.form' @submit.prevent='onSubmit'>
			<NTextField
				name='username'
				label='Username'
				placeholder='johndoe'
			/>

			<NEmailField
				name='email'
				label='Email'
				placeholder='john@example.com'
			/>

			<NPasswordField
				name='password'
				label='Password'
				placeholder='••••••'
			/>

			<NTextareaField
				name='bio'
				label='Bio'
				placeholder='Tell us about yourself...'
			/>

			<NNumberField
				name='age'
				label='Age'
				:min='18'
				:max='120'
				:initial-value='18'
			/>

			<NSelectField
				name='role'
				label='Role'
				:options='[
					{ value: "admin", label: "Admin" },
					{ value: "editor", label: "Editor" },
					{ value: "viewer", label: "Viewer" },
				]'
			/>

			<NDateField
				name='date'
				label='Date'
			/>

			<NTimeField
				name='time'
				label='Time'
			/>

			<NDateTimeField
				name='appointment'
				label='Appointment'
			/>

			<NCheckboxGroupField
				name='permissions'
				label='Права доступа'
			>
				<NCheckbox value='read' label='Чтение' />
				<NCheckbox value='write' label='Запись' />
				<NCheckbox value='delete' label='Удаление' />
			</NCheckboxGroupField>

			<NSwitchGroupField
				name='features'
				label='Функции'
			>
				<NSwitch value='notifications' label='Уведомления' />
				<NSwitch value='analytics' label='Аналитика' />
				<NSwitch value='beta' label='Бета-функции' />
			</NSwitchGroupField>

			<NSwitchField
				name='notifications'
				label='Уведомления'
			/>

			<NCheckboxField
				name='agree'
				label='Согласен с условиями'
			/>

			<NButton type='submit'>
				Submit
			</NButton>
		</form>

		<pre v-if='result' :class='$style.result'>{{ JSON.stringify(result, null, 2) }}</pre>
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
