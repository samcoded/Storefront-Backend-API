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

        if (!products || typeof status !== 'boolean' || !user_id) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :products([{product_id,quantity}]), :status (true or false), :user_id'
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
        // console.log(e);
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
        res.status(500);
        res.send((e as Error).message);
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const products = req.body.products as unknown as OrderProduct[];
        const status = req.body.status as unknown as boolean;
        const user_id = req.body.user_id as unknown as number;

        if (!products || typeof status !== 'boolean' || !user_id || !id) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :products([{product_id,quantity}]), :status (true or false), :user_id, :id'
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

const destroy = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;

        if (!id) {
            res.status(400);
            res.send('Missing required parameter :id.');
            return false;
        }

        await orderStore.delete(id);

        res.send(`Order with id ${id} successfully deleted.`);
    } catch (e) {
        res.status(400);
        res.json(e);
    }
};

const getCurrentOrders = async (req: Request, res: Response) => {
    try {
        const currentOrders = await orderStore.getCurrentOrders(
            parseInt(req.params.userId as string)
        );
        res.status(200).json(currentOrders);
    } catch (e) {
        res.status(400).json(e);
    }
};

const getCompleteOrders = async (req: Request, res: Response) => {
    try {
        const completeOrders = await orderStore.getCompleteOrders(
            parseInt(req.params.userId as string)
        );
        res.status(200).json(completeOrders);
    } catch (e) {
        res.status(400).json(e);
    }
};

export default function orderRoutes(app: Application) {
    app.get('/orders', index);
    app.post('/orders', verifyToken, create);
    app.get('/orders/:id', verifyToken, read);
    app.put('/orders/:id', verifyToken, update);
    app.delete('/orders/:id', verifyToken, destroy);
    app.get('/orders/current/:userId', verifyToken, getCurrentOrders);
    app.get('/orders/complete/:userId', verifyToken, getCompleteOrders);
}
