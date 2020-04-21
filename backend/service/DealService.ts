import { FirebaseClient } from '../client/FirebaseClient';
import { DealMapper } from '../mapper/DealMapper';

import { Deal } from '../../common/model/Deal';

export const DealService = {

    async getDeals(): Promise<Deal[]> {
        const data = await FirebaseClient.getCollection('deals');

        return data.map(doc => DealMapper.fromFirestore(doc.id, doc.data()))
    },

    async addDeal(deal: Deal): Promise<Deal> {
        const id = await FirebaseClient.addToCollection('deals', deal);

        return {
            ...deal,
            id,
        }
    }
}
