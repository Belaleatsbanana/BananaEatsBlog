<template>
    <div>
        <button @click="handleClick">{{ liked ? 'Liked' : 'Like' }}</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useCloned } from '@vueuse/core'

const liked = ref(false);
const tempLiked = useCloned(liked) // Temporary state to track changes

const likeApiCall = () => {
    console.log('API call executed: User liked the post.');
};

const debouncedLike = useDebounceFn(() => {

    
    if (tempLiked.cloned.value !== liked.value) {
        likeApiCall();
        liked.value = tempLiked.cloned.value;
    } else {
        console.log('API call cancelled: State unchanged.');
    }

}, 2000);

const handleClick = () => {
    tempLiked.cloned.value = !tempLiked.cloned.value;
    debouncedLike();
};
</script>
