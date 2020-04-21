import Vue from 'vue';
import Vuex from 'vuex';

import { API } from '@/api/API';
import { CacheService } from '@/service/CacheService';
import { DealConverter } from '@/util/DealConverter';

import { Category } from '@/model/Category';
import { Deal } from '@common/model/Deal';

Vue.use(Vuex);

const CACHE_CATEGORIES = 'cache_categories';
const CACHE_DEALS = 'cache_deals';

const dealsCacheTimeout = process.env.NODE_ENV !== 'production'
        ? 1000
        : 1000 * 60 * 5;

export const appStore = new Vuex.Store({

    state: {
        searchText: '',
        categories: Array<Category>(),
        deals: Array<Deal>(),
    },

    mutations: {
        async init(state) {
            const categories =
                await CacheService.get<Category[]>(CACHE_CATEGORIES);

            if (categories !== null) {
                state.categories = categories;
            }

            const deals =
                await CacheService.get<Deal[]>(CACHE_DEALS, dealsCacheTimeout);

            if (deals === null) {
                const deals = await API.getDeals();

                if (deals instanceof Error) {
                    return;
                }

                state.deals = deals;

                await CacheService.set(CACHE_DEALS, state.deals);
            }
            else {
                state.deals = deals.map(DealConverter.fromCache);
            }

            appStore.subscribe(async (mutation, state) => {
                await CacheService.set(CACHE_CATEGORIES, state.categories);
            });
        },

        setSearchText(state, searchText: string): void {
            state.searchText = searchText;
        },

        addCategory(state, category: Category): void {
            state.categories.push(category);
        },

        removeCategoryAtIndex(state, index: number): void {
            state.categories.splice(index, 1);
        },

        setDeals(state, deals: Deal[]): void {
            state.deals = deals;
        },

        addDeal(state, deal: Deal): void {
            state.deals.push(deal);
        },
    },

    actions: {
        setSearchText(store, searchText: string): void {
            store.commit('setSearchText', searchText);
        },

        addCategory(store, category: Category): void {
            store.commit('addCategory', category);
        },

        removeCategoryAtIndex(store, index: number): void {
            store.commit('removeCategoryAtIndex', index);
        },

        addDeal(store, deal: Deal): void {
            store.commit('addDeal', deal);
        },
    },
});
