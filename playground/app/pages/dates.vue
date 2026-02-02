<script setup lang='ts'>
const date = ref(new Date())
</script>

<template>
	<NCalendar v-model:date='date' mode='range' :number-of-months='3' />
</template>
