<template>
    <div
        v-if="deal"
        class="deal-component container-theme-2 flex"
        :class="{ 'is-expired': isExpired }"
    >
        <h3>{{ deal.title }}</h3>
        <div>
            <small><strong>{{ daysRemainingText }}</strong></small>
            <br>
            <!-- <small>({{ endDateText }})</small> -->
        </div>
        <p class="description">{{ deal.description }}</p>
        <div class="categories">
            <CategoryComponent
                :key="`${deal.id}-${category.name}`"
                v-for="category in categories"
                :category="category" />
        </div>
        <div class="actions-container flex">
            <div class="url">
                <a :href="deal.url" rel="nofollow noreferrer noopener" target="_blank">
                    <button>Go to Deal</button>
                </a>
            </div>
            <div class="favourite" :class="{ 'is-favourite': isFavourite }" v-if="user !== null">
                <button @click="onFavourite">
                    <HeartIcon />
                </button>
            </div>
        </div>
        <div class="admin-container container-theme-2 flex" v-if="isAdminUser">
            <div class="filler"></div>
            <BinIcon class="delete" @click="onDelete" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { API } from '@/api/API';
    import { DateFormatter } from '@/util/DateFormatter';

    import { Category } from '@common/model/Category';
    import { Deal } from '@common/model/Deal';
    import { User } from '@common/model/User';

    import CategoryComponent from '@/component/CategoryComponent.vue';

    import BinIcon from '@/assets/icon/bin.svg';
    import HeartIcon from '@/assets/icon/heart.svg';

    @Component({
        components: {
            CategoryComponent,
            BinIcon,
            HeartIcon,
        },
    })
    export default class DealComponent extends Vue {

        @Prop({
            required: true,
        })
        private readonly deal!: Deal;

        @Prop({
            default: false,
        })
        private readonly isExpired!: boolean;

        get user(): User | null {
            return this.$store.state.user;
        }

        get isAdminUser(): boolean {
            return this.user !== null && this.user.isAdmin;
        }

        get isFavourite(): boolean {
            if (this.user === null) {
                return false;
            }

            return this.user.favourites.includes(this.deal.id);
        }

        get categories(): Category[] {
            return this.deal.categories
                .sort(this.alphabetical)
                .map(categoryName => ({
                    name: categoryName,
                    isEnabled: false,
                }));
        }

        get daysRemainingText(): string {
            return DateFormatter.getRemainingText(new Date(), this.deal.endDate);
        }

        get endDateText(): string {
            const endDate = DateFormatter.formatDate(this.deal.endDate);

            if (this.deal.endDate.getTime() > Date.now()) {
                return `Ends: ${endDate}`;
            }

            return `Ended: ${endDate}`;
        }

        alphabetical(a: string, b: string): number {
            if (a > b) {
                return 1;
            }

            if (a > b) {
                return -1;
            }

            return 0;
        }

        onDelete(): void {
            this.$emit('delete', this.deal.id);
        }

        async onFavourite(): Promise<void> {
            if (this.user === null) {
                return;
            }

            const result = this.user.favourites.includes(this.deal.id)
                ? await API.removeFavouriteDeal(this.deal.id)
                : await API.favouriteDeal(this.deal.id);

            if (result instanceof Error) {
                return;
            }

            this.user.favourites = result;

            this.$store.dispatch('setUser', this.user);
        }
    }
</script>

<style lang="scss">
    .deal-component {
        flex: 1 0 21%;
        white-space: normal;
        flex-direction: column;

        &.is-expired {
            opacity: 0.4;

            button:hover {
                background-color: var(--theme-3);
                box-shadow: 0 0 8px rgba(34, 34, 34, 0.5) inset;
            }
        }

        & > * {
            flex: 0 0 auto;
        }

        .description {
            flex: 1;
        }

        .actions-container {
            margin: 1rem 0;

            .url {
                flex: 1;
                padding-right: 0.5rem;
            }

            .favourite {
                flex: 0 0 auto;

                &.is-favourite .icon-heart {
                    color: #f11;
                }
            }
        }

        .admin-container {
            padding: var(--spacing-xsmall) var(--spacing-small);

            .filler {
                flex: 1;
            }

            & > * {
                flex: 0 0 auto;
            }

            .delete {
                color: #c11;
                cursor: pointer;
            }
        }
    }
</style>
