<template>
    <div class="login-view flex">
        <div class="login-container container-theme-2">
            <h1>Login</h1>
            <p>
                <label for="input-email-address">Email Address</label>
                <input
                    id="input-email-address"
                    ref="emailAddressInput"
                    type="text"
                    placeholder="todd@example.com"
                    v-model="emailAddress"
                    @keyup.enter="onEmailAddressEnter"
                >
            </p>
            <p>
                <label for="input-password">Password</label>
                <input
                    id="input-password"
                    ref="passwordInput"
                    type="password"
                    v-model="password"
                    @keyup.enter="onPasswordEnter"
                >
            </p>
            <p>
                <ButtonComponent @click="onLoginClicked" :isLoading="isLoading">
                    Log In
                </ButtonComponent>
            </p>
            <ErrorContainerComponent
                v-if="errorMessage"
                :message="errorMessage"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch, Ref } from 'vue-property-decorator';
    import { Route } from 'vue-router';

    import { API } from '@/api/API';
    import { FirebaseClient } from '@/api/FirebaseClient';

    import ButtonComponent from '@/component/ButtonComponent.vue';
    import ErrorContainerComponent from '@/component/ErrorContainerComponent.vue';

    Component.registerHooks([
        'beforeRouteEnter',
    ]);

    @Component({
        components: {
            ButtonComponent,
            ErrorContainerComponent,
        },
    })
    export default class LoginView extends Vue {

        @Ref()
        private readonly emailAddressInput!: HTMLInputElement;

        @Ref()
        private readonly passwordInput!: HTMLInputElement;

        private emailAddress: string = '';
        private password: string = '';

        private errorMessage: string = '';

        private isLoading: boolean = false;

        beforeRouteEnter(
                to: Route,
                from: Route,
                next: any) {

            next((vm: Vue) => {
                if (vm.$store.state.user !== null) {
                    next('/user')
                }
                else {
                    next();
                }
            });
        }

        async onLoginClicked(): Promise<void> {
            if (!this.isValidInput()) {
                return;
            }

            this.isLoading = true;

            const user = await FirebaseClient.login(
                    this.emailAddress,
                    this.password);

            this.isLoading = false;

            if (user instanceof Error) {
                this.errorMessage = 'Invalid credentials, please try again.';
                return;
            }

            const userData = await API.login();

            if (userData instanceof Error) {
                this.errorMessage = 'Sorry, we were unable to log you in. Please try again in a moment.';
                return;
            }

            this.$store.dispatch('setUser', userData);

            this.$router.push({ path: '/user', });
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

            this.errorMessage = '';

            return true;
        }

        onEmailAddressEnter(): void {
            if (this.password.length === 0) {
                this.passwordInput.focus();
                return;
            }

            this.onLoginClicked();
        }

        onPasswordEnter(): void {
            if (this.emailAddress.length === 0) {
                this.emailAddressInput.focus();
                return;
            }

            this.onLoginClicked();
        }
    }
</script>

<style lang="scss">
    .login-view {
        align-items: center;
        justify-content: center;

        .login-container {
            width: 520px;
            max-width: 100%;
            padding: 2rem 1rem;
        }
    }
</style>
