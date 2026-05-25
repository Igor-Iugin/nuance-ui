<script lang='ts' setup>
import type { DialogSectionProps } from '../dialog'

import DialogSection from '../dialog/ui/dialog-section.vue'


export interface DrawerSectionProps extends DialogSectionProps {
}

const props = defineProps<DrawerSectionProps>()
</script>

<template>
	<DialogSection v-bind='props'>
		<slot />
	</DialogSection>
</template>
