<template>
    <div class="user-view flex">
        <div class="user-container container-theme-2">
            <h1>User Settings</h1>
            <button @click="onLogoutClicked">Log Out</button>
            <p v-if="errorMessage">
                {{ errorMessage }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import { FirebaseClient } from '@/api/FirebaseClient';

    @Component({
        components: {},
    })
    export default class UserView extends Vue {

        private errorMessage: string = '';

        async onLogoutClicked(): Promise<void> {
            const status = await FirebaseClient.logout();

            if (status instanceof Error) {
                this.errorMessage = 'Sorry, something went wrong when logging out.';
                return;
            }

            this.errorMessage = '';

            this.$store.dispatch('setUser', null);

            this.$router.push({ path: '/login', });
        }
    }
</script>

<style lang="scss">
    .user-view {
        align-items: center;
        justify-content: center;

        .user-container {
            width: 520px;
            max-width: 100%;
        }
    }
</style>
