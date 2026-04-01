<script lang="ts" setup>
import { $modals } from '../../plugins/modals'
</script>

<template>
	<ClientOnly>
		<div id='nui-modals-root'>
			<component
				:is='entry.component'
				v-for='[id, entry] in $modals.modals'
				:key='id'
				v-bind='entry.props'
			/>
		</div>
	</ClientOnly>
</template>
