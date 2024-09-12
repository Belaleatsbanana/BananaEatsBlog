<script setup lang="ts">
import { ref, watch } from 'vue';
import type { MetaLink } from '@/types';

const props = defineProps<{
    meta_links: MetaLink[];
}>();

const emit = defineEmits(['pageChange']);

const paginationLinks = ref<MetaLink[]>(props.meta_links);


const setPage = (pageUrl: string | null) => {
    if (pageUrl) {
        emit('pageChange', pageUrl);
    }

};

watch(() => props.meta_links, (newMetaLinks) => {
    paginationLinks.value = newMetaLinks;

}, { immediate: true });
</script>

<template>

    <nav class="pagination">

        <button v-for="link in paginationLinks" :key="link.label"
            :class="['pagination-button', { active: link.active }]" :disabled="!link.url" @click="setPage(link.url)">
            <span v-html="link.label"></span>
        </button>

    </nav>

</template>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    margin: 1rem 0;
}

.pagination-button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
    font-size: 0.875rem;
}

.pagination-button.active {
    background-color: #333;
    color: #fff;
    border-color: #333;
}

.pagination-button:disabled {
    background-color: #f0f0f0;
    color: #ccc;
    cursor: not-allowed;
    border-color: #f0f0f0;
}

.pagination-button:not(:disabled):hover {
    background-color: #ddd;
}
</style>
