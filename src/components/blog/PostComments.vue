<script setup lang="ts">
import { inject, ref } from 'vue';
import CommentThread from './CommentThread.vue'; // Assuming CommentItem is a sibling component
import type { Comment, CreateComment } from '@/types';
import { createComment } from '@/api/commentApi';

// Inject the `triggerSnackbar` function from the App.vue
const triggerSnackbar = inject('triggerSnackbar') as (message: string, success?: boolean) => void;


const props = defineProps<{
    comments: Comment[];
    postSlug: string;
    posterId: number;
}>();

const emits = defineEmits(['refresh-comments']);

const newComment = ref<CreateComment>({ content: '', parent_id: null });
const postingComment = ref(false);

const addComment = () => {
    postingComment.value = true;
    if (newComment.value.content.trim()) {

        createComment(props.postSlug, newComment.value).then(() => {
            newComment.value.content = '';
            emits('refresh-comments');

            triggerSnackbar('Comment added successfully.', true);

        }).catch((error) => {
            console.error('Error adding comment:', error);

            triggerSnackbar('Failed to add comment. Please try again.', false);
        }).finally(() => {
            postingComment.value = false;
        });
        newComment.value.content = '';

    }
};
</script>

<template>
    <div class="comments-section">
        <h2 class="comments-title">Comments</h2>

        <!-- New Comment Form -->
        <div class="new-comment-form">
            <textarea v-model="newComment.content" placeholder="Add a comment..." rows="3"></textarea>
            <button @click="addComment" :disabled="postingComment" class="post-comment-button">Post Comment</button>
        </div>

        <!-- Existing Comments -->
        <div class="existing-comments">
            <CommentThread v-for="comment in props.comments" :key="comment.id" :comment="comment"
                :postSlug="props.postSlug" :posterId="props.posterId" @refresh-comments="emits('refresh-comments')" />
        </div>
    </div>
</template>


<style scoped>
/* Main Comments Section Styling */
.comments-section {
    background-color: #f0f0f5;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

/* Comments Title */
.comments-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
}

/* New Comment Form Styling */
.new-comment-form {
    margin-bottom: 20px;
}

textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    resize: none;
    margin-bottom: 10px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
}

textarea:focus {
    border-color: #007bff;
    outline: none;
}

/* Post Comment Button Styling */
.post-comment-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
    /* Aligns button to the right */
}

.post-comment-button:hover {
    background-color: #218838;
}

.post-comment-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Existing Comments Section Styling */
.existing-comments {
    margin-top: 20px;
}
</style>
