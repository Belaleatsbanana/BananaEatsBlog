<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import MainHeader from './components/ui/MainHeader.vue';
import NavigationBar from './components/ui/NavigationBar.vue';
import { useRoute } from 'vue-router';
import SnackBar from './components/ui/SnackBar.vue';

const router = useRoute();

const showNavbar = computed(() => router.meta.showNavbar);
const showHeader = computed(() => router.meta.showMainHeader);

const mainContentClasses = computed(() => {
  return {
    'with-header': showHeader.value,
    'with-navbar': showNavbar.value,
  };
});

// Manage multiple snackbars
const snackbars = ref<{ id: number; message: string; success: boolean }[]>([]);
let snackbarId = 0;

const triggerSnackbar = (message: string, success: boolean = false) => {
  snackbars.value.push({ id: ++snackbarId, message, success });
  setTimeout(() => {
    snackbars.value.shift(); // Remove the first snackbar
  }, 3000); // Adjust timeout as needed
};

const hideSnackbar = (id: number) => {
  snackbars.value = snackbars.value.filter(snackbar => snackbar.id !== id);
};

// Provide the `triggerSnackbar` function to child components
provide('triggerSnackbar', triggerSnackbar);
</script>


<template>
  <!-- Header Component -->
  <header v-if="showHeader" class="app-header">
    <MainHeader />

    <!-- SnackBars -->
    <div v-for="snackbar in snackbars" :key="snackbar.id">
      <SnackBar :message="snackbar.message" :visible="true" :success="snackbar.success"
        @hide="() => hideSnackbar(snackbar.id)" />
    </div>
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
  left: 0;
  z-index: 10;
}

/* Main content base styles */
.main-content {
  min-height: 100vh;
  box-sizing: border-box;
}

.with-header {
  margin-top: 45px;
}

.with-navbar {
  margin-left: 160px;
}
</style>
