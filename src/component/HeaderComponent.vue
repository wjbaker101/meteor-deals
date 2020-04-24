<template>
    <div class="header-component container-theme-4 flex">
        <div>
            <h1>
                <router-link to="/">Meteor Deals</router-link>
            </h1>
        </div>
        <div class="container-theme-3">
            <h2>Search</h2>
            <input
                type="text"
                placeholder="Try a food or game"
                v-model="searchText">
        </div>
        <div class="container-theme-3">
            <h2>Category</h2>
            <input
                type="text"
                placeholder="Try 'Freebie' or 'Shopmium'"
                @keyup.enter="onCategoryInputEnter"
                v-model="category">
            <div class="header-categories">
                <HeaderCategoryComponent
                    :key="`category-${category.name}`"
                    v-for="(category, index) in categories"
                    :category="category"
                    :index="index" />
            </div>
        </div>
        <div class="filler"></div>
        <div class="user-container">
            <div v-if="user !== null">
                <router-link to="/user">
                    <UserIcon />{{ user.emailAddress }}
                </router-link>
            </div>
            <div v-else>
                <router-link to="/login">
                    <button class="login-button">Log In</button>
                </router-link>
                <p></p>
                <div class="text-centered">
                    <router-link to="/user/create">Create User</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import { Category } from '@common/model/Category';
    import { User } from '@common/model/User';

    import { EventService, Event } from '@/service/EventService';

    import HeaderCategoryComponent from '@/component/HeaderCategoryComponent.vue';

    import UserIcon from '@/assets/icon/user.svg';

    @Component({
        components: {
            HeaderCategoryComponent,
            UserIcon,
        },
    })
    export default class HeaderComponent extends Vue {

        private category: string = '';

        private emailAddress: string = '';
        private password: string = '';

        private doShowLogIn: boolean = false;

        get user(): User | null {
            return this.$store.state.user;
        }

        get categories(): Category[] {
            return this.$store.state.categories;
        }

        get searchText(): string {
            return this.$store.state.searchText;
        }

        set searchText(searchText: string) {
            this.$store.dispatch('setSearchText', searchText);
        }

        onCategoryInputEnter(e: KeyboardEvent): void {
            if (this.category.length < 3) {
                return;
            }

            if (this.categories.find(c => (
                c.name.toLowerCase() === this.category.toLowerCase()
            ))) {
                return;
            }

            this.$store.dispatch('addCategory', {
                name: this.category,
                isEnabled: true,
            });

            this.category = '';
        }

        onLoginClicked(e: MouseEvent): void {
            if (!this.doShowLogIn) {
                this.doShowLogIn = true;
            }
        }
    }
</script>

<style lang="scss">
    .header-component {
        flex: 0 0 var(--nav-width);
        flex-direction: column;

        &.container-theme-4 {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        & > * {
            flex: 0 0 auto;
            margin-top: 1rem;
        }

        .filler {
            flex: 1;
        }

        h1 a {
            text-decoration: none;
            color: inherit;
        }

        .header-categories {
            padding-top: 1rem;
        }

        .category {
            align-items: center;
            margin-bottom: 0.5rem;

            .category-remove {
                font-size: 1.5rem;
                font-weight: bold;
                line-height: 1em;
                cursor: pointer;
            }
        }

        .user-container {
            .login-button {
                margin-top: 1rem;
            }

            a {
                font-weight: bold;
                color: inherit;
            }

            .icon-user {
                margin-right: var(--spacing-xsmall);
            }
        }
    }
</style>
