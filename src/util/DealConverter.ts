import { Deal } from '@common/model/Deal';

export const DealConverter = {

    fromAPI(deal: any): Deal {
        return {
            ...deal,
            startDate: new Date(deal.startDate),
            endDate: new Date(deal.endDate),
        }
    },

    fromCache(deal: any): Deal {
        return {
            ...deal,
            startDate: new Date(deal.startDate),
            endDate: new Date(deal.endDate),
        }
    },
}
