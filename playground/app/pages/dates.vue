<script setup lang='ts'>
const date = ref(new Date())
</script>

<template>
	<NCalendar v-model:date='date' />
</template>
