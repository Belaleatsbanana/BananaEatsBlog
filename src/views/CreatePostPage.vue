<script setup lang="ts">
import { ref, onUnmounted, inject } from 'vue';

import defaultImage from "@/assets/images/Logo.png";
import EditIcon from '@/components/icons/EditIcon.vue';
import { createPost } from '@/api/postApi';
import router from '@/router';
import { ROUTES } from '@/util/constants';

// Inject the `triggerSnackbar` function from the App.vue
const triggerSnackbar = inject('triggerSnackbar') as (message: string, success?: boolean) => void;

const defaultimg = ref<string>(defaultImage);
const blogImage = ref<string>();
const title = ref('');
const content = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const newImageFile = ref<File | null>(null);

const popupMessage = ref('');

const disableButton = ref(false);
let objectUrl: string | null = null;

const createPostHandler = async () => {

    disableButton.value = true;

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);

    if (newImageFile.value) {
        formData.append('image', newImageFile.value);
        console.log(formData.get('image'));

    }

    createPost(formData).then((response) => {

        router.push({ name: ROUTES.POST.name, params: { slug: response } });
        triggerSnackbar('Post created successfully', true);

    }).catch((err) => {
        popupMessage.value = err.response.data.message;
        disableButton.value = false;

        triggerSnackbar(popupMessage.value, false);

    }).finally(() => {
        disableButton.value = false;
    });
};

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const handleFileUpload = (event: Event) => {

    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!validImageTypes.includes(file.type)) {
            popupMessage.value = 'Invalid file type. Please select an image file.';

            triggerSnackbar(popupMessage.value, false);
            return;

        }

        newImageFile.value = file;
        blogImage.value = URL.createObjectURL(file);

        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
        objectUrl = blogImage.value;

        triggerSnackbar('Image uploaded successfully', true);
    }
};

onUnmounted(() => {
    if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
    }
});
</script>



<template>


    <main class="new-post">

        <div class="in-liner">
            <h1>New Post</h1>
        </div>

        <div class="image-upload-wrapper">

            <img :src="blogImage ? blogImage : defaultimg" alt="Blog image" class="blog-image"
                @click="triggerFileInput" />
            <input type="file" ref="fileInput" @change="handleFileUpload" class="file-input" />

            <div class="edit-icon" @click="triggerFileInput">
                <EditIcon />
            </div> <!-- Edit Icon -->

        </div> <!-- Edit Image Action -->

        <form @submit.prevent="createPostHandler" class="post-form">

            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" id="title" v-model="title" placeholder="Enter post title" required />
            </div> <!-- Title Input Group -->

            <div class="form-group">
                <label for="content">Content:</label>
                <textarea id="content" v-model="content" placeholder="Write your post content here" rows="10"
                    required></textarea>
            </div> <!-- Content Input Group -->

            <div class="form-actions">
                <button type="submit" :disabled="disableButton">Post</button>
            </div> <!-- Form Submit Action -->

        </form>

    </main>


</template>

<style scoped>
.new-post {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 20px auto;
}

h1 {
    font-size: 2rem;
    color: #333;
}

.image-upload-wrapper {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 20px 0;
}

.blog-image {
    width: 100%;
    height: 350px;
    object-fit: cover;
    border-radius: 4px;
    transition: filter 0.3s ease;
    border: 1px solid #000000;
    cursor: pointer;
}

.image-upload-wrapper:hover .blog-image {
    filter: blur(3px);
}

.edit-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    font-size: 1.5rem;
    transition: opacity 0.3s ease;
}

.image-upload-wrapper:hover .edit-icon {
    display: block;
    opacity: 1;
}

.file-input {
    display: none;
}

.in-liner {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    position: relative;
    width: 100%;
}

.delete-action {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    position: absolute;
    right: 0;
    padding: 8px;
    border-radius: 4px;
    transition: color 0.3s, background-color 0.3s, transform 0.3s;
}

.delete-action:hover {
    color: #EF2D56;
    background-color: var(--color-background-1);
    transform: scale(1.1);
}

.post-form {
    width: 100%;
}

.form-group {
    margin-bottom: 20px;
}

label {
    font-size: 1rem;
    color: #444;
    margin-bottom: 8px;
    display: block;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 5px;
}

textarea {
    resize: vertical;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

button {
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #444140;
    color: #fff;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #EF2D56;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
