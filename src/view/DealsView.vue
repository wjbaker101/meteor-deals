<template>
    <div class="deals-view flex">
        <DealsControlsComponent />
        <div>
            <h2>Newest Deals ({{ newestDeals.length }})</h2>
            <LoadingComponent v-if="isDealsLoading" message="Loading deals..." />
            <ErrorContainerComponent
                v-else-if="deals === null"
                message="Sorry, we were unable to get deals. Please try again in a moment."
            />
            <div v-else>
                <p v-if="newestDeals.length === 0">
                    No deals to show yet, make sure to check back later!
                </p>
                <div class="deals-container grid">
                    <DealComponent
                        :key="deal.id"
                        v-for="deal in newestDeals"
                        :deal="deal"
                        @delete="onShowModal" />
                </div>
            </div>
        </div>
        <div>
            <h2>Expired Deals ({{ expiredDeals.length }})</h2>
            <p v-if="deals !== null && !isDealsLoading && expiredDeals.length === 0">
                No deals have expired yet!
            </p>
            <div
                v-else-if="deals !== null && !isDealsLoading"
                class="deals-container grid"
            >
                <DealComponent
                    :key="deal.id"
                    v-for="deal in expiredDeals"
                    :deal="deal"
                    :isExpired="true"
                    @delete="onShowModal" />
            </div>
        </div>
        <ModalComponent :id="modalDeleteID">
            <h2>Delete this deal?</h2>
            <p>Are you sure you want to delete this deal?</p>
            <p>The deal will not be recoverable afterwards.</p>
            <p>
                <ButtonComponent @click="onDeleteDeal">Delete</ButtonComponent>
            </p>
            <p>
                <ButtonComponent @click="onCancelModal" :isSecondary="true">Cancel</ButtonComponent>
            </p>
        </ModalComponent>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import { Deal } from '@common/model/Deal';
    import { Category } from '@common/model/Category';

    import { API } from '@/api/API';
    import { DealService } from '@/service/DealService';
    import { EventService, Event } from '@/service/EventService';

    import ButtonComponent from '@/component/ButtonComponent.vue';
    import DealComponent from '@/component/DealComponent.vue';
    import DealsControlsComponent from '@/component/DealsControlsComponent.vue';
    import LoadingComponent from '@/component/LoadingComponent.vue';
    import ModalComponent from '@/component/ModalComponent.vue';
    import ErrorContainerComponent from '@/component/ErrorContainerComponent.vue';

    @Component({
        components: {
            ButtonComponent,
            DealComponent,
            DealsControlsComponent,
            LoadingComponent,
            ModalComponent,
            ErrorContainerComponent,
        },
    })
    export default class DealsView extends Vue {

        private readonly modalDeleteID: string = 'modal_delete_id';

        private isDealsLoading: boolean = true;

        private dealIDToDelete: string | null = null;
        private doShowDeleteModal: boolean = false;

        get searchText(): string {
            return this.$store.state.searchText;
        }

        get categories(): Category[] {
            return this.$store.state.categories;
        }

        get isFilterByHotEnabled(): boolean {
            return this.$store.state.isFilterByHotEnabled;
        }

        get deals(): Deal[] | null {
            return this.$store.state.deals;
        }

        get filteredDeals(): Deal[] {
            if (this.deals === null) {
                return [];
            }

            return this.deals
                .filter(this.matchDealWithIsHot)
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

        async mounted(): Promise<void> {
            this.isDealsLoading = true;

            await DealService.initDeals();

            this.isDealsLoading = false;
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

        matchDealWithIsHot(deal: Deal): boolean {
            this.isFilterByHotEnabled;
            return !this.isFilterByHotEnabled
                    || (this.isFilterByHotEnabled && deal.isHot);
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

        onShowModal(dealID: string): void {
            this.dealIDToDelete = dealID;

            EventService.$emit(Event.MODAL_SHOW, this.modalDeleteID);
        }

        onCancelModal(): void {
            EventService.$emit(Event.MODAL_HIDE, this.modalDeleteID);
        }

        async onDeleteDeal(): Promise<void> {
            if (this.dealIDToDelete === null) {
                EventService.$emit(Event.MODAL_HIDE, this.modalDeleteID);
                return;
            }

            try {
                await API.deleteDeal(this.dealIDToDelete);
            }
            catch (exception) {
                return;
            }

            const deals: Deal[] = this.$store.state.deals;

            const deleteIndex = deals.findIndex(d => (
                d.id === this.dealIDToDelete
            ));

            deals.splice(deleteIndex, 1);

            this.dealIDToDelete = null;
            EventService.$emit(Event.MODAL_HIDE, this.modalDeleteID);
        }
    }
</script>

<style lang="scss">
    .deals-view {
        flex-direction: column;

        .deals-container {
            grid-template-columns: repeat(4, 1fr);
            padding-bottom: var(--spacing-small);

            @media only screen and (max-width: 70rem) {
                grid-template-columns: repeat(2, 1fr);
            }

            @media only screen and (max-width: 50rem) {
                grid-template-columns: repeat(1, 1fr);
            }
        }
    }
</style>
