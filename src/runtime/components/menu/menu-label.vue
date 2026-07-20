<script lang="ts" setup>
import css from './menu.module.css'
import { useMenuState } from './menu.vue'


const ctx = useMenuState()
</script>

<template>
	<div :class='[css.label, ctx.classes.value?.label]'>
		<slot />
	</div>
</template>
