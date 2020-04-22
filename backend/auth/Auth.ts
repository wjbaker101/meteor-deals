import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export const Auth = {

    async isAuthenticated(
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
}
