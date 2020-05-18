import fs from 'fs';
import path from 'path';

interface CacheItem<T> {
    timestamp: number,
    timeout: number,
    value: T,
}

const CACHE_FILE_NAME = path.join(__dirname, '../', 'data.cache');

const readCacheFromFile = (): Record<string, CacheItem<any>> | Error => {
    try {
        const file = fs.readFileSync(CACHE_FILE_NAME, 'utf8');

        return JSON.parse(file);
    }
    catch (exception) {
        return new Error(exception);
    }
};

const writeToFile = (): void | Error => {
    try {
        fs.writeFileSync(CACHE_FILE_NAME, JSON.stringify(cache));
    }
    catch (exception) {
        return new Error(exception);
    }
};

const fileCache = readCacheFromFile();

const cache: Record<string, CacheItem<any>>
        = (fileCache instanceof Error) ? {} : fileCache;

export const CacheService = {

    get<T>(key: string): T | null {
        if (!(key in cache)) {
            return null;
        }

        const result: CacheItem<T> = cache[key];

        if (result.timeout !== -1 &&
                result.timestamp + result.timeout < Date.now()) {

            return null;
        }

        return result.value;
    },

    set(key: string, value: any, timeout = -1): void {
        cache[key] = {
            timestamp: Date.now(),
            timeout,
            value,
        };

        (async () => {
            writeToFile();
        })();
    },
}
