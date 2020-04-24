import express, { Request, Response } from 'express';

import { Auth } from '../auth/Auth';
import { DealMapper } from '../mapper/DealMapper';
import { DealService } from '../service/DealService';

const dealRouter = express.Router();

const getDeals = async (request: Request, response: Response) => {
    const data = await DealService.getDeals();

    if (data instanceof Error) {
        response.status(500).send({
            error: 'Unable to load deals.',
        });

        return;
    }

    response.send(data);
};

const addDeal = async (request: Request, response: Response) => {
    const deal = DealMapper.fromRequest(request.body);
    const newDeal = await DealService.addDeal(deal);

    if (newDeal instanceof Error) {
        response.status(500).send({
            error: 'Something went wrong when adding the deal.',
        });

        return;
    }

    response.status(201).send(newDeal);
};


const deleteDeal = async (request: Request, response: Response) => {
    const { id } = request.params;

    const deletion = await DealService.deleteDeal(id);

    if (deletion instanceof Error) {
        response.status(500).send({
            error: 'Something went wrong when deleting the deal.',
        });

        return;
    }

    response.send();
};

dealRouter.get('/deals', getDeals);

dealRouter.post('/deal',
        Auth.requiresAuthorisation,
        Auth.requiresAdmin,
        addDeal);

dealRouter.delete('/deal/:id',
        Auth.requiresAuthorisation,
        Auth.requiresAdmin,
        deleteDeal);

export const DealRouter = dealRouter;
