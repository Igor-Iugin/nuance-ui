<script lang="ts" setup>
import { useNuxtApp } from '#app'
import { ClientOnly } from '#components'
import { computed } from 'vue'


const modals = computed(() => useNuxtApp().$modals?.modals ?? [])
</script>

<template>
	<ClientOnly>
		<div id='nui-modals-root'>
			<component
				:is='entry.component'
				v-for='[id, entry] in modals'
				:key='id'
				v-bind='entry.props'
			/>
		</div>
	</ClientOnly>
</template>
