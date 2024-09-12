<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import PostList from '@/components/blog/PostList.vue';
import PaginationBar from '@/components/ui/PaginationBar.vue';
import type { Post, PostListResponse } from '@/types';
import { getPostList } from '@/api/postApi';

const ApiResponse = ref<PostListResponse>();
const Posts = ref<Post[]>([]);
const selectedSort = ref<'desc' | 'asc'>('desc');
const currentPageNumber = ref<number>(1);

const route = useRoute();
const query = ref('');

onMounted(() => {

    query.value = route.query.q as string;

    fetchPosts();
});

const fetchPosts = () => {

    getPostList(currentPageNumber.value, selectedSort.value, query.value).then((response) => {
        ApiResponse.value = response;
        Posts.value = response.data;
    })
        .catch((error) => {
            console.error(error);
        });
};

const onSortChange = () => {

    getPostList(currentPageNumber.value, selectedSort.value, query.value).then((response) => {
        ApiResponse.value = response;
        Posts.value = response.data;
    })
        .catch((error) => {
            console.error(error);
        });
};

const setPageChange = (pageUrl: string) => {

    currentPageNumber.value = parseInt(pageUrl[pageUrl.length - 1]);

    getPostList(currentPageNumber.value, selectedSort.value, query.value).then((response) => {
        ApiResponse.value = response;
        Posts.value = response.data;

        // scroll to top of the page after page change
        window.scrollTo(0, 0);
    })
        .catch((error) => {
            console.error(error);
        });

};

// Handle query changes using the route update hook
onBeforeRouteUpdate((to, from, next) => {
    const newQuery = to.query.q?.toString();
    if (newQuery !== from.query.q) {
        query.value = newQuery as string;
        currentPageNumber.value = 1;
        fetchPosts();
    }
    next();
});

</script>

<template>
    <main class="display-home">

        <section class="home-body">

            <div class="home-header">
                <h1>Search Results for {{ query as string }}</h1>
                <select name="sort" id="sort" v-model="selectedSort" @change="onSortChange">
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                </select>
            </div>

            <PostList :blogs="Posts" />

        </section>

        <footer v-if="ApiResponse">
            <PaginationBar :meta_links="ApiResponse.meta.links" @pageChange="setPageChange" />
        </footer>

    </main>

</template>

<style scoped>
h1 {
    font-size: 1.5rem;
    font-weight: 700;
}

h2 {
    font-size: 1.25rem;
    font-weight: 600;
}

p {
    font-size: 0.75rem;
    font-weight: 400;
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

.display-home {
    display: flex;
    flex-direction: column;
    padding: 1em;
}

.home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    width: auto;
    background-color: var(--color-background-1);
}

.home-body {
    display: flex;
    flex-direction: column;
    width: auto;
    background-color: var(--color-background-1);
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3em;
}
</style>