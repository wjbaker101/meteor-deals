import axios from 'axios';

import { FirebaseClient } from '@/api/FirebaseClient';
import { DealConverter } from '@/util/DealConverter';

import { Deal } from '@common/model/Deal';
import { NotifierUserSettings } from '@common/model/NotifierUserSettings';
import { NotifierResult } from '@common/model/NotifierResult';
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
            const userToken = await FirebaseClient.getUserToken();

            if (userToken === null) {
                return new Error('User is not logged in.');
            }

            const result = await api.post<Deal>('/deal', deal,
                    {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                        },
                    });

            return DealConverter.fromAPI(result.data);
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async deleteDeal(id: string): Promise<boolean | Error> {
        try {
            const userToken = await FirebaseClient.getUserToken();

            if (userToken === null) {
                return new Error('User is not logged in.');
            }

            await api.delete(`/deal/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                        },
                    });

            return true;
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

            if (userToken === null) {
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

    async favouriteDeal(id: string): Promise<string[] | Error> {
        try {
            const userToken = await FirebaseClient.getUserToken();

            if (userToken === null) {
                return new Error('User is not logged in.');
            }

            const result = await api.post<string[]>(`/user/favourite/${id}`, {},
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

    async removeFavouriteDeal(id: string): Promise<string[] | Error> {
        try {
            const userToken = await FirebaseClient.getUserToken();

            if (userToken === null) {
                return new Error('User is not logged in.');
            }

            const result = await api.delete<string[]>(`/user/favourite/${id}`,
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

    async getNotifier() {
        try {
            const userToken = await FirebaseClient.getUserToken();

            if (userToken === null) {
                return new Error('User is not logged in.');
            }

            interface APIResponse {
                result: NotifierUserSettings,
            }

            const result = await api.get<APIResponse>('/user/notifier',
                    {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                        },
                    });

            return result.data.result;
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async enableNotifier(settings: NotifierUserSettings) {
        try {
            const userToken = await FirebaseClient.getUserToken();

            if (userToken === null) {
                return new Error('User is not logged in.');
            }

            const result = await api.post<void>('/user/notifier', settings,
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

    async disableNotifier() {
        try {
            const userToken = await FirebaseClient.getUserToken();

            if (userToken === null) {
                return new Error('User is not logged in.');
            }

            const result = await api.delete<void>('/user/notifier',
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

    async getLatestNotification(): Promise<NotifierResult | Error> {
        try {
            const userToken = await FirebaseClient.getUserToken();

            if (userToken === null) {
                return new Error('User is not logged in.');
            }

            const result = await api.get<NotifierResult>('/admin/latestNotification',
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
