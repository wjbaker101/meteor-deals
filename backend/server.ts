import express from 'express';
import bodyParser from 'body-parser';
import history from 'connect-history-api-fallback';

import config from '../common/config/config.json';

import { DealRouter } from './router/DealRouter';

const app = express();

app.use(bodyParser.json());
app.use(history());

app.use('/api', DealRouter);

app.use(express.static('./dist/frontend'));

app.listen(config.backend.port, () => {
    console.log(`Started backend on port ${config.backend.port}`);
});
