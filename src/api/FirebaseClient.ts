import firebase, { User } from 'firebase/app';
import 'firebase/auth';

import secretConfig from '../../common/config/secret-config.json';
import { EventService, Event } from '@/service/EventService';

const app = firebase.initializeApp(secretConfig.firebase);
const auth = app.auth();

export const FirebaseClient = {

    onAuthStateChanged(user: User | null): void {
        if (user) {
            EventService.$emit(Event.USER_AVAILABLE, user);
        }
    },

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

    async getUserToken(): Promise<string | null> {
        const user = auth.currentUser;

        try {
            if (!user) {
                return null;
            }

            return await user.getIdToken();
        }
        catch (exception) {
            return null;
        }

    },
}

auth.onAuthStateChanged(FirebaseClient.onAuthStateChanged);
