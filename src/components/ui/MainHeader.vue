<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DownArrowIcon from '@/components/icons/DownArrowIcon.vue';
import ProfileIcon from '@/components/icons/ProfileIcon.vue';
import RightArrowIcon from '@/components/icons/RightArrowIcon.vue';
import router from '@/router';

import LogoImage from '@/assets/images/Logo.png';
import type { UserBasicInfo } from '@/types';
import { ROUTES } from '@/util/constants';
import { getUser, logoutUser } from '@/api/userApi';
import { useDebounceFn } from '@vueuse/core';

onMounted(() => {

    getUser().then((result) => {

        userInfo.value = result;
    }).catch(() => {

        console.error(localStorage.getItem('BananaBlogToken'));

    });
});

const searchQuery = ref('');
const isDropdownVisible = ref(false);

const userInfo = ref<UserBasicInfo>({
    id: 0,
    name: 'Belal',
});

const toggleDropdown = () => {
    isDropdownVisible.value = !isDropdownVisible.value;
};

const logout = () => {

    logoutUser().then(() => {
        router.push({ name: ROUTES.LOGIN.name });
    });
};

const handleSearch = useDebounceFn(() => {
    const query = searchQuery.value.trim();

    if (query) {
        router.push({ name: ROUTES.SEARCH_RESULTS.name, query: { q: query } });
    }
}, 500);
</script>

<template>
    <header class="blog-header">
        <div class="blog-logo">
            <img :src="LogoImage" alt="Blog Logo" class="blog-logo-img" />
            <h5>BananaBlog</h5>
        </div>

        <div class="search-bar">
            <input v-model="searchQuery" placeholder="Search for blogs" @input="handleSearch" />
        </div>

        <div class="profile-section" @click="toggleDropdown">
            <ProfileIcon />
            <span class="username">{{ userInfo.name }}</span>
            <DownArrowIcon v-show="isDropdownVisible" />
            <RightArrowIcon v-show="!isDropdownVisible" />

            <div v-if="isDropdownVisible" class="dropdown-menu">
                <ul>
                    <li><router-link to="/login" @click="logout">Logout</router-link></li>
                </ul>
            </div>
        </div>
    </header>
</template>

<style scoped>
.blog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    /* Reduced padding */
    width: 100%;
    background-color: var(--color-background-2);
}

.blog-logo {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    /* Reduced gap */
}

.blog-logo-img {
    width: 25px;
    /* Reduced size */
    height: 25px;
    /* Reduced size */
}

.blog-logo h5 {
    font-size: 0.875rem;
    /* Reduced font size */
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    /* Reduced gap */
}

.search-bar input {
    padding: 0.25rem;
    /* Reduced padding */
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.875rem;
    /* Reduced font size */
    width: 400px;
    /* Reduced width */
    transition: border-color 0.3s;
}

.search-bar input:focus {
    outline: none;
    border-color: var(--color-text-1);
}

.profile-section {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    /* Reduced gap */
    position: relative;
    cursor: pointer;
    padding: 0.25rem;
    /* Reduced padding */
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    border-radius: 6px;
    /* Reduced border-radius */
}

.profile-section svg {
    fill: var(--color-text-2);
}

.profile-section:hover {
    background-color: var(--color-muted);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* Slightly reduced shadow */
}

.username {
    font-size: 0.875rem;
    /* Reduced font size */
    font-weight: 500;
    color: var(--color-text-2);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--color-background-3);
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* Slightly reduced shadow */
    padding: 8px;
    /* Reduced padding */
    z-index: 100;
}

.dropdown-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.dropdown-menu li {
    margin: 4px 0;
    /* Reduced margin */
}

.dropdown-menu li a {
    text-decoration: none;
    color: var(--color-text-1);
}

.dropdown-menu li a:hover {
    color: var(--color-background-2);
}
</style>
