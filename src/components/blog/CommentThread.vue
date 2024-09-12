<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { Comment, CreateComment, UpdateComment } from '@/types';
import OptionIcon from '../icons/OptionIcon.vue';
import { createComment, deleteComment, updateComment } from '@/api/commentApi';

const props = defineProps<{
    comment: Comment;
    postSlug: string;
    posterId: number;
}>();
const emits = defineEmits(['refresh-comments']);

const showReplyForm = ref(false);
const showReplies = ref(false);
const replyContent = ref('');

// New state for managing the edit mode and edited content
const isEditing = ref(false); // Toggle for edit mode
const editedContent = ref(props.comment.content); // Holds the edited content

const userId = parseInt(localStorage.getItem('userId') as string);

const editableComment = props.comment.user.id === userId;
const deletableComment = props.comment.user.id === userId || props.posterId === userId;

const isOptionDropdownVisible = ref(false);

const savingComment = ref(false);
const savingReply = ref(false);

// Function to handle adding a reply (you can integrate API call here)
const addReply = async () => {
    if (replyContent.value.trim()) {

        savingReply.value = true; // Set loading state

        const newReply: CreateComment = {
            content: replyContent.value.trim(),
            parent_id: props.comment.id,
        };

        createComment(props.postSlug, newReply).then(() => {

            emits('refresh-comments'); // Emit event to refresh comments
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            showReplyForm.value = false; // Hide reply form
            savingReply.value = false; // Reset loading state
            replyContent.value = ''; // Clear reply content
        });
    }
};

// Function to handle editing the comment
const saveEditedComment = async () => {
    if (editedContent.value.trim()) {
        
        savingComment.value = true; // Set loading state

        const EditedComment: UpdateComment = {
            id: props.comment.id,
            content: editedContent.value.trim(),
        };

        updateComment(props.postSlug, EditedComment).then(() => {

            emits('refresh-comments'); // Emit event to refresh comments
        }).catch((err) => {
            console.log(err);

        }).finally(() => {
            isEditing.value = false; // Exit edit mode
            savingComment.value = false; // Reset loading state
        });
    }
};

const handleDeleteComment = () => {
    
    deleteComment(props.postSlug, props.comment.id).then(() => {
        emits('refresh-comments'); // Emit event to refresh comments
    }).catch((err) => {
        console.log(err);
    });
};

// Toggle replies visibility
const toggleReplies = () => {
    showReplies.value = !showReplies.value;
};

// Show/hide option dropdown
const toggleOptionDropdown = () => {
    isOptionDropdownVisible.value = !isOptionDropdownVisible.value;
};

// Function to start editing the comment
const startEditing = () => {
    isEditing.value = true;
    editedContent.value = props.comment.content; // Load current content for editing
};

// Function to cancel editing
const cancelEditing = () => {
    isEditing.value = false;
    editedContent.value = props.comment.content; // Reset to original content
};
</script>

<template>
    <div class="comment-thread">
        <!-- Display Comment Content or Edit Mode -->
        <div class="comment-header">
            <strong class="user-name">{{ comment.user.name }}</strong>
            <span class="created-at">&#x2022; {{ comment.created_at_readable }}</span>
        </div>

        <!-- Check if we are in editing mode -->
        <div v-if="isEditing" class="edit-comment-form">
            <textarea v-model="editedContent" rows="3"></textarea>
            <div class="edit-actions">
                <button class="save-button" :disabled="savingComment" @click="saveEditedComment">Save</button>
                <button class="cancel-button" @click="cancelEditing">Cancel</button>
            </div>
        </div>
        <p v-else class="comment-content">{{ comment.content }}</p>

        <!-- Actions: Reply, Option Dropdown -->
        <div class="comment-actions">
            <!-- Show/Hide Replies Button -->
            <button v-if="props.comment.children.length" class="reply-button" @click="toggleReplies">
                {{ showReplies ? 'Hide' : 'Show more' }}
            </button>

            <!-- Reply Button -->
            <button class="reply-button" @click="showReplyForm = !showReplyForm">
                {{ showReplyForm ? 'Cancel' : 'Reply' }}
            </button>

            <!-- Option Icon Component -->
            <div class="option-container" @click="toggleOptionDropdown">
                <OptionIcon v-if="deletableComment" />

                <!-- Options Dropdown -->
                <div v-if="isOptionDropdownVisible" class="comment-options">
                    <ul>
                        <li v-if="editableComment">
                            <button @click="startEditing">Edit</button>
                        </li>
                        <li v-if="deletableComment">
                            <button @click="handleDeleteComment">Delete</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Reply Form (Toggled) -->
        <div v-if="showReplyForm" class="reply-form">
            <textarea v-model="replyContent" placeholder="Write your reply..." rows="3"></textarea>
            <button class="post-reply-button" :disabled="savingReply" @click="addReply">Post Reply</button>
        </div>

        <!-- Display Nested Replies -->
        <div v-if="comment.children.length && showReplies" class="replies">
            <CommentThread v-for="reply in comment.children" :key="reply.id" :comment="reply" :postSlug="props.postSlug"
                :posterId="props.posterId" @refresh-comments="emits('refresh-comments')" />
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
    box-sizing: border-box;
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

/* Comment Content */
.comment-content {
    font-size: 1rem;
    color: #444;
    margin-bottom: 10px;
}

/* Edit Mode Styles */
.edit-comment-form {
    margin-bottom: 10px;
}

/* Edit actions styling */
.edit-actions {
    margin-top: 8px;
}

/* Save and Cancel button styles */
.save-button {
    background-color: #28a745;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.save-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.cancel-button {
    background-color: #dc3545;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    margin-left: 8px;
    cursor: pointer;
}

/* Ensure textarea stays within container */
textarea {
    width: 100%;
    /* Ensures the textarea takes 100% width of its parent */
    max-width: 100%;
    /* Prevents overflow beyond parent container */
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    padding: 10px;
    font-size: 1rem;
    font-family: inherit;
    box-sizing: border-box;
    /* Ensures padding is included in width calculation */
}

/* Comment Actions (Reply, Options) */
.comment-actions {
    display: flex;
    align-items: center;
    position: relative;
}

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

/* Option Icon */
.option-container {
    position: relative;
    display: inline-block;
    cursor: pointer;
}

.comment-options {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    z-index: 1000;
    padding: 8px 0;
    min-width: 120px;
    white-space: nowrap;
}

.comment-options ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.comment-options li button {
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    padding: 8px 16px;
    width: 100%;
    text-align: left;
}

.comment-options li button:hover {
    background-color: #f5f5f5;
}

/* Reply Form */
.reply-form {
    margin-top: 10px;
    max-width: 100%;
    box-sizing: border-box;
}

.post-reply-button {
    background-color: #28a745;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.post-reply-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Nested Replies */
.replies {
    margin-left: 20px;
    padding-left: 10px;
    border-left: 2px solid #ddd;
    max-width: 100%;
    box-sizing: border-box;
}
</style>
