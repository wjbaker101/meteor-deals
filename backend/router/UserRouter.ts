import express, { Request, Response, NextFunction } from 'express';

import { UserService } from '../service/UserService';
import { Auth } from '../auth/Auth';
import { LogUtils } from '../util/LogUtils';
import { NotifierService } from '../service/NotifierService';
import { NotifierUserSettings } from '../../common/model/NotifierUserSettings';

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

const getUserNotifierSettings = async (
        request: Request,
        response: Response) => {

    const { uid: userID } = response.locals;

    const result = await NotifierService.getUserNotifierSettings(userID);

    if (result instanceof Error) {
        response.status(500).send({
            error: `Something went wrong when getting user's notifier.`,
        });

        return;
    }

    response.send({
        result,
    });
};

const setUserInNotifier = async (request: Request, response: Response) => {
    const settings: NotifierUserSettings = request.body;
    const { uid: userID } = response.locals;

    const result = await NotifierService.setUserInNotifier(userID, settings);

    if (result instanceof Error) {
        response.status(500).send({
            error: `Something went wrong when setting user's notifier.`,
        });

        return;
    }

    response.send();
};

const removeUserFromNotifier = async (request: Request, response: Response) => {
    const { uid: userID } = response.locals;

    const result = await NotifierService.removeUserFromNotifier(userID);

    if (result instanceof Error) {
        response.status(500).send({
            error: `Something went wrong when removing user's notifier.`,
        });

        return;
    }

    response.send();
};

userRouter.post('/user', createUser);

userRouter.get('/user/login', Auth.requiresAuthorisation, login);

userRouter.post('/user/favourite/:id',
        Auth.requiresAuthorisation,
        favouriteDeal);

userRouter.delete('/user/favourite/:id',
        Auth.requiresAuthorisation,
        removeFavouriteDeal);

userRouter.get('/user/notifier',
        Auth.requiresAuthorisation,
        getUserNotifierSettings);

userRouter.post('/user/notifier',
        Auth.requiresAuthorisation,
        setUserInNotifier);

userRouter.delete('/user/notifier',
        Auth.requiresAuthorisation,
        removeUserFromNotifier);

export const UserRouter = userRouter;
