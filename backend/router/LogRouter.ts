import express, { Request, Response, NextFunction } from 'express';

import { LogUtils } from '../util/LogUtils';

const logRouter = express.Router();

const logIncomingRequests = async (request: Request, response: Response, next: NextFunction) => {
    LogUtils.log(`(${request.method}) ${request.path}`);

    next();
};

logRouter.all('/api*', logIncomingRequests);

export const LogRouter = logRouter;
