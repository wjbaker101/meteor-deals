<template>
    <div class="deals-controls-component">
        <div class="open-button" @click="toggleIsOpen()">
            <ButtonComponent :isSecondary="true">
                <FilterIcon />Search &amp; Filter
            </ButtonComponent>
            <div v-if="enabledCategoriesLength > 0">
                <small>
                    <em>({{ enabledCategoriesLengthText }} enabled)</em>
                </small>
            </div>
        </div>
        <div class="controls container-dark flex" v-if="isOpen">
            <div class="search">
                <Label for="input-search-text">Search:</Label>
                <input
                    id="input-search-text"
                    type="text"
                    placeholder="Try a food or game"
                    v-model="searchText"
                >
            </div>
            <div class="filter-options">
                <span>Filter:</span>
                <br>
                <input id="input-is-hot" type="checkbox" v-model="isFilterByHotEnabled">
                <label for="input-is-hot">Show only <strong>Hot</strong> Deals</label>
            </div>
            <div class="categories-input">
                <Label for="input-categories">Categories:</Label>
                <input
                    id="input-categories"
                    type="text"
                    placeholder="Try 'Freebie' or 'Shopmium'"
                    @keyup.enter="onCategoryInputEnter"
                    v-model="category"
                >
                <small><em>Press enter to add a category.</em></small>
            </div>
            <div class="categories-list">
                <HeaderCategoryComponent
                    :key="`category-${category.name}`"
                    v-for="(category, index) in categories"
                    :category="category"
                    :frequency="getCategoryFrequency(category.name)"
                    :index="index" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { Category } from '@common/model/Category';
    import { Deal } from '@common/model/Deal';

    import FilterIcon from '@/assets/icon/filter.svg';
    import ButtonComponent from '@/component/ButtonComponent.vue';
    import HeaderCategoryComponent from '@/component/HeaderCategoryComponent.vue';

    @Component({
        components: {
            FilterIcon,
            ButtonComponent,
            HeaderCategoryComponent,
        },
    })
    export default class DealsControlsComponent extends Vue {

        private isOpen: boolean = false;

        private category: string = '';

        get searchText(): string {
            return this.$store.state.searchText;
        }

        set searchText(searchText: string) {
            this.$store.dispatch('setSearchText', searchText);
        }

        get categories(): Category[] {
            return this.$store.state.categories;
        }

        get isFilterByHotEnabled(): boolean {
            return this.$store.state.isFilterByHotEnabled;
        }

        set isFilterByHotEnabled(isEnabled: boolean) {
            this.$store.dispatch('setIsFilterByHotEnabled', isEnabled);
        }

        get enabledCategoriesLength(): number {
            return this.categories.filter(c => c.isEnabled).length;
        }

        get enabledCategoriesLengthText(): string {
            const text = this.enabledCategoriesLength === 1
                    ? 'category'
                    : 'categories';

            return `${this.enabledCategoriesLength} ${text}`;
        }

        get categoryFrequencies(): Record<string, number> {
            const deals: Deal[] = this.$store.state.deals;

            const frequencies: Record<string, number> = {};

            deals.forEach(deal => {
                deal.categories.forEach(c => {
                    const category = c.toLowerCase();

                    if (category in frequencies) {
                        frequencies[category]++;
                    }
                    else {
                        frequencies[category] = 1;
                    }
                });
            });

            return frequencies;
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

        toggleIsOpen(isOpen: boolean): void {
            if (isOpen === undefined) {
                this.isOpen = !this.isOpen;
            }
            else {
                this.isOpen = isOpen;
            }
        }

        getCategoryFrequency(category: string): number {
            return this.categoryFrequencies[category.toLowerCase()] || 0;
        }
    }
</script>

<style lang="scss">
    .deals-controls-component {

        .open-button {
            display: table;
            margin-left: auto;
            text-align: right;
        }

        .filter-options {
            margin-right: var(--spacing-small);

            @media screen and (max-width: 50rem) {
                width: 100%;
            }
        }

        .search,
        .categories-input {
            width: 350px;
            margin-right: var(--spacing-small);

            @media screen and (max-width: 50rem) {
                width: 100%;
            }
        }

        .controls {
            margin-top: var(--spacing-xsmall);

            @media screen and (max-width: 50rem) {
                flex-direction: column;

                & > * + * {
                    margin-top: var(--spacing-small);
                }
            }
        }

        #input-is-hot + label strong {
            color: var(--secondary);
            text-shadow: 0 1px 5px var(--secondary-glow);
        }
    }
</style>
