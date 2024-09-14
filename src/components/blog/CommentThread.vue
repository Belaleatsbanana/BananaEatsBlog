<script setup lang="ts">
import { inject, ref } from 'vue';
import type { Comment, CreateComment, UpdateComment } from '@/types';
import OptionIcon from '../icons/OptionIcon.vue';
import { createComment, deleteComment, updateComment } from '@/api/commentApi';

// Inject the `triggerSnackbar` function from the App.vue
const triggerSnackbar = inject('triggerSnackbar') as (message: string, success?: boolean) => void;


const props = defineProps<{
    comment: Comment;
    postSlug: string;
    posterId: number;
}>();

// Emit event for refreshing comments after actions
const emits = defineEmits(['refresh-comments']);

// Reactive variables for UI state
const showReplyForm = ref(false);    // Show/hide reply form
const showReplies = ref(false);      // Show/hide nested replies
const replyContent = ref('');        // Holds content for the reply input

// Edit mode state
const isEditing = ref(false);        // Whether the comment is being edited
const editedContent = ref(props.comment.content);  // Edited comment content

// Fetch current user ID from localStorage
const userId = parseInt(localStorage.getItem('BananaBlogUserId') as string);

// Check if the comment is editable or deletable by the current user
const editableComment = ref(props.comment.user.id === userId);
const deletableComment = ref(props.comment.user.id === userId || props.posterId === userId);

// UI state for option dropdown visibility
const isOptionDropdownVisible = ref(false);

// States to show loading/spinner while saving comments/replies
const savingComment = ref(false);
const savingReply = ref(false);

/**
 * Adds a reply to the comment.
 * Calls the `createComment` API and refreshes the comment list upon success.
 */
const addReply = async () => {
    if (replyContent.value.trim()) {
        savingReply.value = true;

        const newReply: CreateComment = {
            content: replyContent.value.trim(),
            parent_id: props.comment.id,
        };

        createComment(props.postSlug, newReply)
            .then(() => {
                emits('refresh-comments');  // Emit event to refresh the comments

                triggerSnackbar('Reply added successfully.', true);
            })
            .catch((err) => {
                console.error(err);

                triggerSnackbar('Failed to add reply. Please try again.', false);
            })
            .finally(() => {
                showReplyForm.value = false;   // Close the reply form
                savingReply.value = false;     // Stop showing the loading spinner
                replyContent.value = '';       // Clear the reply input
            });
    }
};

/**
 * Saves the edited comment.
 * Calls the `updateComment` API and refreshes the comment list upon success.
 */
const saveEditedComment = async () => {
    if (editedContent.value.trim()) {
        savingComment.value = true;

        const updatedComment: UpdateComment = {
            id: props.comment.id,
            content: editedContent.value.trim(),
        };

        updateComment(props.postSlug, updatedComment)
            .then(() => {
                emits('refresh-comments');  // Emit event to refresh the comments

                triggerSnackbar('Comment updated successfully.', true);
            })
            .catch((err) => {
                console.error(err);

                triggerSnackbar('Failed to update comment. Please try again.', false);
            })
            .finally(() => {
                isEditing.value = false;      // Exit edit mode
                savingComment.value = false;  // Stop showing the loading spinner
            });
    }
};

/**
 * Deletes the comment.
 * Calls the `deleteComment` API and refreshes the comment list upon success.
 */
const handleDeleteComment = () => {
    deleteComment(props.postSlug, props.comment.id)
        .then(() => {
            emits('refresh-comments');  // Emit event to refresh the comments

            triggerSnackbar('Comment deleted successfully.', true);
        })
        .catch((err) => {
            console.error(err);

            triggerSnackbar('Failed to delete comment. Please try again.', false);
        });
};

/**
 * Toggles visibility of nested replies.
 */
const toggleReplies = () => {
    showReplies.value = !showReplies.value;
};

/**
 * Toggles the visibility of the option dropdown for edit/delete actions.
 */
const toggleOptionDropdown = () => {
    isOptionDropdownVisible.value = !isOptionDropdownVisible.value;
};

/**
 * Activates edit mode and loads the current comment content into the editor.
 */
const startEditing = () => {
    isEditing.value = true;
    editedContent.value = props.comment.content;  // Load current content for editing
};

/**
 * Cancels edit mode and resets the content back to the original comment.
 */
const cancelEditing = () => {
    isEditing.value = false;
    editedContent.value = props.comment.content;  // Reset to original content
};
</script>

<template>
    <div class="comment-thread">
        <!-- Comment header with username and timestamp -->
        <div class="comment-header">
            <strong class="user-name">{{ comment.user.name }}</strong>
            <span class="created-at">&#x2022; {{ comment.created_at_readable }}</span>
        </div>

        <!-- Edit Mode: Show textarea if editing, otherwise show comment content -->
        <div v-if="isEditing" class="edit-comment-form">
            <textarea v-model="editedContent" rows="3"></textarea>
            <div class="edit-actions">
                <button class="save-button" :disabled="savingComment" @click="saveEditedComment">Save</button>
                <button class="cancel-button" @click="cancelEditing">Cancel</button>
            </div>
        </div>
        <p v-else class="comment-content">{{ comment.content }}</p>

        <!-- Comment actions (reply, edit, delete) -->
        <div class="comment-actions">
            <!-- Toggle to show/hide replies -->
            <button v-if="props.comment.children.length" class="reply-button" @click="toggleReplies">
                {{ showReplies ? 'Hide' : 'Show more' }}
            </button>

            <!-- Reply button -->
            <button class="reply-button" @click="showReplyForm = !showReplyForm">
                {{ showReplyForm ? 'Cancel' : 'Reply' }}
            </button>

            <!-- Options (edit/delete) dropdown -->

            <div class="option-container" @click="toggleOptionDropdown">
                <OptionIcon v-if="deletableComment" />
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

        <!-- Reply form (toggleable) -->
        <div v-if="showReplyForm" class="reply-form">
            <textarea v-model="replyContent" placeholder="Write your reply..." rows="3"></textarea>
            <button class="post-reply-button" :disabled="savingReply" @click="addReply">Post Reply</button>
        </div>

        <!-- Nested replies -->
        <div v-if="comment.children.length && showReplies" class="replies">
            <CommentThread v-for="reply in comment.children" :key="reply.id" :comment="reply" :postSlug="props.postSlug"
                :posterId="props.posterId" @refresh-comments="emits('refresh-comments')" />
        </div>
    </div>
</template>

<style scoped>
/* Container for each comment */
.comment-thread {
    background-color: #f9f9f9;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
    max-width: 100%;
    box-sizing: border-box;
}

/* Header (username and timestamp) */
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

/* Comment content styling */
.comment-content {
    font-size: 1rem;
    color: #444;
    margin-bottom: 10px;
}

/* Edit mode styles */
.edit-comment-form {
    margin-bottom: 10px;
}

.edit-actions {
    margin-top: 8px;
}

/* Buttons for save/cancel actions */
.save-button,
.cancel-button {
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    color: white;
}

.save-button {
    background-color: #28a745;
}

.save-button:disabled {
    background-color: #ccc;
}

.cancel-button {
    background-color: #dc3545;
    margin-left: 8px;
}

/* Textarea styling */
textarea {
    width: 100%;
    max-width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    box-sizing: border-box;
}

/* Comment action buttons (reply, show replies) */
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
}

.reply-button:hover {
    background-color: #0056b3;
}

/* Options dropdown for edit/delete */
.option-container {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 4px;
}

.option-container:hover {
    background-color: var(--color-muted);

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
