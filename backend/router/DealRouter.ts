import express, { Request, Response } from 'express';

import { DealMapper } from '../mapper/DealMapper';
import { DealService } from '../service/DealService';

const dealRouter = express.Router();

const getDeals = async (request: Request, response: Response) => {
    const data = await DealService.getDeals();

    response.send(data);
};

const addDeal = async (request: Request, response: Response) => {
    const deal = DealMapper.fromRequest(request.body);
    const newDeal = await DealService.addDeal(deal);

    response.status(201).send(newDeal);
};

dealRouter.get('/deals', getDeals);

dealRouter.post('/deal', addDeal);

export const DealRouter = dealRouter;
