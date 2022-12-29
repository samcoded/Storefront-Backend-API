import { Application, Request, Response } from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { Order, OrderProduct, OrderStore } from '../models/order';

const orderStore = new OrderStore();

const index = async (req: Request, res: Response) => {
    try {
        const orders: Order[] = await orderStore.index();
        res.json(orders);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const products = req.body.products as unknown as OrderProduct[];
        const status = req.body.status as unknown as boolean;
        const user_id = req.body.user_id as unknown as number;

        if (!products || !status || !user_id) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :products, :status, :user_id'
            );
            return false;
        }

        const order: Order = await orderStore.create({
            products,
            status,
            user_id,
        });

        res.json(order);
    } catch (e) {
        res.status(400);
        res.json(e);
    }
};

const read = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;

        if (!id) {
            res.status(400);
            res.send('Missing required parameter :id.');
            return false;
        }

        const order: Order = await orderStore.read(id);
        res.json(order);
    } catch (e) {
        res.status(400);
        res.json(e);
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const products = req.body.products as unknown as OrderProduct[];
        const status = req.body.status as unknown as boolean;
        const user_id = req.body.user_id as unknown as number;

        if (!products || !status || !user_id || !id) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :products, :status, :user_id, :id'
            );
            return false;
        }

        const order: Order = await orderStore.update(id, {
            products,
            status,
            user_id,
        });

        res.json(order);
    } catch (e) {
        res.status(400);
        res.json(e);
    }
};

const deleteOrder = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;

        if (!id) {
            res.status(400);
            res.send('Missing required parameter :id.');
            return false;
        }

        await orderStore.deleteOrder(id);

        res.send(`Order with id ${id} successfully deleted.`);
    } catch (e) {
        res.status(400);
        res.json(e);
    }
};

export default function orderRoutes(app: Application) {
    app.get('/orders', index);
    app.post('/orders/create', verifyToken, create);
    app.get('/orders/:id', verifyToken, read);
    app.put('/orders/:id', verifyToken, update);
    app.delete('/orders/:id', verifyToken, deleteOrder);
}
