import express, { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

const userRouter = express.Router();

export const requiresAuth =
        async (request: Request, response: Response, next: NextFunction) => {

    const { authHeader } = request.headers;

    if (!authHeader) {
        return response.status(401).send();
    }

    if (!(authHeader instanceof String)) {
        return response.status(401).send();
    }

    if (!authHeader.startsWith('Bearer')) {
        return response.status(401).send();
    }

    const split = authHeader.split('Bearer ');

    if (split.length !== 2) {
        return response.status(401).send();
    }

    const token = split[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        request.params = {
            ...request.params,
            uid: decodedToken.uid,
        };

        return next();
    }
    catch (exception) {
        return response.status(401).send();
    }
}

export const UserRouter = userRouter;
