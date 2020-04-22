import { FirebaseClient } from '../client/FirebaseClient';
import { DealMapper } from '../mapper/DealMapper';

import { Deal } from '../../common/model/Deal';

export const DealService = {

    async getDeals(): Promise<Deal[] | Error> {
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
        try {
            const id = await FirebaseClient.addToCollection('deals', deal);

            return {
                ...deal,
                id,
            }
        }
        catch (exception) {
            return new Error(exception);
        }
    }
}
