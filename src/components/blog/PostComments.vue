<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import CommentThread from './CommentThread.vue'; // Assuming CommentItem is a sibling component
import type { Comment } from '@/types';

const props = defineProps<{
    comments: Comment[];
    postSlug: string;
}>();

const emits = defineEmits(['refresh-comments']);
const newComment = ref('');

const addComment = () => {
    if (newComment.value.trim()) {

        // Make API call to add comment (pseudo-code)
        // addCommentApi(newCommentObj).then(() => {
        newComment.value = '';
        emits('refresh-comments');
        // });
    }
};
</script>

<template>
    <div class="comments-section">
        <h2 class="comments-title">Comments</h2>

        <!-- New Comment Form -->
        <div class="new-comment-form">
            <textarea v-model="newComment" placeholder="Add a comment..." rows="3"></textarea>
            <button @click="addComment" class="post-comment-button">Post Comment</button>
        </div>

        <!-- Existing Comments -->
        <div class="existing-comments">
            <CommentThread v-for="comment in props.comments" :key="comment.id" :comment="comment"
                :postSlug="props.postSlug"
                @refresh-comments="emits('refresh-comments')" />
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

/* Existing Comments Section Styling */
.existing-comments {
    margin-top: 20px;
}
</style>
