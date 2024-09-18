<script setup lang="ts">

import type { ExtendedComment, MyCommentsResponse } from '@/types';
import { ref, onMounted, inject } from 'vue';
import CommentPreview from '@/components/blog/CommentPreview.vue';
import { getMyComments } from '@/api/commentApi';
import PaginationBar from '@/components/ui/PaginationBar.vue';

// Inject the `triggerSnackbar` function from the App.vue
const triggerSnackbar = inject('triggerSnackbar') as (message: string, success?: boolean) => void;


const myCommentsResponse = ref<MyCommentsResponse>();
const myComments = ref<ExtendedComment[]>();

const currentPage = ref<string>("1");
const selectedSort = ref<'desc' | 'asc'>('desc');

onMounted(() => {
    fetchMyComments();

});

const fetchMyComments = async () => {
    getMyComments(currentPage.value, selectedSort.value).then((result) => {
        
        myCommentsResponse.value = result;
        myComments.value = result.data;
        console.log('My Comments:', myComments.value);
        
    }).catch((err) => {
        
        triggerSnackbar('Error fetching my comments', false);
        console.error('Error fetching my comments:', err);
    });
};

const onSortChange = () => {

    fetchMyComments();
};

const setPageChange = (pageUrl: string) => {

    currentPage.value = pageUrl[pageUrl.length - 1];

    fetchMyComments();
};
</script>

<template>
    <main class="comments-container">
        <div class="home-header">
            <h1>My Comments</h1>

            <select name="sort" id="sort" v-model="selectedSort" @change="onSortChange">
                <option value="desc">Newest</option>
                <option value="asc">Oldest</option>
            </select>
        </div>
        <div v-if="myComments" class="comments-list">
            <CommentPreview v-for="comment in myComments" :key="comment.id" :comments="comment"
                @refresh-comments="fetchMyComments" />
        </div>

        <div v-else class="no-comments">
            <p>You have not posted any comments yet.</p>
        </div>
        <footer>
            <PaginationBar v-if="myCommentsResponse" :meta_links="myCommentsResponse.meta.links"
                @pageChange="setPageChange" />
        </footer>
    </main>

</template>


<style scoped>
.comments-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    width: auto;
    background-color: var(--color-background-1);
}

select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--color-text-1);
    background-color: var(--color-background-1);
    color: var(--color-text-1);
    font-size: 1rem;
    cursor: pointer;
}
.comments-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.no-comments {
    text-align: center;
    color: #999;
    font-size: 16px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
