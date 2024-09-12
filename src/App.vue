<script setup lang="ts">
import { computed } from 'vue';
import MainHeader from './components/ui/MainHeader.vue';
import NavigationBar from './components/ui/NavigationBar.vue';
import { useRoute } from 'vue-router';

const router = useRoute();

const showNavbar = computed(() => router.meta.showNavbar);
const showHeader = computed(() => router.meta.showMainHeader);


// Compute dynamic classes based on the visibility of the header and navbar
const mainContentClasses = computed(() => {
  return {
    'with-header': showHeader.value,
    'with-navbar': showNavbar.value,
  };
});

</script>

<template>
  <!-- Header Component -->
  <header v-if="showHeader" class="app-header">
    <MainHeader />
  </header>

  <!-- Navigation Bar Component -->
  <nav v-if="showNavbar">
    <NavigationBar />
  </nav>

  <!-- Main Content Area -->
  <main class="main-content" :class="mainContentClasses">
    <RouterView />
  </main>
</template>

<style scoped>
/* Fix the header to the top */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  background-color: var(--color-background-2);
  color: var(--color-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Navigation Bar should be on the left */
nav {
  position: fixed;
  top: 45px;
  /* Below the header */
  left: 0;
  z-index: 10;
}

/* Main content base styles */
.main-content {
  min-height: 100vh;
  /* Set base height */
  box-sizing: border-box;
  /* Ensure padding is included in height calculation */
}

/* Adjust the main content to avoid overlapping with header and navbar */
.with-header {
  margin-top: 45px;
  /* Adjust based on the header height */
}

.with-navbar {
  margin-left: 160px;
  /* Adjust based on the navbar width */
}
</style>

