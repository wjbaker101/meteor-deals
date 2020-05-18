<template>
    <div class="user-view flex">
        <div class="user-container container-theme-2" v-if="user">
            <h1>User Settings</h1>
            <p>
                <em>{{ user.emailAddress }}</em>
            </p>
            <p v-if="user.isAdmin">
                Go to
                <router-link to="/user/admin">Admin</router-link>
                page.
            </p>
            <hr>
            <p>Change your settings here! Changes are saved automatically.</p>
            <div v-if="user.isAdmin">
                <hr>
                <h2>Deal Settings</h2>
                <p>
                    <router-link to="/deal/create">
                        <button>Create New Deal</button>
                    </router-link>
                </p>
            </div>
            <hr>
            <div v-if="!notifierUserSettings">
                <LoadingComponent message="Loading Notification Settings" />
            </div>
            <div v-if="notifierUserSettings">
                <h2>Notification Settings</h2>
                <p>
                    <input
                        type="checkbox"
                        id="checkbox-notifications-enabled"
                        v-model="isNotifierEnabled"
                    >
                    <label for="checkbox-notifications-enabled">
                        Enable Notifications
                    </label>
                    <br>
                    <small>
                        <em>You'll receive an email every time a new deal is available!</em>
                    </small>
                </p>
                <div :class="{ 'is-disabled': !isNotifierEnabled }">
                    <h3>Categories</h3>
                    <p>You can whitelist and blacklist certain categories, so you only receive notifcations for deals you want to hear about.</p>
                    <div class="flex">
                        <div class="whitelisted">
                            <h4>Whitelisted</h4>
                            <input
                                type="text"
                                @keyup.enter="onAddWhitelistedCategory"
                                v-model="whitelistedCategory"
                                :disabled="!isNotifierEnabled"
                            >
                            <div class="categories">
                                <div
                                    class="category flex"
                                    :key="`whitelisted-category-${c.name}`"
                                    v-for="(c, index) in whitelistedCategories"
                                >
                                    <div>
                                        <CategoryComponent :category="c" />
                                    </div>
                                    <span class="remove" @click="onRemoveWhitelistedCategory(index)">
                                        &times;
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="blacklisted">
                            <h4>Blacklisted</h4>
                            <input
                                type="text"
                                @keyup.enter="onAddBlacklistedCategory"
                                v-model="blacklistedCategory"
                                :disabled="!isNotifierEnabled"
                            >
                            <div class="categories">
                                <div
                                    class="category flex"
                                    :key="`blacklisted-category-${c.name}`"
                                    v-for="(c, index) in blacklistedCategories"
                                >
                                    <div>
                                        <CategoryComponent :category="c" />
                                    </div>
                                    <span class="remove" @click="onRemoveBlacklistedCategory(index)">
                                        &times;
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <hr>
                <button @click="onLogoutClicked">Log Out</button>
                <p v-if="errorMessage">
                    {{ errorMessage }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { Route } from 'vue-router';
    import { User as FirebaseUser } from 'firebase/app';

    import { API } from '@/api/API';
    import { FirebaseClient } from '@/api/FirebaseClient';
    import { EventService, Event } from '@/service/EventService';

    import CategoryComponent from '@/component/CategoryComponent.vue';
    import LoadingComponent from '@/component/LoadingComponent.vue';

    import { Category } from '@common/model/Category';
    import { User } from '@common/model/User';
    import { NotifierUserSettings } from '@common/model/NotifierUserSettings';

    Component.registerHooks([
        'beforeRouteEnter',
    ]);

    @Component({
        components: {
            CategoryComponent,
            LoadingComponent,
        },
    })
    export default class UserView extends Vue {

        private errorMessage: string = '';

        private isNotifierEnabled: boolean = false;

        private whitelistedCategory: string = '';
        private whitelistedCategories: Category[] = [];

        private blacklistedCategory: string = '';
        private blacklistedCategories: Category[] = [];

        get user(): User {
            return this.$store.state.user;
        }

        get notifierUserSettings(): NotifierUserSettings | undefined {
            return this.$store.state.notifierUserSettings;
        }

        async mounted(): Promise<void> {
            if (await FirebaseClient.getUserToken() !== null) {
                await this.loadNotifierSettings();
            }
            else {
                EventService.$on(Event.USER_AVAILABLE, async (user: FirebaseUser | null) => {
                    await this.loadNotifierSettings();
                });
            }
        }

        beforeRouteEnter(
                to: Route,
                from: Route,
                next: any) {

            next((vm: Vue) => {
                if (vm.$store.state.user === null) {
                    next('/login');
                }
                else {
                    next();
                }
            });
        }

        @Watch('isNotifierEnabled')
        async onIsNotifierEnabledChanged(
                isEnabled: boolean,
                wasEnabled: boolean): Promise<void> {

            const settings = {
                isEnabled,
                emailAddress: this.user.emailAddress,
                whitelistedCategories: this.whitelistedCategories.map(c => c.name),
                blacklistedCategories: this.blacklistedCategories.map(c => c.name),
            };

            const result = isEnabled
                    ? await API.enableNotifier(settings)
                    : await API.disableNotifier();

            if (result instanceof Error) {
                return;
            }

            this.$store.dispatch('setNotifierUserSettings', settings);
        }

        async loadNotifierSettings() {
            if (this.notifierUserSettings === undefined) {
                const result = await API.getNotifier();

                if (result instanceof Error) {
                    return;
                }

                if (result === null) {
                    this.$store.dispatch('setNotifierUserSettings', {
                        isEnabled: false,
                        emailAddress: this.user.emailAddress,
                        whitelistedCategories: [],
                        blacklistedCategories: [],
                    });

                    return;
                }

                this.$store.dispatch('setNotifierUserSettings', result);

                this.isNotifierEnabled = result.isEnabled;

                this.whitelistedCategories = result.whitelistedCategories.map(c => ({
                    name: c,
                    isEnabled: false,
                }));

                this.blacklistedCategories = result.blacklistedCategories.map(c => ({
                    name: c,
                    isEnabled: false,
                }));
            }
        }

        async onLogoutClicked(): Promise<void> {
            const status = await FirebaseClient.logout();

            if (status instanceof Error) {
                this.errorMessage = 'Sorry, something went wrong when logging out.';
                return;
            }

            this.errorMessage = '';

            this.$store.dispatch('setUser', null);
            this.$store.dispatch('setNotifierUserSettings', undefined);

            this.$router.push({ path: '/login', });
        }

        async onAddWhitelistedCategory(): Promise<void> {
            if (this.whitelistedCategory.length < 3) {
                return;
            }

            if (this.whitelistedCategories.some(c =>
                c.name.toLowerCase() === this.whitelistedCategory.toLowerCase()
            )) {
                return;
            }

            this.whitelistedCategories.push({
                name: this.whitelistedCategory,
                isEnabled: false,
            });

            this.whitelistedCategory = '';

            const result = await API.enableNotifier({
                isEnabled: this.isNotifierEnabled,
                emailAddress: this.user.emailAddress,
                whitelistedCategories: this.whitelistedCategories.map(c => c.name),
                blacklistedCategories: this.blacklistedCategories.map(c => c.name),
            });

            if (result instanceof Error) {
                return;
            }
        }

        onRemoveWhitelistedCategory(index: number): void {
            this.whitelistedCategories.splice(index, 1);
        }

        async onAddBlacklistedCategory(): Promise<void> {
            if (this.blacklistedCategory.length < 3) {
                return;
            }

            if (this.blacklistedCategories.some(c =>
                c.name.toLowerCase() === this.blacklistedCategory.toLowerCase()
            )) {
                return;
            }

            this.blacklistedCategories.push({
                name: this.blacklistedCategory,
                isEnabled: false,
            });

            this.blacklistedCategory = '';

            const result = await API.enableNotifier({
                isEnabled: this.isNotifierEnabled,
                emailAddress: this.user.emailAddress,
                whitelistedCategories: this.whitelistedCategories.map(c => c.name),
                blacklistedCategories: this.blacklistedCategories.map(c => c.name),
            });

            if (result instanceof Error) {
                return;
            }
        }

        onRemoveBlacklistedCategory(index: number): void {
            this.blacklistedCategories.splice(index, 1);
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
            padding: 2rem 1rem;
        }

        .categories {
            margin-top: 1rem;

            .category {
                margin-top: 0.5rem;
                align-items: center;
            }

            .remove {
                font-size: 1.5rem;
                font-weight: bold;
                line-height: 1em;
                cursor: pointer;
                color: var(--white);
            }
        }

        .whitelisted {
            margin-right: 0.5rem;
        }

        .blacklisted {
            margin-left: 0.5rem;
        }

        .is-disabled {
            opacity: 0.5;
        }
    }
</style>
