import { ImmortalDB } from 'immortal-db';

import { CacheItem } from '@/model/CacheItem';

const DEFAULT_TIMEOUT = 1000 * 60 * 5;

export const CacheService = {

    async get<T>(key: string, timeout?: number): Promise<T | null> {
        const cache = await ImmortalDB.get(key);

        if (cache === null) {
            return null;
        }

        const result: CacheItem<T> = JSON.parse(cache);

        if (timeout && result.timestamp + timeout < Date.now()) {
            return null;
        }

        return result.value;
    },

    async getRaw<T>(key: string): Promise<CacheItem<T> | null> {
        const cache = await ImmortalDB.get(key);

        if (cache === null) {
            return null;
        }

        const result: CacheItem<T> = JSON.parse(cache);

        return result;
    },

    async set(key: string, value: any): Promise<void> {
        const cache: CacheItem<any> = {
            value,
            timestamp: Date.now(),
        };

        await ImmortalDB.set(key, JSON.stringify(cache));
    },

    async hasExpired(
        key: string,
        timeout: number = DEFAULT_TIMEOUT): Promise<boolean> {

        const cache = await this.getRaw<any>(key);

        return cache === null || cache.timestamp + timeout < Date.now();
    }
}
