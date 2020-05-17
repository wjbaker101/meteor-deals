<template>
    <div class="new-deal-view flex">
        <div class="new-deal-container container-theme-2 flex">
            <h1>Create a New Deal</h1>
            <div>
                <label>
                    <span>Title</span>
                    <input type="text" v-model="title">
                </label>
            </div>
            <div>
                <label>
                    <span>Start Date</span>
                    <div class="date-time-container flex">
                        <div class="date">
                            <input type="date" v-model="startDateInput">
                        </div>
                        <div class="time">
                            <input type="time" v-model="startTimeInput">
                        </div>
                    </div>
                    <span>End Date</span>
                    <div class="date-time-container flex">
                        <div class="date">
                            <input type="date" v-model="endDateInput">
                        </div>
                        <div class="time">
                            <input type="time" v-model="endTimeInput">
                        </div>
                    </div>
                </label>
            </div>
            <div>
                <label>
                    <span>Description</span>
                    <textarea v-model="description"></textarea>
                </label>
            </div>
            <div>
                <label>
                    <span>Categories</span>
                    <input
                        type="text"
                        @keyup.enter="onAddCategory"
                        v-model="category"
                    >
                    <div class="categories">
                        <div
                            class="category flex"
                            :key="`new-category-${c.name}`"
                            v-for="(c, index) in categories"
                        >
                            <div>
                                <CategoryComponent :category="c" />
                            </div>
                            <span class="remove" @click="onRemoveCategory(index)">
                                &times;
                            </span>
                        </div>
                    </div>
                </label>
            </div>
            <div>
                <label>
                    <span>URL</span>
                    <input type="text" v-model="url">
                </label>
            </div>
            <hr>
            <h2>Deal Properties</h2>
            <div>
                <input id="input-is-hot" type="checkbox" v-model="isHot">
                <label for="input-is-hot">
                    Mark as <strong class="text-is-hot">Hot</strong> Deal
                </label>
            </div>
            <hr>
            <div>Make sure all fields have been completed.</div>
            <div>
                <ButtonComponent @click="onSubmit" :isLoading="isLoading">
                    Submit
                </ButtonComponent>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import { API } from '@/api/API';
    import { DateFormatter } from '@/util/DateFormatter';

    import { Category } from '@common/model/Category';

    import ButtonComponent from '@/component/ButtonComponent.vue';
    import DealComponent from '@/component/DealComponent.vue';
    import CategoryComponent from '@/component/CategoryComponent.vue';

    @Component({
        components: {
            ButtonComponent,
            DealComponent,
            CategoryComponent,
        },
    })
    export default class NewDealView extends Vue {

        private category: string = '';
        private startDateInput: string = new Date().toISOString().slice(0,10);
        private startTimeInput: string = `${new Date().getHours()}:00`;
        private endDateInput: string = new Date().toISOString().slice(0,10);
        private endTimeInput: string = `${new Date().getHours()}:00`;

        private title: string = '';
        private description: string = '';
        private isHot: boolean = false;
        private categories: Category[] = [];
        private url: string = '';

        private readonly nowDate: string = DateFormatter.getDateAsInputValue();
        private readonly nowTime: string = DateFormatter.getTimeAsInputValue();

        private isLoading: boolean = false;

        get startDate(): Date {
            const [ year, month, date ] = this.startDateInput.split('-');
            const [ hours, minutes ] = this.startTimeInput.split(':');

            return new Date(
                Number(year),
                Number(month) - 1,
                Number(date),
                Number(hours),
                Number(minutes));
        }

        get endDate(): Date {
            const [ year, month, date ] = this.endDateInput.split('-');
            const [ hours, minutes ] = this.endTimeInput.split(':');

            return new Date(
                Number(year),
                Number(month) - 1,
                Number(date),
                Number(hours),
                Number(minutes));
        }

        onAddCategory(e: KeyboardEvent): void {
            if (this.category.length < 3) {
                return;
            }

            if (this.categories.find(c => (
                c.name.toLowerCase() === this.category.toLowerCase()
            ))) {
                return;
            }

            this.categories.push({
                name: this.category,
                isEnabled: false,
            });

            this.category = '';
        }

        onRemoveCategory(index: number): void {
            this.categories.splice(index, 1);
        }

        async onSubmit(): Promise<void> {
            if (!this.isSubmissionValid()) {
                return;
            }

            this.isLoading = true;

            const newDeal = await API.addDeal({
                id: '',
                title: this.title,
                startDate: this.startDate,
                endDate: this.endDate,
                description: this.description,
                categories: this.categories.map(c => c.name),
                url: this.url,
                isHot: this.isHot,
            });

            this.isLoading = false;

            if (newDeal instanceof Error) {
                return;
            }

            this.$store.dispatch('addDeal', newDeal);
            this.$router.push({ path: '/', });
        }

        isSubmissionValid(): boolean {
            if (this.title.length < 3) {
                console.log('title');
                return false;
            }

            if (this.description.length < 3) {
                console.log('description');
                return false;
            }

            if (this.categories.length === 0) {
                console.log('categories');
                return false;
            }

            if (this.url.length < 3) {
                console.log('url');
                return false;
            }

            if (!DateFormatter.isValidDate(this.startDate)) {
                console.log('startDate');
                return false;
            }

            if (!DateFormatter.isValidDate(this.endDate)) {
                console.log('endDate');
                return false;
            }

            if (this.startDate.getTime() > this.endDate.getTime()) {
                console.log('startDate > endDate');
                return false;
            }

            return true;
        }
    }
</script>

<style lang="scss">
    .new-deal-view {
        flex-direction: column;

        &::after {
            content: '';
            display: table;
            height: 1rem;
        }

        .new-deal-container {
            width: 450px;
            max-width: 100%;
            padding: 2rem 1rem;
            display: table;
            margin: auto;

            .text-is-hot {
                color: var(--secondary);
                text-shadow: 0 1px 5px var(--secondary-glow);
            }

            & > div + div {
                margin-top: var(--spacing-mid);
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

            .date-time-container {
                .date {
                    padding-right: 0.5rem;
                    flex: 1 0 65%;
                }

                .time {
                    flex: 1 0 35%;
                }
            }
        }
    }
</style>
