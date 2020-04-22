<template>
    <div class="user-create-view flex">
        <div class="user-create-container container-theme-2">
            <h1>Create User</h1>
            <label>
                <span>Email Address</span>
                <input
                    ref="emailAddressInput"
                    type="text"
                    placeholder="todd@example.com"
                    v-model="emailAddress"
                    @keyup.enter="onEmailAddressEnter"
                >
            </label>
            <p></p>
            <label>
                <span>Password</span>
                <input
                    ref="passwordInput"
                    type="password"
                    v-model="password"
                    @keyup.enter="onPasswordEnter"
                >
            </label>
            <p></p>
            <label>
                <span>Confirm Password</span>
                <input
                    ref="passwordConfirmInput"
                    type="password"
                    v-model="passwordConfirm"
                    @keyup.enter="onPasswordConfirmEnter"
                >
            </label>
            <p></p>
            <button @click="onCreateClicked">Submit</button>
            <p v-if="errorMessage">
                {{ errorMessage }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import { API } from '@/api/API';
    import { FirebaseClient } from '@/api/FirebaseClient';

    @Component({
        components: {
        },
    })
    export default class LoginView extends Vue {

        private emailAddress: string = '';
        private password: string = '';
        private passwordConfirm: string = '';

        private errorMessage: string = '';

        get emailAddressInput(): HTMLInputElement {
            return this.$refs.emailAddressInput as HTMLInputElement;
        }

        get passwordInput(): HTMLInputElement {
            return this.$refs.passwordInput as HTMLInputElement;
        }

        get passwordConfirmInput(): HTMLInputElement {
            return this.$refs.passwordConfirmInput as HTMLInputElement;
        }

        async onCreateClicked(): Promise<void> {
            if (!this.isValidInput()) {
                return;
            }

            const user = await API.createUser(
                    this.emailAddress,
                    this.password);

            if (user instanceof Error) {
                return;
            }

            this.$router.push({ path: '/login', });
        }

        isValidInput(): boolean {
            if (this.emailAddress.length === 0) {
                this.errorMessage = 'Please enter your email address.';
                return false;
            }

            if (this.emailAddress.indexOf('@') < 1 || this.emailAddress.lastIndexOf('@') === this.emailAddress.length - 1) {
                this.errorMessage = 'The email address is not in the correct format.';
                return false;
            }

            if (this.password.length === 0) {
                this.errorMessage = 'Please enter your password.';
                return false;
            }

            if (this.passwordConfirm.length === 0) {
                this.errorMessage = 'Please confirm your password.';
                return false;
            }

            if (this.password !== this.passwordConfirm) {
                this.errorMessage = 'Passwords do not match.';
                return false;
            }

            this.errorMessage = '';

            return true;
        }

        onEmailAddressEnter(): void {
            if (this.password.length === 0) {
                this.passwordInput.focus();
                return;
            }

            if (this.passwordConfirm.length === 0) {
                this.passwordConfirmInput.focus();
                return;
            }

            this.onCreateClicked();
        }

        onPasswordEnter(): void {
            if (this.passwordConfirm.length === 0) {
                this.passwordConfirmInput.focus();
                return;
            }

            if (this.emailAddress.length === 0) {
                this.emailAddressInput.focus();
                return;
            }

            this.onCreateClicked();
        }

        onPasswordConfirmEnter(): void {
            if (this.emailAddress.length === 0) {
                this.emailAddressInput.focus();
                return;
            }

            if (this.password.length === 0) {
                this.passwordInput.focus();
                return;
            }

            this.onCreateClicked();
        }
    }
</script>

<style lang="scss">
    .user-create-view {
        align-items: center;
        justify-content: center;

        .user-create-container {
            width: 520px;
            max-width: 100%;
            padding: 2rem 1rem;
        }
    }
</style>
