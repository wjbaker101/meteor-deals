import { Category } from './Category';

export interface User {
    id: string,
    emailAddress: string,
    categories: Category[],
}
