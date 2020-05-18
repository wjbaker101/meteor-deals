import express, { Request, Response } from 'express';

import { AdminService } from '../service/AdminService';
import { Auth } from '../auth/Auth';

const adminRouter = express.Router();

adminRouter.use(Auth.requiresAuthorisation, Auth.requiresAdmin);

const getLatestNotification = async (request: Request, response: Response) => {
    const result = AdminService.getLatestNotification();

    response.send(result);
};

adminRouter.get('/latestNotification', getLatestNotification);

export const AdminRouter = adminRouter;
