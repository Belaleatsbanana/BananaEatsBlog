<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import BlogComments from '@/components/blog/PostComments.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import HeartIcon from '@/components/icons/HeartIcon.vue';
import defaultImage from "@/assets/images/BananaBlog.png";
import CustomPopup from '@/components/ui/CustomPopup.vue';
import type { PostDetail } from '@/types';
import { deletePost, getPost } from '@/api/postApi';
import { ROUTES } from '@/util/constants';
import { handleLikeClick } from '@/api/likeApi';

const imgSrc = ref<string>(defaultImage);
const route = useRoute();
const slug = ref<string>('');
const blogPost = ref<PostDetail>();
const userId = parseInt(localStorage.getItem('userId') as string, 10);
const likeAnimation = ref<string | null>(null);
const likeAction = ref<string | null>(null);
const isBlogPoster = ref<boolean>();

const likeHeaderMessage = ref('');
const likePopupVisible = ref(false);

const popupMessage = ref('');
const popupVisible = ref(false);

onMounted(() => {
    slug.value = route.params.slug as string;

    getPost(slug.value).then((result) => {
        blogPost.value = result;
        isBlogPoster.value = result.user.id === userId;

    }).catch((err) => {
        console.log(err);

    });
});

const editBlog = (slug: string) => {
    if (slug) router.push({ name: ROUTES.EDIT_POST.name, params: { slug } });
};

const deleteBlog = async () => {
    if (slug.value) {

        deletePost(slug.value).then(() => {
            popupMessage.value = 'Post deleted successfully.';
            popupVisible.value = true;

            router.push({ name: ROUTES.HOME.name });

        }).catch(() => {
            popupMessage.value = "An error occurred. Please try again.";
            popupVisible.value = true;

        })
    } else {
        popupMessage.value = 'Post does not exist!';
        popupVisible.value = true;
    }
};


const toggleLikeBlog = () => {
    // Prevent multiple likes in quick succession
    if (likeAnimation.value) return;

    if (!blogPost.value) {
        popupMessage.value = 'Post does not exist!';
        popupVisible.value = true;
        return;
    }

    likeAnimation.value = slug.value;
    likeAction.value = blogPost.value.liked_by_user ? 'unliking' : 'liking';

    blogPost.value.liked_by_user = !blogPost.value.liked_by_user;
    blogPost.value.likes_count += blogPost.value.liked_by_user ? 1 : -1;

    // Simulate animation delay
    setTimeout(() => {
        likeAnimation.value = null;
        likeAction.value = null;
        handleLikeClick(slug.value)
            .then((success) => {
                if (!success) {
                    // Revert changes if API call fails

                    blogPost.value!.liked_by_user = !blogPost.value!.liked_by_user;
                    blogPost.value!.likes_count += blogPost.value!.liked_by_user ? -1 : 1;

                }
            })
            .catch(() => {
                // Revert changes if API call fails
                    blogPost.value!.liked_by_user = !blogPost.value!.liked_by_user;
                    blogPost.value!.likes_count += blogPost.value!.liked_by_user ? -1 : 1;
                
            });
    }, 1000); // Adjust the delay time to match your animation duration
};



// do this now
const openLikes = () => {
    const likes = blogPost.value!.likes;

    if (likes.length) {

        likeHeaderMessage.value = 'Likes';
        likePopupVisible.value = true;

    } else {
        likeHeaderMessage.value = 'No likes yet';
        likePopupVisible.value = true;

    }
};

const refreshComments = () => {
    getPost(slug.value).then((result) => {
        blogPost.value = result;
        isBlogPoster.value = result.user.id === userId;

    }).catch((err) => {
        console.log(err);

    });
};


</script>



<template>

    <main>


        <section v-if="blogPost" class="content">

            <img :src="blogPost.image ? blogPost.image : imgSrc" alt="Blog Image" class="post-image" />

            <div class="header-wrapper">

                <h1>{{ blogPost.title }}</h1>

                <div class="content-header">
                    <div class="in-liner">
                        <div class="blog-like" @click="openLikes">

                            <HeartIcon :fillColor="blogPost.liked_by_user ? 'red' : 'white'"
                                :strokeColor="blogPost.liked_by_user ? 'red' : 'black'"
                                @click.stop="toggleLikeBlog"
                                :class="likeAction === 'liking' && likeAnimation === blogPost.slug ? 'liking' : likeAction === 'unliking' && likeAnimation === blogPost.slug ? 'unliking' : ''"
                                class="heart-icon" />
                            <span>{{ blogPost.likes_count }} Likes</span>

                        </div> <!-- Blog Heart Icon -->

                        <div v-if="blogPost.user.id === userId" class="action-icons">

                            <div @click="editBlog(blogPost.slug)" class="edit-icon" title="Edit Blog">
                                <EditIcon />
                            </div> <!-- Edit Icon -->

                            <div @click="deleteBlog" class="delete-icon" title="Delete Blog">
                                <DeleteIcon />
                            </div> <!-- Delete Icon -->

                        </div> <!-- Blog Manipulation Actions -->

                    </div> <!-- Blog Actions -->

                    <div class="content-header-items">
                        <span>By {{ blogPost.user?.name }}</span>
                        <span>Published: {{ blogPost.created_at?.split('T')[0] }}</span>
                        <span>Last Edited: {{ blogPost.updated_at?.split('T')[0] }}</span>
                    </div> <!-- Blogger Details -->

                </div> <!-- Content Header -->

            </div> <!-- Blog Header -->

            <article>
                <p>{{ blogPost.content }}</p>
            </article>

        </section>

    </main>
    <footer>

        <BlogComments v-if="blogPost" :comments="blogPost.comments" :postSlug="slug"
        @refresh-comments="refreshComments"/>

    </footer>
    <CustomPopup v-if="blogPost" :visible="likePopupVisible || popupVisible" :message="likeHeaderMessage"
        :likes="blogPost.likes" @update:visible="likePopupVisible = $event" />


</template>



<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    max-width: 1100px;
    margin: 0 auto;
}

.post-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 4px;
}

.header-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.content-header {
    min-width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: auto;
    position: relative;
}

.in-liner {
    display: flex;
    gap: 10px;
}

.blog-like {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: transform 0.3s, background-color 0.3s;
    padding: 10px 10px;
    border-radius: 1em;
}

.blog-like:hover {
    transform: scale(1.1);
    background-color: var(--color-background-1);
}

.heart-icon {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease, color 0.3s ease;
}

.heart-icon:hover {
    transform: scale(1.2);
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

.content-header-items {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-right: 1em;
    width: fit-content;
}

.action-icons {
    padding: 0.5em;
    display: flex;
    gap: 10px;
    top: -20px;
    right: -10px;
}

.edit-icon,
.delete-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 20px;
    transition: transform 0.3s;
}

.edit-icon:hover,
.delete-icon:hover {
    transform: scale(1.2);
}

.content {
    width: 100%;
    margin-bottom: 20px;
}

h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 10px;
    overflow-wrap: break-word;
    word-break: break-word;
}

article p {
    margin-top: 2em;
    font-size: 1.1rem;
    line-height: 1.8;
    color: #444;
}

.comments-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
    z-index: 1000;
    background-color: #444140;
    color: #fff;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease;
}
</style>
