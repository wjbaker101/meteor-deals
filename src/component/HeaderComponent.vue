<template>
    <div class="header-component container-dark flex">
        <div>
            <h1>
                <router-link to="/">
                    <Logo />
                    <span>Meteor Deals</span>
                </router-link>
            </h1>
        </div>
        <div class="filler"></div>
        <div class="links">
            <router-link to="/guides">
                <BookIcon />
                <span>Guides</span>
            </router-link>
            <router-link :to="userURL">
                <UserIcon />
                <span v-if="user">User</span>
                <span v-else>Login</span>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import { Category } from '@common/model/Category';
    import { Deal } from '@common/model/Deal';
    import { User } from '@common/model/User';

    import { EventService, Event } from '@/service/EventService';

    import HeaderCategoryComponent from '@/component/HeaderCategoryComponent.vue';

    import Logo from '@/assets/logo.svg';
    import BookIcon from '@/assets/icon/book.svg';
    import UserIcon from '@/assets/icon/user.svg';

    @Component({
        components: {
            HeaderCategoryComponent,
            Logo,
            BookIcon,
            UserIcon,
        },
    })
    export default class HeaderComponent extends Vue {

        get user(): User | null {
            return this.$store.state.user;
        }

        get userURL(): string {
            return this.user ? '/user' : '/login';
        }
    }
</script>

<style lang="scss">
    .header-component {
        align-items: center;

        @media screen and (max-width: 50rem) {
            flex-direction: column;

            .links {
                width: 100%;
                overflow-x: auto;
                white-space: nowrap;
            }
        }

        &.container-dark {
            border: 0;
            border-top-right-radius: 0;
            border-top-left-radius: 0;
            border-bottom: 1px solid var(--black-lightest);
        }

        & > * {
            flex: 0 0 auto;
        }

        .filler {
            flex: 1;
        }

        a {
            text-decoration: none;
            color: inherit;

            .svg-logo {
                margin-right: var(--spacing-xsmall);
            }
        }

        .user-section {
            .icon-user {
                margin-right: var(--spacing-xsmall);
            }

            span {
                vertical-align: baseline;
            }

            a {
                transition: color var(--duration);

                &:hover {
                    color: var(--secondary);
                }
            }
        }

        .links {
            a {
                transition: color var(--duration);

                &:hover {
                    color: var(--secondary);
                }

                & + a {
                    margin-left: var(--spacing-mid);
                }

                .svg-icon {
                    margin-right: var(--spacing-xsmall);
                }
            }
        }

        .header-categories {
            padding-top: var(--spacing-small);
        }


        .category {
            align-items: center;
            margin-bottom: var(--spacing-xsmall);

            .category-remove {
                font-size: 1.5rem;
                font-weight: bold;
                line-height: 1em;
                cursor: pointer;
            }
        }

        .user-container {
            .login-button {
                margin-top: var(--spacing-small);
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
