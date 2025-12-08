<script setup lang='ts'>
const value = ref(40)
</script>

<template>
	<NProgress v-model='value' color='green' animated />
	<NNumberInput v-model='value' :min='0' :max='100' />
</template>
