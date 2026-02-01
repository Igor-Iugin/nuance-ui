<script setup lang='ts'>
import { addDay } from '@formkit/tempo'


const date = ref(new Date())
const maxDate = addDay(date.value, 41)
const minDate = addDay(date.value, -41)
</script>

<template>
	<NCalendar
		v-model:date='date'
		:number-of-months='3'
		:max-date
		:min-date
	/>
</template>
