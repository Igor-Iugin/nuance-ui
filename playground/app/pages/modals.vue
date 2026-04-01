<script setup lang='ts'>
import type { ConfirmModalProps } from '@nui/modals'

import { openConfirmModal } from '@nui/modals'

import { openHistoryBox } from '../ui/test-modal'


const result = ref<boolean | null>(null)

async function handleConfirm() {
	try {
		result.value = await openConfirmModal({
			title: 'Подтвердите действие',
			description: 'Вы уверены, что хотите продолжить?',
		})
	}
	catch {
		result.value = false
	}
}

async function handleDelete() {
	try {
		result.value = await openConfirmModal({
			title: 'Удалить запись?',
			description: 'Это действие нельзя отменить.',
			variant: 'danger',
			labels: { confirm: 'Удалить', cancel: 'Отмена' },
		})
	}
	catch {
		result.value = false
	}
}

const parallelLog = ref<string[]>([])

const stepLog = ref<string[]>([])

const wizardSteps: ConfirmModalProps[] = [
	{
		title: 'Шаг 1 из 3',
		description: 'Начинаем процесс миграции данных. Продолжить?',
		labels: { confirm: 'Далее', cancel: 'Отмена' },
	},
	{
		title: 'Шаг 2 из 3',
		description: 'Будет создана резервная копия. Это может занять несколько минут.',
		labels: { confirm: 'Создать бэкап', cancel: 'Назад' },
	},
	{
		title: 'Шаг 3 из 3',
		description: 'Удалить старые данные после миграции? Это действие необратимо.',
		variant: 'danger',
		labels: { confirm: 'Удалить и завершить', cancel: 'Назад' },
	},
]

async function handleWizard() {
	stepLog.value = []
	let current = 0

	while (current >= 0 && current < wizardSteps.length) {
		let confirmed: boolean
		try {
			confirmed = await openConfirmModal(wizardSteps[current]!)
		}
		catch {
			confirmed = false
		}

		if (confirmed) {
			stepLog.value.push(`Шаг ${current + 1}: подтверждён`)
			current++
		}
		else {
			if (current === 0) {
				stepLog.value.push('Отменено')
				return
			}
			stepLog.value.push(`Шаг ${current + 1}: назад`)
			current--
		}
	}

	stepLog.value.push('Wizard завершён')
}
</script>

<template>
	<div :style='{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", maxWidth: "400px" }'>
		<NActionIcon
			@click='openHistoryBox()'
		/>

		<NButton @click='handleConfirm'>
			Confirm (default)
		</NButton>

		<NButton color='red' @click='handleDelete'>
			Confirm (danger)
		</NButton>

		<p v-if='result !== null'>
			Результат: <strong>{{ result }}</strong>
		</p>


		<NButton variant='light' @click='handleWizard'>
			Пошаговый wizard (3 шага)
		</NButton>

		<ul v-if='stepLog.length'>
			<li v-for='(entry, i) in stepLog' :key='i'>
				{{ entry }}
			</li>
		</ul>

		<ul v-if='parallelLog.length'>
			<li v-for='(entry, i) in parallelLog' :key='i'>
				{{ entry }}
			</li>
		</ul>
	</div>
</template>
