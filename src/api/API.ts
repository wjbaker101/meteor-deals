import axios from 'axios';

import { FirebaseClient } from '@/api/FirebaseClient';
import { DealConverter } from '@/util/DealConverter';

import { Deal } from '@common/model/Deal';
import { User } from '@common/model/User';

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

    async createUser(
            emailAddress: string,
            password: string): Promise<User | Error> {

        try {
            const result = await api.post<User>('/user',
                    {
                        emailAddress,
                        password,
                    });

            return result.data;
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async login(): Promise<User | Error> {
        try {
            const userToken = await FirebaseClient.getUserToken();

            if (!userToken) {
                return new Error('User is not logged in.');
            }

            const result = await api.get<User>('/user/login',
                    {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                        },
                    });

            return result.data;
        }
        catch (exception) {
            return new Error(exception);
        }
    },
}
