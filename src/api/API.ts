import axios from 'axios';

import { DealConverter } from '@/util/DealConverter';

import { Deal } from '@common/model/Deal';

const api = axios.create({
    baseURL: '/api',
});

export const API = {

    async getDeals(): Promise<Deal[] | Error> {
        try {
            const result = await api.get<Deal[]>('/deals');

            return result.data.map(DealConverter.fromAPI);
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async addDeal(deal: Deal): Promise<Deal | Error> {
        try {
            const result = await api.post<Deal>('/deal', deal);

            return DealConverter.fromAPI(result.data);
        }
        catch (exception) {
            return new Error(exception);
        }
    },
}
