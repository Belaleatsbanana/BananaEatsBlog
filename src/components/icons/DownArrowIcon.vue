<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :fill="fillColor" viewBox="0 -960 960 960">
        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
</template>

<script setup lang="ts">

defineProps({
    width: {
        type: String,
        default: '30px'
    },
    height: {
        type: String,
        default: '30px'
    },
    fillColor: {
        type: String,
        default: '#000000'
    }
});
</script>

<style scoped></style>