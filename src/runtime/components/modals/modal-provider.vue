<script lang="ts" setup>
import { $modals } from '@nui/composals'


const activeModals = $modals.modals
</script>

<template>
	<div id='nui-modals-root'>
		<component
			:is='entry.component'
			v-for='[id, entry] in activeModals'
			:key='id'
			v-bind='entry.props'
		/>
	</div>
</template>
