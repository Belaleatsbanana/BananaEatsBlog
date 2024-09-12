<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { Comment } from '@/types';

const props = defineProps<{ 
    comment: Comment; 
    postSlug: string; 
}>();
const emits = defineEmits(['refresh-comments']);

const showReplyForm = ref(false);
const showReplies = ref(false);
const replyContent = ref('');

// Function to handle adding a reply (you can integrate API call here)
const addReply = async () => {
    if (replyContent.value.trim()) {
        try {
            // API call to add the reply
            replyContent.value = '';
            showReplyForm.value = false;

            // Emit refresh to parent to fetch updated comment thread
            emits('refresh-comments');
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    }
};

// Toggle replies visibility
const toggleReplies = () => {
    showReplies.value = !showReplies.value;
};
</script>

<template>
    <div class="comment-thread">
        <!-- Display Comment Content -->
        <div class="comment-header">
            <strong class="user-name">{{ comment.user.name }}</strong>
            <span class="created-at">&#x2022; {{ comment.created_at_readable }}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>

        <!-- Hide/Show Replies Button -->
        <button v-if="props.comment.children.length" class="reply-button" @click="toggleReplies">
            {{ showReplies ? 'Hide' : 'Show more' }}
        </button>

        <!-- Reply Button -->
        <button class="reply-button" @click="showReplyForm = !showReplyForm">
            {{ showReplyForm ? 'Cancel' : 'Reply' }}
        </button>

        <!-- Reply Form (Toggled) -->
        <div v-if="showReplyForm" class="reply-form">
            <textarea v-model="replyContent" placeholder="Write your reply..." rows="3"></textarea>
            <button class="post-reply-button" @click="addReply">Post Reply</button>
        </div>

        <!-- Display Nested Replies -->
        <div v-if="comment.children.length && showReplies" class="replies">
            <CommentThread v-for="reply in comment.children" :key="reply.id" :comment="reply"
                :postSlug="props.postSlug"
                @refresh-comments="emits('refresh-comments')" />
        </div>
    </div>
</template>


<style scoped>
/* General Styles for the Comment Thread */
.comment-thread {
    background-color: #f9f9f9;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
    position: relative;
    max-width: 100%;
    /* Ensure the container does not exceed parent width */
    box-sizing: border-box;
    overflow: hidden;
    /* Avoid any overflow */
}

/* Header Section with User Name and Timestamp */
.comment-header {
    gap: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.user-name {
    font-weight: bold;
    color: #333;
}

.created-at {
    font-size: 0.85rem;
    color: #999;
}

/* Content of the Comment */
.comment-content {
    font-size: 1rem;
    color: #444;
    margin-bottom: 10px;
}

/* Hide/Show Replies & Reply Button Styling */
.reply-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 12px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
    transition: background-color 0.3s;
}

.reply-button:hover {
    background-color: #0056b3;
}

/* Reply Form Styling */
.reply-form {
    margin-top: 10px;
    max-width: 100%;
    /* Ensure the reply form stays within the parent container */
    box-sizing: border-box;
}

textarea {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    padding: 10px;
    margin-bottom: 8px;
    font-size: 1rem;
    font-family: inherit;
    box-sizing: border-box;
}

/* Post Reply button styling */
.post-reply-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 5px;
}

.post-reply-button:hover {
    background-color: #218838;
}

/* Nested Replies */
.replies {
    margin-left: 20px;
    padding-left: 10px;
    border-left: 2px solid #ddd;
    max-width: 100%;
    /* Ensure nested replies stay within the container */
    box-sizing: border-box;
}
</style>
