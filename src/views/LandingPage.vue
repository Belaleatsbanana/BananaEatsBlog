<script setup lang="ts">
import router from '@/router';
import { ROUTES } from '@/util/constants';


const navigateToLogin = () => {
    router.push({ name: ROUTES.LOGIN.name });
};

const navigateToRegister = () => {
    router.push({ name: ROUTES.REGISTER.name });
};

</script>

<template>
    <!-- Landing Page Wrapper -->
    <div class="landing-page">

        <!-- Header with logo and authentication buttons -->
        <header class="landing-header">
            <div class="landing-logo">
                <img src="../assets/images/Logo.png" alt="Logo" class="landing-logo-img">
                <h3>BananaBlog</h3>
            </div>

            <div class="landing-auth">
                <!-- Navigation to Register and Login pages -->
                <button class="landing-auth-btn" @click="navigateToRegister">Register</button>
                <button class="landing-auth-btn" @click="navigateToLogin">Login</button>
            </div>
        </header>

        <!-- Main section with hero content -->
        <main class="landing-main">
            <section class="landing-hero">
                <img src="../assets/images/Logo.png" alt="Logo">
                <h1>Welcome to BananaBlog</h1>
                <p>Share your thoughts with the world</p>
                <!-- Call to action button -->
                <button class="cta-btn" @click="navigateToRegister">Dive into action!</button>
            </section>
        </main>

        <!-- Footer with copyright -->
        <footer class="landing-footer">
            <p>&copy; BananaBlog 2024 - All Rights Are Not Reserved</p>
        </footer>
    </div>
</template>


<style scoped>
.landing-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.landing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 4rem;
    background-color: #f5f5f5;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.landing-logo {
    display: flex;
    align-items: center;
}

.landing-logo-img {
    width: 50px;
    height: 50px;
    margin-right: 1rem;
}

.landing-auth {
    display: flex;
    gap: 1rem;
}

.landing-auth-btn {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 5px;
    color: var(--color-text-2);
    background-color: var(--color-background-2);
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    letter-spacing: 0.05em;
    transition: all 0.3s;
}

.landing-auth-btn:hover {
    color: var(--color-text-1);
    background-color: var(--color-background-1);
    border: 1px solid var(--color-text-1);
    scale: 1.05;
}

.landing-main {
    flex: 1;
    padding: 4rem 2rem;
    text-align: center;
    background: var(--color-background-1);
}

.landing-hero {
    max-width: 800px;
    margin: 0 auto;
}

.landing-hero h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--color-text-1);
}

.landing-hero p {
    font-size: 1.5rem;
    color: var(--color-text-1);
    margin-bottom: 2rem;
}

.cta-btn {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 900;
    color: var(--color-text-1);
    background-color: var(--color-background-3);
    border: 1px solid var(--color-text-1);
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.cta-btn:hover {
    background-color: var(--color-background-2);
    color: var(--color-text-2);
    border: 1px solid var(--color-text-2);
    scale: 1.05;
}

.landing-footer {
    padding: 2rem 1rem;
    background-color: #2d2d2d;
    color: #fff;
    text-align: center;

}

button {
    font-family: 'Poppins', sans-serif;
    font-weight: 900;
    letter-spacing: 0.05em;
    cursor: pointer;
}
</style>