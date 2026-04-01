<script lang="ts" setup>
import type { ModalManager } from './modal-manager'

import { $modals } from './modal-manager'


defineProps<{
	manager?: ModalManager
}>()

defineExpose({
	manager: $modals,
})
</script>

<template>
	<ClientOnly>
		<div id='nui-modals-root'>
			<component
				:is='entry.component'
				v-for='[id, entry] in ($props.manager?.modals ?? $modals.modals)'
				:key='id'
				v-bind='entry.props'
			/>
		</div>
	</ClientOnly>
</template>
