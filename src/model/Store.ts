import { Category } from '@common/model/Category';
import { Deal } from '@common/model/Deal';
import { User } from '@common/model/User';

export interface Store {
    searchText: string,
    categories: Category[],
    deals: Deal[],
    user: User | null,
}
