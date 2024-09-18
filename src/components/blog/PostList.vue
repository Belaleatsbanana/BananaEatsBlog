<script setup lang="ts">
import { computed, ref } from "vue";
import type { Post } from "@/types";
import CommentsIcon from "@/components/icons/CommentsIcon.vue";
import router from "@/router";
import EditIcon from "../icons/EditIcon.vue";
import HeartIcon from "../icons/HeartIcon.vue";
import defaultImage from "@/assets/images/blog.jpg";
import { ROUTES } from "@/util/constants";
import { handleLikeClick } from "@/api/likeApi";

const props = defineProps<{
    blogs: Post[];
}>();

const imgSrc = ref<string>(defaultImage);
const userId = parseInt(localStorage.getItem("BananaBlogUserId") as string);

const likeAnimation = ref<string | null>(null);
const likeAction = ref<string | null>(null);

const gridBlogs = computed(() => {
    return props.blogs.map((blog) => {
        return {
            ...blog,
            editMode: blog.user.id === userId,
        };
    });
});

const openBlog = (slug: string) => {
    router.push({ name: ROUTES.POST.name, params: { slug } });
};

const editBlog = (slug: string) => {
    router.push({ name: ROUTES.EDIT_POST.name, params: { slug } });
};

const toggleLikeBlog = (slug: string) => {
    // Prevent multiple likes in quick succession
    if (likeAnimation.value) return;

    // Find the blog object
    const blog = gridBlogs.value.find((blog) => blog.slug === slug); // bruh
    if (!blog) return;

    likeAnimation.value = slug;
    likeAction.value = blog.liked_by_user ? 'unliking' : 'liking';

    blog.liked_by_user = !blog.liked_by_user;
    blog.likes_count += blog.liked_by_user ? 1 : -1;

    // Simulate animation delay
    setTimeout(() => {
        likeAnimation.value = null;
        likeAction.value = null;

        handleLikeClick(slug)
            .then((success) => {
                if (!success) {
                    // Revert changes if API call fails
                    blog.liked_by_user = !blog.liked_by_user;
                    blog.likes_count += blog.liked_by_user ? -1 : 1;
                }
            })
            .catch(() => {
                // Revert changes if API call fails
                blog.liked_by_user = !blog.liked_by_user;
                blog.likes_count += blog.liked_by_user ? -1 : 1;
            });
    }, 1000); // Adjust the delay time to match your animation duration
};




</script>

<template>
    <main class="grid-container">
        <div class="grid-item" v-for="blog in gridBlogs" :key="blog.slug" @click="openBlog(blog.slug)">
            <img v-if="blog.image_thumb" :src="blog.image_thumb" alt="Blog image" class="blog-image" />
            <img v-else :src="imgSrc" alt="Blog img" class="blog-image" />

            <div class="item-content">
                <h2 class="item-title">{{ blog.title }}</h2>
                <p class="item-content">{{ blog.content }}</p>
            </div>

            <div class="in-liner">
                <span>Posted by: @{{ blog.user.name }}</span>
                <div class="in-liner">
                    <div v-if="blog.editMode" class="edit-icon" @click.stop="editBlog(blog.slug)">
                        <EditIcon />
                    </div>
                    <div class="in-liner">
                        <div class="heart-icon" @click.stop="toggleLikeBlog(blog.slug)" :class="{
                            liking: likeAction === 'liking' && likeAnimation === blog.slug,
                            unliking: likeAction === 'unliking' && likeAnimation === blog.slug,
                        }">
                            <HeartIcon :strokeColor="blog.liked_by_user ? 'red' : 'black'"
                                :fill-color="blog.liked_by_user ? 'red' : 'white'" />
                        </div>
                        <span class="like-count">{{ blog.likes_count }}</span>
                    </div>
                </div>
            </div>

            <div class="in-liner">
                <span>Published: {{ blog.created_at?.split('T')[0] }}</span>
                <div class="comments-container">
                    <CommentsIcon /> <span>{{ blog.comments_count }}</span>
                </div>
            </div>

            <div v-if="blog.last_comment" class="last-comment">
                <h3>Most Recent Comment</h3>
                <span>{{ blog.last_comment.content }}</span>
                <br />
                <small>— {{ blog.last_comment.user?.name }}, {{ blog.last_comment.created_at_readable }}</small>
            </div>
            <div v-else class="last-comment">
                <span class="last-comment-content">Be the first to comment!</span>
            </div>
        </div>
    </main>
</template>


<style scoped>
p {
    line-height: 1.1;
    margin-top: 0.2rem;
    /* Further reduced margin */
    font-size: 0.65rem;
    /* Further reduced font size */
    color: var(--color-text-1);
}

h3 {
    font-size: 0.75rem;
    /* Further reduced font size */
    text-align: center;
}

.grid-container {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    /* Adjusted min size to 1fr for equal spacing */
    gap: 10px 6px;
    height: 100%;
    /* Allow the container to stretch to full height */
}

.grid-item {
    max-width: 100%;
    /* Let the grid items grow */
    min-height: 400px;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.5rem;
    border-radius: 3px;
    background-color: var(--color-background-3);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    flex-grow: 1;
    /* Make the items stretchable */
}

.item-content {
    font-size: 0.65rem;
    line-height: 1.1;
    margin: 0.7em 0;
    display: -webkit-box;
    line-clamp: 5;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    /* Let the content take up available space */
}

.grid-item:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    /* Reduced shadow */
}

.blog-image {
    width: 100%;
    height: 150px;
    /* Further reduced height */
    object-fit: cover;
    border-radius: 3px;
}

.item-title {
    font-size: 0.75rem;
    /* Further reduced font size */
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.last-comment {
    font-size: 0.65rem;
    min-height: 70px;
    margin-top: 0.4em;
    padding-top: 0.3em;
    display: -webkit-box;
    line-clamp: 3;
    /* Set the number of lines to show */
    -webkit-line-clamp: 3;
    /* Limit the number of lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.last-comment-content {
    display: -webkit-box;
    line-clamp: 1;
    /* Limit it to 1 line */
    -webkit-line-clamp: 1;
    /* Limit to 1 line */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.blog-footer {
    font-size: 0.65rem;
    /* Further reduced font size */
    padding: 1px 2px;
    /* Further reduced padding */
}

.in-liner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    /* Further reduced gap */
}

.in-liner span {
    font-size: 0.75rem;
    /* Further reduced font size */
}

.heart-icon {
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
}

.heart-icon:hover {
    transform: scale(1.2);
    /* Further reduced scaling */
}

.heart-icon.liking {
    animation: bounce 0.6s ease;
}

.heart-icon.unliking {
    animation: shrink 0.6s ease;
}

@keyframes bounce {
    0% {
        transform: scale(1);
    }

    20% {
        transform: scale(1.3);
    }

    50% {
        transform: scale(1.2);
    }

    70% {
        transform: scale(1.35);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes shrink {
    0% {
        transform: scale(1.35);
    }

    100% {
        transform: scale(1);
    }
}

.like-count {
    font-size: 0.75rem;
    /* Further reduced font size */
}

.edit-icon {
    padding: 0.3em 0.4em;
    /* Further reduced padding */
    cursor: pointer;
    border-radius: 1em;
    display: flex;
    align-items: center;
}

.edit-icon:hover {
    transform: scale(1.1);
    /* Further reduced scaling */
    background-color: var(--color-muted);
}

.comments-container {
    padding: 0.3em 0 0.4em 0;
    display: flex;
    align-items: center;
    gap: 0.4em;
    /* Further reduced gap */
}
</style>
