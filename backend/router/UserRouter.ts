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
        LogUtils.log(user.message);

        response.status(500).send({
            error: 'Something went wrong when logging in.',
        });

        return;
    }

    response.send(user);
};

userRouter.post('/user', createUser);

userRouter.get('/user/login', Auth.isAuthenticated, login);

export const UserRouter = userRouter;
