import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import userRoutes from './handlers/user';
import productRoutes from './handlers/product';
import orderRoutes from './handlers/order';

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!');
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

export default app;
