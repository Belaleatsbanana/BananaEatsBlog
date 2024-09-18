<script setup lang="ts">
import { ref } from 'vue';
import HomeIcon from '../icons/HomeIcon.vue';
import PostIcon from '../icons/PostIcon.vue';
import MyPostsIcon from '../icons/MyPostsIcon.vue';
import CommentsIcon from '../icons/CommentsIcon.vue';
import { ROUTES } from '@/util/constants';

const isMyPostsDisabled = ref(false);
const isCommentsDisabled = ref(false);
</script>

<template>
    <main class="navbar-container">
        <div class="navbar-master">
            <!-- Navigation Bar -->
            <nav class="navbar">
                <ul class="column-bar">
                    <!-- Dashboard Link -->
                    <li>
                        <router-link :to="{ name: ROUTES.HOME.name }">
                            <HomeIcon class="icon" height="16px" width="16px" />
                            <span>Dashboard</span>
                        </router-link>
                    </li>

                    <!-- New Post Link -->
                    <li>
                        <router-link :to="{ name: ROUTES.CREATE_POST.name }">
                            <PostIcon class="icon" height="18px" width="18px" />
                            <span>New Post</span>
                        </router-link>
                    </li>

                    <!-- My Posts Link (conditionally enabled/disabled) -->
                    <li>
                        <router-link v-if="!isMyPostsDisabled" :to="{ name: ROUTES.MY_POSTS.name }">
                            <MyPostsIcon class="icon" height="18px" width="18px" />
                            <span>My Posts</span>
                        </router-link>
                        <span v-else class="disabled">
                            <MyPostsIcon class="icon" height="18px" width="18px" />
                            <span>My Posts</span>
                        </span>
                    </li>

                    <!-- Comments Link (conditionally enabled/disabled) -->
                    <li>
                        <router-link v-if="!isCommentsDisabled" :to="{ name: ROUTES.MY_COMMENTS.name }">
                            <CommentsIcon class="icon" height="18px" width="18px" />
                            <span>Comments</span>
                        </router-link>
                        <span v-else class="disabled">
                            <CommentsIcon class="icon" height="18px" width="18px" />
                            <span>Comments</span>
                        </span>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Footer Section -->
        <footer>
            <p>&copy; BananaBlog 2024</p>
        </footer>
    </main>
</template>

<style scoped>
/* Main container for the navigation bar */
.navbar-container {
    position: fixed;
    top: 45px;
    left: 0;
    width: 160px;
    /* Further reduced width */
    height: calc(100vh - 45px);
    background-color: var(--color-background-3);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Navbar styles */
.navbar {
    margin-top: 1em;
    /* Further reduced margin */
}

/* List styling for the column-based navigation */
.column-bar {
    list-style: none;
    padding: 0;
    margin: 0 0.75em;
    /* Reduced margin */
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

/* Individual list item styles */
.column-bar li {
    margin: 6px 0;
    /* Reduced margin */
}

/* Default link and disabled state styles */
.column-bar li a,
.column-bar li .disabled {
    text-decoration: none;
    padding: 10px 12px;
    /* Further reduced padding */
    display: flex;
    align-items: center;
    gap: 6px;
    /* Reduced gap */
    color: var(--color-text-1);
    width: 100%;
    box-sizing: border-box;
    border-radius: 3px;
    /* Reduced border-radius */
    font-size: 0.75rem;
    /* Reduced font size */
    transition: color 0.2s, background-color 0.2s;
}

/* Hover effect for links */
.column-bar li:hover a,
.column-bar li .router-link-exact-active {
    background-color: var(--color-background-2);
    color: var(--color-text-2);
}

/* Icon hover effect */
.column-bar li:hover .icon,
.column-bar li .router-link-exact-active .icon {
    fill: var(--color-text-2);
}

/* Disabled state styling */
.column-bar li .disabled {
    border-radius: 3px;
    background-color: gray;
    cursor: not-allowed;
}

/* Hover effect on disabled links */
.column-bar li:hover .disabled {
    color: red;
    cursor: not-allowed;
}

.column-bar li:hover .disabled .icon {
    fill: rgb(255, 0, 0);
}

/* Icon default styles */
.icon {
    fill: var(--color-text-1);
    transition: fill 0.3s ease;
}

/* Footer styles */
footer {
    padding: 6px;
    /* Further reduced padding */
    text-align: center;
    font-size: 0.75rem;
    /* Reduced font size */
}
</style>
