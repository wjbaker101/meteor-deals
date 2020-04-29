import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import history from 'connect-history-api-fallback';

import config from '../common/config/config.json';

import { LogUtils } from './util/LogUtils';

import { DealRouter } from './router/DealRouter';
import { UserRouter } from './router/UserRouter';
import { LogRouter } from './router/LogRouter';

const app = express();

app.use(bodyParser.json());

app.use(LogRouter);
app.use('/api', DealRouter);
app.use('/api', UserRouter);

app.use(history());

app.use(express.static(path.join(__dirname, '../../dist/frontend')));

app.listen(config.backend.port, () => {
    LogUtils.log(`Started backend on port ${config.backend.port}`);
});
