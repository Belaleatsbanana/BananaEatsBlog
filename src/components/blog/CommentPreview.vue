<script setup lang="ts">
import type { ExtendedComment, UpdateComment } from '@/types';
import { inject, ref } from 'vue';
import SaveIcon from '../icons/SaveIcon.vue';
import EditIcon from '../icons/EditIcon.vue';
import DeleteIcon from '../icons/DeleteIcon.vue';

import defaultImage from '@/assets/images/blog.jpg';
import { deleteComment, updateComment } from '@/api/commentApi';
import CancelIcon from '../icons/CancelIcon.vue';

// Inject the `triggerSnackbar` function from the App.vue
const triggerSnackbar = inject('triggerSnackbar') as (message: string, success?: boolean) => void;


const props = defineProps<{
    comments: ExtendedComment
}>();

// Emit event for refreshing comments after actions
const emits = defineEmits(['refresh-comments']);

const comment = ref<ExtendedComment>(props.comments);

const editMode = ref(false);
const currentContent = ref(comment.value.content);

const editComment = () => {
    editMode.value = true;
};

const cancelEdit = () => {
    comment.value.content = currentContent.value;
    editMode.value = false;
};

const saveComment = () => {

    const updatedComment : UpdateComment = {
        id: comment.value.id,
        content: comment.value.content
    }

    updateComment(comment.value.post.slug, updatedComment)
        .then(() => {
            editMode.value = false;
            triggerSnackbar('Comment updated successfully', true);
            emits('refresh-comments');
        })
        .catch((error) => {
            console.error(error);

            triggerSnackbar('Error updating comment', false);
        });
};

const deleteMyComment = () => {
    
    deleteComment(comment.value.post.slug, comment.value.id)
        .then(() => {
            triggerSnackbar('Comment deleted successfully', true);

            emits('refresh-comments');
        })
        .catch((error) => {
            console.error(error);
            triggerSnackbar('Error deleting comment', false);
        });
};
</script>

<template>
    <div class="comment-container">
        <div class="comment-content">
            <div class="comment-header">
                <div class="comment-info">
                    <p>Posted on <strong>{{ comment.post.title }}</strong></p>
                    <span>{{ comment.created_at_readable }}</span>
                </div>
                <div class="comment-actions">
                    <div class="comment-action" >
                        <SaveIcon v-if="editMode" class="icon" @click="saveComment" />
                        <CancelIcon v-if="editMode" class="icon" @click="cancelEdit" />
                        <EditIcon v-else class="icon" @click="editComment" />
                    </div>
                    <div class="comment-action" @click="deleteMyComment">
                        <DeleteIcon class="icon" />
                    </div>
                </div>
            </div>
            <div class="comment-text">
                <textarea v-if="editMode" v-model="comment.content" rows="3" />
                <p v-else>{{ comment.content }}</p>
            </div>
        </div>
        <div class="comment-thumbnail">
            <img :src="comment.post.image_thumb || defaultImage" alt="Post Thumbnail" class="thumbnail-img" />
        </div>
    </div>
</template>

<style scoped>
.comment-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
    border: 1px solid var(--color-muted);
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.comment-info {
    font-size: 14px;
    color: var(--color-text-muted);
}

.comment-info p {
    margin: 0;
}

.comment-info span {
    font-size: 12px;
    color: var(--color-text-muted);
}

.comment-actions {
    display: flex;
    gap: 10px;
}

.comment-action {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.comment-text {
    margin-top: 10px;
    width: 100%;
}

textarea {
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--color-muted);
    background-color: #f9f9f9;
    resize: vertical;
    /* Allow only vertical resizing */
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.5;
    /* Ensure the textarea doesn't overlap with the thumbnail */
}

textarea:focus {
    border-color: var(--color-primary);
    outline: none;
    background-color: #fff;
}

.comment-thumbnail {
    min-width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.thumbnail-img {
    max-width: 100%;
    max-height: 100px;
    object-fit: cover;
    border-radius: 8px;
}
</style>
