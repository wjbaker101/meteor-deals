<template>
    <div class="deals-view flex">
        <div>
            <h2>Newest Deals</h2>
            <p v-if="newestDeals.length === 0">
                No deals to show yet, make sure to check back later!
            </p>
            <div class="deals-container grid">
                <DealComponent
                    :key="deal.id"
                    v-for="deal in newestDeals"
                    :deal="deal" />
            </div>
        </div>
        <div>
            <h2>Expired Deals</h2>
            <p v-if="expiredDeals.length === 0">
                No deals have expired yet!
            </p>
            <div class="deals-container grid">
                <DealComponent
                    :key="deal.id"
                    v-for="deal in expiredDeals"
                    :deal="deal"
                    :isExpired="true" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import { Deal } from '@common/model/Deal';
    import { Category } from '@/model/Category';

    import { EventService, Event } from '@/service/EventService';

    import DealComponent from '@/component/DealComponent.vue';

    @Component({
        components: {
            DealComponent,
        },
    })
    export default class DealsView extends Vue {

        get searchText(): string {
            return this.$store.state.searchText;
        }

        get categories(): Category[] {
            return this.$store.state.categories;
        }

        get deals(): Deal[] {
            return this.$store.state.deals;
        }

        get filteredDeals(): Deal[] {
            return this.deals
                .filter(this.matchDealWithSearchText)
                .filter(this.matchDealWithCategories);
        }

        get newestDeals(): Deal[] {
            return this.filteredDeals
                .filter(this.dealEndDateFilter(true))
                .sort(this.dealEndDateSort(true));
        }

        get expiredDeals(): Deal[] {
            return this.filteredDeals
                .filter(this.dealEndDateFilter(false))
                .sort(this.dealEndDateSort(false));
        }

        matchDealWithSearchText(deal: Deal): boolean {
            if (this.searchText.length < 3) {
                return true;
            }

            const searchText = this.searchText.toLowerCase();

            if (deal.title.toLowerCase().indexOf(searchText) > -1) {
                return true;
            }

            if (deal.description.toLowerCase().indexOf(searchText) > -1) {
                return true;
            }

            const doCategoriesMatch = deal.categories.some(category => (
                category.toLowerCase().indexOf(searchText) > -1
            ));

            if (doCategoriesMatch) {
                return true;
            }

            return false;
        }

        matchDealWithCategories(deal: Deal): boolean {
            const enabledCategories = this.categories.filter(category => (
                category.isEnabled
            ));

            if (enabledCategories.length === 0) {
                return true;
            }

            return deal.categories.some(dealCategory => (
                enabledCategories.some(category => (
                    category.name.toLowerCase() === dealCategory.toLowerCase()
                ))
            ));
        }

        dealEndDateFilter(isFuture: boolean): (d: Deal) => boolean {
            return (deal: Deal) => {
                return (isFuture && deal.endDate.getTime() > Date.now())
                    || (!isFuture && deal.endDate.getTime() < Date.now());
            }
        }

        dealEndDateSort(isFuture: boolean): (dA: Deal, dB: Deal) => number {
            return (dealA: Deal, dealB: Deal) => {
                if (dealA.endDate.getTime() > dealB.endDate.getTime()) {
                    return isFuture ? 1 : -1;
                }

                if (dealA.endDate.getTime() < dealB.endDate.getTime()) {
                    return isFuture ? -1 : 1;
                }

                return 0;
            }
        }
    }
</script>

<style lang="scss">
    .deals-view {
        flex-direction: column;

        .deals-container {
            grid-template-columns: repeat(4, 1fr);
            padding-bottom: var(--spacing-small);
        }
    }
</style>
