import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

import { UserService } from '../service/UserService';

export const Auth = {

    async requiresAuthorisation(
            request: Request,
            response: Response,
            next: NextFunction): Promise<Response | void> {

        const { authorization } = request.headers;

        if (!authorization) {
            return response.status(401).send();
        }

        if (!authorization.startsWith('Bearer')) {
            return response.status(401).send();
        }

        const split = authorization.split('Bearer ');

        if (split.length !== 2) {
            return response.status(401).send();
        }

        const token = split[1];

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);

            response.locals = {
                ...response.locals,
                uid: decodedToken.uid,
            };

            return next();
        }
        catch (exception) {
            return response.status(401).send();
        }
    },

    async requiresAdmin(
            request: Request,
            response: Response,
            next: NextFunction): Promise<Response | void> {

        if (!response.locals.uid) {
            return response.status(401).send();
        }

        try {
            const user = await UserService.getUser(response.locals.uid);

            if (user instanceof Error) {
                return response.status(500).send();
            }

            if (!user.isAdmin) {
                return response.status(401).send();
            }

            response.locals.user = {
                ...response.locals,
                user,
            };

            return next();
        }
        catch (exception) {
            return response.status(401).send();
        }
    },
}
