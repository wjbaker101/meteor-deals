import firebase from 'firebase/app';
import 'firebase/auth';

import secretConfig from '../../common/config/secret-config.json';

import { User } from '@common/model/User';

const app = firebase.initializeApp(secretConfig.firebase);
const auth = app.auth();

export const FirebaseClient = {

    async login(emailAddress: string, password: string): Promise<string | Error> {
        try {
            const userCredentials = await auth.signInWithEmailAndPassword(
                    emailAddress,
                    password);

            if (!userCredentials
                    || userCredentials.user === null
                    || userCredentials.user.email === null) {

                return new Error('Unable to log in.');
            }

            return userCredentials.user.uid;
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async logout(): Promise<boolean | Error> {
        try {
            await auth.signOut();
            return true;
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    getCurrentUser(): User | null {
        if (auth.currentUser === null) {
            return null;
        }

        if (auth.currentUser.email === null) {
            return null;
        }

        return {
            id: auth.currentUser.uid,
            emailAddress: auth.currentUser.email,
            categories: [],
        }
    },

    async getUserToken(): Promise<string | undefined > {
        return await auth.currentUser?.getIdToken();
    },
}
