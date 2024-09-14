<script setup lang="ts">
import { inject, ref } from 'vue';
import router from '@/router';
import { ROUTES } from '@/util/constants';
import type { UserRegister } from '@/types';
import { registerUser } from '@/api/userApi';
import EyeOpenedIcon from '@/components/icons/EyeOpenedIcon.vue';
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue';

// Inject the `triggerSnackbar` function from the App.vue
const triggerSnackbar = inject('triggerSnackbar') as (message: string, success?: boolean) => void;


const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const unprocessedEmail = ref('');
const unprocessedName = ref('');
const unprocessedPassword = ref('');
const unprocessedConfirmPassword = ref('');


// Eye icons for password and confirm password visibility toggle
const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
};

const handleSignup = () => {

    // reset error messages
    unprocessedEmail.value = '';
    unprocessedName.value = '';
    unprocessedPassword.value = '';
    unprocessedConfirmPassword.value = '';

    const user: UserRegister = {
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: confirmPassword.value,
    };

    registerUser(user)
        .then(() => {
            const lastRoute = localStorage.getItem('lastRoute');

            if (lastRoute) {
                localStorage.removeItem('lastRoute');
                router.push(lastRoute);
            } else {
                router.push({ name: ROUTES.HOME.name });
            }

            triggerSnackbar('Account created successfully', true);
        })
        .catch((err) => {
            if (err.response.status === 422) {

                if (err.response.data.errors.email) {
                    unprocessedEmail.value = err.response.data.errors.email[0];
                }
                if (err.response.data.errors.name) {
                    unprocessedName.value = err.response.data.errors.name[0];
                }
                if (err.response.data.errors.password.length > 1) {
                    unprocessedPassword.value = err.response.data.errors.password[1];
                    unprocessedConfirmPassword.value = err.response.data.errors.password[0];
                } else {
                    if (err.response.data.errors.password[0].includes('confirmation')) {
                        unprocessedConfirmPassword.value = err.response.data.errors.password[0];
                    }
                    else {
                        unprocessedPassword.value = err.response.data.errors.password[0];
                    }

                }

                // reset input fields if data is invalid
                name.value = '';
                email.value = '';
                password.value = '';
                confirmPassword.value = '';

            }
        });

};

const navigateToLogin = () => {
    router.push({ name: ROUTES.LOGIN.name });
};

</script>


<template>
    <main>
        <div class="welcome-container">
            <img src="../assets/images/Logo.png" alt="logo" />
            <h1>Welcome to BananaBlog!</h1>
            <p class="welcome-message">
                Create an account to start writing your own blog posts, share your experiences,
                express your creativity, or connect with others.
            </p>

            <div class="login-alignment">
                <p>Already have an account?</p>
                <!-- Navigation to login page -->
                <button class="login-button" @click="navigateToLogin">Login</button>
            </div>
        </div>

        <div class="signup-container">
            <h2>Create Account</h2>

            <!-- Signup form -->
            <form class="signup-form" @submit.prevent>

                <!-- Name Input Field -->
                <div class="input-group">
                    <span class="unprocessed" v-if="unprocessedName">{{ unprocessedName }}</span>
                    <input type="text" name="name" placeholder="Enter Your Name" v-model="name" />
                </div>

                <!-- Email Input Field -->
                <div class="input-group">
                    <span class="unprocessed" v-if="unprocessedEmail">{{ unprocessedEmail }}</span>
                    <input type="email" name="email" placeholder="Enter Your Email" v-model="email" />
                </div>

                <!-- Password Input Field with toggle -->
                <div class="input-group password-group">
                    <span class="unprocessed" v-if="unprocessedPassword">{{ unprocessedPassword }}</span>
                    <div class="password-input">
                        <input :type="showPassword ? 'text' : 'password'" name="password"
                            placeholder="Enter Your Password" v-model="password" />
                        <span class="toggle-password" @click="togglePassword">
                            <component :is="showPassword ? EyeOpenedIcon : EyeClosedIcon" />
                        </span>
                    </div>
                </div>

                <!-- Confirm Password Input Field with toggle -->
                <div class="input-group password-group">
                    <span class="unprocessed" v-if="unprocessedConfirmPassword">{{ unprocessedConfirmPassword }}</span>
                    <div class="password-input">
                        <input :type="showConfirmPassword ? 'text' : 'password'" name="confirmPassword"
                            placeholder="Confirm Your Password" v-model="confirmPassword" />
                        <span class="toggle-password" @click="toggleConfirmPassword">
                            <component :is="showConfirmPassword ? EyeOpenedIcon : EyeClosedIcon" />
                        </span>
                    </div>
                </div>

                <!-- Signup Button -->
                <button type="submit" class="signup-button" @click="handleSignup">Sign Up</button>
            </form>
        </div>
    </main>
</template>


<style scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--color-background-1);
}

.welcome-container {
    width: 40%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    background-color: var(--color-background-3);
}

.welcome-message {
    margin-top: 20px;
    width: 80%;
    font-size: 1em;
    color: var(--color-text-1);
    margin-bottom: 20px;
}

.signup-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-background-1);
    padding: 40px;
    border-radius: 15px;
    margin: auto;
    text-align: center;
    width: 40%;
}

h2 {
    font-size: 24px;
    color: var(--color-text-1);
    margin-bottom: 20px;
}

.signup-form {
    width: 100%;
}

.unprocessed {
    color: red;
    font-size: 0.8em;
    min-height: 0.5em;
    /* Adjust this value to match the height of your error messages */
    display: flex;
    align-items: center;
}

.input-group {
    position: relative;
    margin-bottom: 20px;
    text-align: left;
    min-height: 3em;
    /* Adjust this value based on the height of your input fields and the unprocessed message */
}

input {
    width: 100%;
    height: 50px;
    padding: 30px 15px;
    border-radius: 15px;
    border: 1px solid var(--color-background-1);
    color: var(--color-text-1);
    background-color: var(--color-background-1);
    font-size: 16px;
    box-sizing: border-box;
    outline: none;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}

input::placeholder {
    font-family: 'Poppins', sans-serif;
    text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1);
    font-weight: 500;
    color: var(--color-text-1);
}

input:active,
input:focus {
    border-color: var(--color-background-2);
}

.password-input {
    position: relative;
}

.toggle-password {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
}

.signup-button {
    width: 60%;
    height: 50px;
    padding: 10px 15px;
    border-radius: 15px;
    background-color: var(--color-background-1);
    border: none;
    color: var(--color-text-1);
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}

.signup-button:hover {
    background-color: #b8d0f6;
}

.login-alignment {
    gap: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.login-button {
    height: 50px;
    padding: 10px 15px;
    border-radius: 15px;
    background-color: var(--color-background-1);
    border: none;
    color: var(--color-text-1);
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}

.login-button:hover {
    background-color: #b8d0f6;
}
</style>
