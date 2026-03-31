<script lang="ts" setup>
import { $modals } from '@nui/composals'
</script>

<template>
	<div id='nui-modals-root'>
		<component
			:is='entry.component'
			v-for='[id, entry] in $modals.modals'
			:key='id'
			v-bind='entry.props'
		/>
	</div>
</template>
