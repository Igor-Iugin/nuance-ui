<script lang="ts" setup>
import PopoverTarget from '../../popover/popover-target.vue'
import { useSubMenuState } from './menu-sub.vue'


const sub = useSubMenuState()
</script>

<template>
	<PopoverTarget
		:id='`${sub?.id}-target`'
		manual
		aria-haspopup='menu'
		:aria-expanded='sub?.opened.value'
		:mod='{ expanded: sub?.opened.value }'
		@mouseenter='sub?.open()'
		@mouseleave='sub?.close()'
	>
		<slot />
	</PopoverTarget>
</template>
