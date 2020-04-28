import express, { Request, Response, NextFunction } from 'express';

import { UserService } from '../service/UserService';
import { Auth } from '../auth/Auth';
import { LogUtils } from '../util/LogUtils';

const userRouter = express.Router();

const createUser = async (request: Request, response: Response) => {
    const { emailAddress, password } = request.body;

    const user = await UserService.createUser(emailAddress, password);

    if (user instanceof Error) {
        LogUtils.log(user.message);

        response.status(500).send({
            error: 'Something went wrong when creating the user.',
        });

        return;
    }

    response.status(201).send(user);
};

const login = async (request: Request, response: Response) => {
    const uid = response.locals.uid;

    const user = await UserService.getUser(uid);

    if (user instanceof Error) {
        response.status(500).send({
            error: 'Something went wrong when logging in.',
        });

        return;
    }

    response.send(user);
};

const favouriteDeal = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { uid: userID } = response.locals;

    const favourites = await UserService.favouriteDeal(userID, id);

    if (favourites instanceof Error) {
        response.status(500).send({
            error: `Something went wrong when favouriting deal (id=${id}).`,
        });

        return;
    }

    response.send(favourites);
};

const removeFavouriteDeal = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { uid: userID } = response.locals;

    const favourites = await UserService.removeFavouriteDeal(userID, id);

    if (favourites instanceof Error) {
        response.status(500).send({
            error: `Something went wrong when removing favourite deal (id=${id}).`,
        });

        return;
    }

    response.send(favourites);
};

userRouter.post('/user', createUser);

userRouter.get('/user/login', Auth.requiresAuthorisation, login);

userRouter.post('/user/favourite/:id',
        Auth.requiresAuthorisation,
        favouriteDeal);

userRouter.delete('/user/favourite/:id',
        Auth.requiresAuthorisation,
        removeFavouriteDeal);

export const UserRouter = userRouter;
