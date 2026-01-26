<script setup lang="ts">
import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'


export interface CalendarGridHeadCellProps extends BoxProps {}

const { is = 'th', ...props } = defineProps<CalendarGridHeadCellProps>()
</script>

<template>
	<Box :is v-bind='props' :class='$style.weekday'>
		<slot />
	</Box>
</template>

<style lang="postcss" module>
.weekday {
  color: var(--color-dimmed);
  font-weight: normal;
  font-size: var(--wr-fz, var(--font-size-sm));
  text-transform: capitalize;
  padding-bottom: calc(var(--wr-spacing, var(--spacing-sm)) / 2);
}
</style>
