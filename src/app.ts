import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRoutes from './handlers/user';
import productRoutes from './handlers/product';
import orderRoutes from './handlers/order';

const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req: Request, res: Response) {
    res.send('Hello, Welcome to the storefront backend API');
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

export default app;
