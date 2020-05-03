import { Category } from '@common/model/Category';
import { Deal } from '@common/model/Deal';
import { User } from '@common/model/User';
import { NotifierUserSettings } from '@common/model/NotifierUserSettings';

export interface Store {
    searchText: string,
    categories: Category[],
    deals: Deal[] | null,
    user: User | null,
    notifierUserSettings: NotifierUserSettings | null | undefined,
}
