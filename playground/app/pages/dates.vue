<script setup lang='ts'>
const date = ref(new Date())
</script>

<template>
	<NCalendar
		v-model:date='date'
		min-level='year'
		:number-of-months='3'
	/>
</template>
