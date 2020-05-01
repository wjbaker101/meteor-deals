import { FirebaseClient } from '../client/FirebaseClient';
import { DealMapper } from '../mapper/DealMapper';
import { LogUtils } from '../util/LogUtils';

import { Deal } from '../../common/model/Deal';
import { NotifierService } from './NotifierService';

export const DealService = {

    async getDeals(): Promise<Deal[] | Error> {
        LogUtils.log('DealService.getDeals');

        try {
            const data = await FirebaseClient.getCollection('deals');

            return data.map(doc => (
                DealMapper.fromFirestore(doc.id, doc.data())
            ));
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async addDeal(deal: Deal): Promise<Deal | Error> {
        LogUtils.log('DealService.addDeal');

        try {
            const id = await FirebaseClient.addToCollection('deals', deal);

            const newDeal = {
                ...deal,
                id,
            };

            (async () => {
                await NotifierService.notifyUsers(newDeal);
            })();

            return newDeal;
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async deleteDeal(id: string): Promise<boolean | Error> {
        LogUtils.log('DealService.deleteDeal');

        try {
            await FirebaseClient.deleteDoc('deals', id);

            return true;
        }
        catch (exception) {
            return new Error(exception);
        }
    },
}
