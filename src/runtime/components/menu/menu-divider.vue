<script lang="ts">
import type { DividerProps } from '../divider.vue'


export interface MenuDividerProps extends DividerProps {}
</script>

<script lang="ts" setup>
import Divider from '../divider.vue'
import css from './menu.module.css'
import { useMenuState } from './menu.vue'


defineProps<MenuDividerProps>()

const ctx = useMenuState()
</script>

<template>
	<Divider
		v-bind='$props'
		orientation='horizontal'
		:class='[css.divider, ctx.classes.value?.divider]'
	/>
</template>
