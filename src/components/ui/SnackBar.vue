<script lang="ts" setup>
interface SnackbarProps {
    message: string;
    visible: boolean;
    success?: boolean;
}

defineProps<SnackbarProps>();
const emit = defineEmits(['hide']);

const hideSnackbar = () => {
    emit('hide');
};
</script>


<template>
    <transition name="fade">
        <div v-if="visible" class="snackbar" :class="{ 'snackbar--success': success }">
            <span>{{ message }}</span>
            <button class="snackbar__close" @click="hideSnackbar">X</button>
        </div>
    </transition>
</template>


<style scoped>
.snackbar {
    position: fixed;
    top: 45px;
    /* Position below the header */
    left: 50%;
    transform: translateX(-50%);
    background-color: #ff0202;
    color: white;
    padding: 8px 16px;
    /* Reduce padding to make the snackbar smaller */
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 200px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
}

.snackbar span {
    font-size: 0.85rem;
    /* Smaller font size for the message */
}

.snackbar__close {
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
    /* Reduce the size of the close button */
    cursor: pointer;
}

.snackbar--success {
    background-color: #4CAF50;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
