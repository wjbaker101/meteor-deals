import Vue from 'vue';
import Vuex from 'vuex';

import { CacheService } from '@/service/CacheService';
import { API } from '@/api/API';
import { DealConverter } from '@/util/DealConverter';

import { Category } from '@common/model/Category';
import { Deal } from '@common/model/Deal';
import { User } from '@common/model/User';
import { Store } from '@/model/Store';
import { NotifierUserSettings } from '@common/model/NotifierUserSettings';

Vue.use(Vuex);

const CACHE_CATEGORIES = 'cache_categories';
const CACHE_DEALS = 'cache_deals';
const CACHE_USER = 'cache_user';
const CACHE_NOTIFIER_SETTINGS = 'cache_notifier_settings';

const dealsCacheTimeout = process.env.NODE_ENV !== 'production'
        ? 1000
        : 1000 * 60 * 5;

export const initAppStore = async (state: Store) => {
    const user = await CacheService.get<User>(CACHE_USER);

    if (user !== null) {
        state.user = user;
    }
}

export const appStore = new Vuex.Store({

    state: {
        searchText: '',
        categories: Array<Category>(),
        deals: Array<Deal>(),
        user: null,
        notifierUserSettings: undefined,
    } as Store,

    mutations: {
        async init(state) {
            const categories =
                    await CacheService.get<Category[]>(CACHE_CATEGORIES);

            if (categories !== null) {
                state.categories = categories;
            }

            const deals = await CacheService.get<Deal[]>(
                    CACHE_DEALS,
                    dealsCacheTimeout);

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

            const notifierUserSettings =
                    await CacheService.get<NotifierUserSettings>(
                            CACHE_NOTIFIER_SETTINGS);

            if (notifierUserSettings !== null) {
                state.notifierUserSettings = notifierUserSettings;
            }

            appStore.subscribe(async (mutation, state) => {
                switch (mutation.type) {
                    case 'addCategory':
                    case 'removeCategoryAtIndex': {
                        await CacheService.set(
                                CACHE_CATEGORIES,
                                state.categories);
                        break;
                    }

                    case 'addDeal':
                    case 'setDeals': {
                        await CacheService.set(CACHE_DEALS, state.deals);
                        break;
                    }

                    case 'setUser': {
                        await CacheService.set(CACHE_USER, state.user);
                        break;
                    }

                    case 'setNotifierUserSettings': {
                        await CacheService.set(
                                CACHE_NOTIFIER_SETTINGS,
                                state.notifierUserSettings);
                        break;
                    }
                }
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

        setUser(state, user: User): void {
            state.user = user;
        },

        setNotifierUserSettings(state, settings: NotifierUserSettings): void {
            state.notifierUserSettings = settings;
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

        setUser(store, user: User): void {
            store.commit('setUser', user);
        },

        setNotifierUserSettings(store, settings: NotifierUserSettings): void {
            store.commit('setNotifierUserSettings', settings);
        },
    },
});
