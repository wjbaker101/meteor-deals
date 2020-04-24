import admin, { ServiceAccount } from 'firebase-admin';

import firebaseCredentials from '../../common/config/firebase-credentials.json';
import secretConfig from '../../common/config/secret-config.json';

const app = admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials as ServiceAccount),
    ...secretConfig.firebase,
});

const firestore = app.firestore();
const auth = app.auth();

export const FirebaseClient = {

    async getCollection(collection: string):
            Promise<admin.firestore.QueryDocumentSnapshot[]> {

        const data = await firestore.collection(collection).get();

        return data.docs;
    },

    async addToCollection(collection: string, value: Object): Promise<string> {
        const insert = await firestore.collection(collection).add(value);

        return insert.id;
    },

    async setDoc(
            collection: string,
            doc: string,
            value: Object): Promise<boolean> {

        await firestore.collection(collection).doc(doc).set(value);

        return true;
    },

    async getDoc(collection: string, doc: string): Promise<any> {
        const result = await firestore.collection(collection).doc(doc).get();

        return result.data();
    },

    async deleteDoc(collection: string, doc: string): Promise<void> {
        await firestore.collection(collection).doc(doc).delete();
    },

    async createUser(emailAddress: string, password: string): Promise<string> {
        const user = await auth.createUser({
            email: emailAddress,
            password,
        });

        return user.uid;
    },
}
