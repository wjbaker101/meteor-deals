import { FirebaseClient } from '../client/FirebaseClient';

import { User } from '../../common/model/User';

export const UserService = {

    async createUser(
            emailAddress: string,
            password: string): Promise<User | Error> {

        try {
            const id = await FirebaseClient.createUser(emailAddress, password);

            const newUser = {
                emailAddress,
                categories: [],
                favourites: [],
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
