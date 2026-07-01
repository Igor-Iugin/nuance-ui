<script setup lang='ts'>
import { $notifications } from '@nui/notifications'


function basic() {
	$notifications.show({ title: 'Saved', message: 'Changes stored.', color: 'green' })
}

function withActions() {
	$notifications.show({
		title: 'File deleted',
		message: 'document.pdf was removed.',
		color: 'red',
		autoClose: false,
		actions: [{ label: 'Undo', onClick: () => $notifications.clean() }],
	})
}

function loadingToSuccess() {
	const id = $notifications.show({ title: 'Uploading…', loading: true, autoClose: false })
	setTimeout(() => $notifications.update(id, {
		title: 'Uploaded',
		loading: false,
		color: 'green',
		autoClose: 3000,
	}), 1500)
}
</script>

<template>
	<div style='display: flex; gap: 12px; padding: 24px;'>
		<NButton @click='basic()'>
			Basic
		</NButton>
		<NButton @click='withActions()'>
			With actions
		</NButton>
		<NButton @click='loadingToSuccess()'>
			Loading → success
		</NButton>
	</div>
</template>
