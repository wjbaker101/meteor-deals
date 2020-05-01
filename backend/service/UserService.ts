import { FirebaseClient } from '../client/FirebaseClient';
import { LogUtils } from '../util/LogUtils';

import { User } from '../../common/model/User';
import { Category } from '../../common/model/Category';

export const UserService = {

    async createUser(
            emailAddress: string,
            password: string): Promise<User | Error> {

        LogUtils.log('UserService.createUser');

        try {
            const id = await FirebaseClient.createUser(emailAddress, password);

            const newUser = {
                emailAddress,
                categories: Array<Category>(),
                favourites: Array<string>(),
                isAdmin: false,
            };

            const userData = await FirebaseClient.setDoc('users', id, newUser);

            if (userData) {
                return {
                    ...newUser,
                    id,
                }
            }
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async getUser(id: string): Promise<User | Error> {
        LogUtils.log('UserService.getUser');

        try {
            const userData = await FirebaseClient.getDoc('users', id);

            return {
                id,
                emailAddress: userData.emailAddress,
                categories: userData.categories,
                favourites: userData.favourites,
                isAdmin: userData.isAdmin,
            }
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async favouriteDeal(userID: string, id: string): Promise<string[] | Error> {
        LogUtils.log('UserService.favouriteDeal');

        try {
            const user = await UserService.getUser(userID);

            if (user instanceof Error) {
                throw user;
            }

            const { favourites } = user;

            if (favourites.includes(id)) {
                return favourites;
            }

            favourites.push(id);

            await FirebaseClient.updateDoc('users', userID, {
                favourites,
            });

            return favourites;
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async removeFavouriteDeal(
            userID: string,
            id: string): Promise<string[] | Error> {

        LogUtils.log('UserService.removeFavouriteDeal');

        try {
            const user = await UserService.getUser(userID);

            if (user instanceof Error) {
                throw user;
            }

            const { favourites } = user;

            const deleteIndex = favourites.indexOf(id);

            favourites.splice(deleteIndex, 1);

            await FirebaseClient.updateDoc('users', userID, {
                favourites,
            });

            return favourites;
        }
        catch (exception) {
            return new Error(exception);
        }
    },
}
