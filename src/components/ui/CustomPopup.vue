<script setup lang="ts">
import type { UserBasicInfo } from '@/types';



const props = defineProps<{
    message: string;
    isInput?: boolean;
    visible: boolean;
    modelValue?: string;
    mode?: 'create' | 'edit';
    commentId?: number;
    likes?: UserBasicInfo[];
}>();


const emit = defineEmits<{
    (event: 'update:visible', value: boolean): void;
    (event: 'update:modelValue', value: string): void;
    (event: 'save', comment: { id?: number; content: string }): void;
}>();


const closePopup = () => {
    emit('update:visible', false);
};


const handleInput = (event: Event) => {
    const textareaElement = event.target as HTMLTextAreaElement;
    emit('update:modelValue', textareaElement.value);
};


const handleSave = () => {
    const content = props.modelValue || '';
    if (props.mode === 'create') {
        emit('save', { content });
    } else if (props.mode === 'edit') {
        emit('save', { id: props.commentId, content });
    }
    closePopup();
};

</script>

<template>

    <div v-if="props.visible" class="popup-overlay">

        <div class="popup-content">

            <p>{{ props.message }}</p>

            <div v-if="props.likes?.length" class="likes-list">
                <ul>
                    <li v-for="like in props.likes" :key="like.id">{{ like.name }}</li>
                </ul>
            </div>


            <textarea v-if="props.isInput" :value="props.modelValue" @input="handleInput"
                class="popup-input"></textarea>

            <div class="btn-group">
                <button class="close-btn" @click="closePopup">Close</button>
                <button v-if="props.isInput" class="close-btn" @click="handleSave">Save</button>
            </div>

        </div>

    </div>

</template>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
}

.popup-content {
    background-color: var(--color-background-3);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    width: 70%;
    max-width: 300px;
    height: 60%;
    max-height: 500px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    transform: scale(1);
    opacity: 1;
    animation: popup-appear 0.3s ease-out;
}

.likes-list {
    margin-bottom: 1rem;
    max-height: 300px;
    /* Adjust the height as needed */
    overflow-y: auto;
}

.likes-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.likes-list li {
    border-radius: 8px;
    padding: 0.5rem;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    background-color: var(--color-background-1);
    color: var(--color-text-1);
}

.popup-content p {
    color: var(--color-text-1);
    font-size: 1.4rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    text-align: center;
}

.likes-list h3 {
    font-size: 1.2rem;
    color: var(--color-text-1);
    margin-bottom: 0.5rem;
}

.popup-input {
    width: 100%;
    min-height: 100px;
    padding: 0.8rem;
    border-radius: 8px;
    border: 1px solid var(--color-muted);
    font-size: 1rem;
    margin-bottom: 1.5rem;
    outline: none;
    resize: vertical;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.popup-input:focus {
    border-color: var(--color-text-1);
    box-shadow: 0 0 5px var(--color-text-1);
}

.btn-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: auto;
}

.close-btn {
    background-color: var(--color-text-1);
    border: none;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.close-btn:hover {
    background-color: var(--color-muted);
    transform: scale(1.05);
}

@keyframes popup-appear {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
