<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :fill="fillColor" viewBox="0 -960 960 960">
        <path
            d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
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