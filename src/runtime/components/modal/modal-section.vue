<script lang='ts' setup>
import type { DialogSectionProps } from '../dialog'

import DialogSection from '../dialog/ui/dialog-section.vue'


const props = defineProps<DialogSectionProps>()
</script>

<template>
	<DialogSection v-bind='props'>
		<slot />
	</DialogSection>
</template>
