<script setup lang='ts'>
import { $notifications } from '@nui/notifications'


function basic() {
	$notifications.show({
		title: 'Saved',
		message: 'Changes stored.',
		color: 'green',
		autoClose: false,
		withProgress: true,
	})
}

function withActions() {
	const id = $notifications.show({
		title: 'File deleted',
		message: 'document.pdf was removed.',
		color: 'red',
		withCloseButton: true,
		actions: [{ label: 'Undo', onClick: () => $notifications.hide(id) }],
	})
}

function loadingToSuccess() {
	const id = $notifications.show({ title: 'Uploading…', loading: true })
	setTimeout(() => $notifications.update(id, {
		title: 'Uploaded',
		loading: false,
		color: 'green',
		autoClose: 3000,
	}), 1500)
}
</script>

<template>
	<NGroup>
		<NButton @click='basic()'>
			Basic
		</NButton>
		<NButton @click='withActions()'>
			With actions
		</NButton>
		<NButton @click='loadingToSuccess()'>
			Loading → success
		</NButton>
	</NGroup>
</template>
