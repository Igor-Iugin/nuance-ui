<script lang="ts" setup>
import type { DividerProps } from '../divider.vue'

import Divider from '../divider.vue'
import css from './menu.module.css'
import { useMenuState } from './menu.vue'


export interface MenuDividerProps extends DividerProps {}


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
