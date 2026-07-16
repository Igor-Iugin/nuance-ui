<script lang="ts" setup>
import { $modals } from './modal-manager'
</script>

<template>
	<div id='nui-modals-root'>
		<component
			:is='entry.component'
			v-for='[id, entry] in $modals.modals'
			:key='id'
			v-bind='entry.props'
			@close='$modals.unmount(id)'
		/>
	</div>
</template>
