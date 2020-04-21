import admin, { ServiceAccount } from 'firebase-admin';

import firebaseCredentials from '../../common/config/firebase-credentials.json';
import secretConfig from '../../common/config/secret-config.json';

const app = admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials as ServiceAccount),
    ...secretConfig.firebase,
});

const firestore = app.firestore();

export const FirebaseClient = {

    async getCollection(collection: string):
            Promise<admin.firestore.QueryDocumentSnapshot[]> {

        const data = await firestore.collection(collection).get();

        return data.docs;
    },

    async addToCollection(collection: string, value: any): Promise<string> {
        const insert = await firestore.collection(collection).add(value);

        return insert.id;
    }
}
