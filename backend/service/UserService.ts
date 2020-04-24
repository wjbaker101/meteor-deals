import { FirebaseClient } from '../client/FirebaseClient';

import { User } from '../../common/model/User';

export const UserService = {

    async createUser(
            emailAddress: string,
            password: string): Promise<User | Error> {

        try {
            const id = await FirebaseClient.createUser(emailAddress, password);

            const userData = await FirebaseClient.setDoc('users', id, {
                emailAddress,
                categories: [],
                isAdmin: false,
            });

            if (userData) {
                return {
                    id,
                    emailAddress,
                    categories: [],
                    isAdmin: false,
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
                isAdmin: userData.isAdmin,
            }
        }
        catch (exception) {
            return new Error(exception);
        }
    },
}
