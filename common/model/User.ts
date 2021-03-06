import { Category } from './Category';

export interface User {

    // Unique ID of the user, generated by Firestore.
    id: string,

    // The email address the user signed up with.
    emailAddress: string,

    // A list of categories associated with the user.
    // (Unused)
    categories: Category[],

    // A list of deal IDs that represent deals saved by the user.
    favourites: string[],

    // Whether or not the user has elevated privileges.
    isAdmin: boolean,
}
