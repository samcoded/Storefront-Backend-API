import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app: express.Application = express();

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!');
});

export default app;
