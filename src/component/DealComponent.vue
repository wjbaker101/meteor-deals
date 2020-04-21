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
        <p>
            <a :href="deal.url" rel="nofollow noreferrer noopener" target="_blank">
                <button>Go to Deal</button>
            </a>
        </p>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { DateFormatter } from '@/util/DateFormatter';

    import { Category } from '@/model/Category';
    import { Deal } from '@common/model/Deal';

    import CategoryComponent from '@/component/CategoryComponent.vue';

    @Component({
        components: {
            CategoryComponent,
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
    }
</style>
