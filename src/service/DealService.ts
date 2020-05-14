import { appStore } from '@/store/appStore';

import { API } from '@/api/API';
import { CacheService } from '@/service/CacheService';
import { DealConverter } from '@/util/DealConverter';

import { Deal } from '@common/model/Deal';

const CACHE_DEALS = 'cache_deals';

const timeout = process.env.NODE_ENV !== 'production'
        ? 1000
        : 1000 * 60 * 2;

export const DealService = {

    async initDeals(): Promise<Deal[] | null> {
        const cache = await CacheService.get<Deal[]>(CACHE_DEALS, timeout);
        const appStoreDeals = appStore.state.deals;

        if (cache === null) {
            const response = await API.getDeals();

            if (response instanceof Error) {
                appStore.dispatch('setDeals', null);
                return null;
            }

            appStore.dispatch('setDeals', response);

            return response;
        }

        const cachedDeals = cache.map(DealConverter.fromCache);

        if (appStoreDeals === null) {
            appStore.dispatch('setDeals', cachedDeals);
        }

        return cachedDeals;
    },
}
