import { Deal } from '../../common/model/Deal';

export const DealMapper = {

    fromFirestore(id: string, deal: any): Deal {
        return {
            ...deal,
            id,
            startDate: deal.startDate.toDate(),
            endDate: deal.endDate.toDate(),
        }
    },

    fromRequest(deal: any): Deal {
        return {
            ...deal,
            startDate: new Date(deal.startDate),
            endDate: new Date(deal.endDate),
        }
    },
}
