import { Application, Request, Response } from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { Order, OrderProduct, OrderStore } from '../models/order';
import { UserStore } from '../models/user';

const orderStore = new OrderStore();
const userStore = new UserStore();

const index = async (req: Request, res: Response) => {
    try {
        const orders: Order[] = await orderStore.index();
        res.json(orders);
    } catch (err) {
        res.status(500);
        res.json((err as Error).message);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const products = req.body.products as unknown as OrderProduct[];
        const status = req.body.status;
        const user_id = req.body.user_id as unknown as number;

        if (!products)
            return res
                .status(400)
                .send('Parameter: products([{product_id,quantity}]) missing');
        if (!status || !(status == 'active' || status == 'complete'))
            return res
                .status(400)
                .send('Parameter: status (active or complete) missing');
        if (!user_id) return res.status(400).send('Parameter: user_id missing');

        //method check userid exist in db
        const user = await userStore.checkUserIdExist(user_id);
        if (!user) {
            res.status(400);
            res.send('User not found.');
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
        res.json((e as Error).message);
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
        res.send((e as Error).message);
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const products = req.body.products as unknown as OrderProduct[];
        const status = req.body.status;
        const user_id = req.body.user_id as unknown as number;

        if (!id) return res.status(400).send('Parameter: id missing');
        if (!products)
            return res
                .status(400)
                .send('Parameter: products([{product_id,quantity}]) missing');
        if (!status || !(status == 'active' || status == 'complete'))
            return res
                .status(400)
                .send('Parameter: status (active or complete) missing');
        if (!user_id) return res.status(400).send('Parameter: user_id missing');

        const order: Order = await orderStore.update(id, {
            products,
            status,
            user_id,
        });

        res.json(order);
    } catch (e) {
        res.status(400);
        res.json((e as Error).message);
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
        res.status(500);
        res.json((e as Error).message);
    }
};

const getCurrentOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as unknown as number;

        //method check userid exist in db
        const user = await userStore.checkUserIdExist(userId);
        if (!user) {
            res.status(400);
            res.send('User not found.');
            return false;
        }

        const currentOrders = await orderStore.getCurrentOrders(userId);
        res.status(200).json(currentOrders);
    } catch (e) {
        res.status(400).json((e as Error).message);
    }
};

const getCompleteOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as unknown as number;
        //method check userid exist in db
        const user = await userStore.checkUserIdExist(userId);
        if (!user) {
            res.status(400);
            res.send('User not found.');
            return false;
        }
        const completeOrders = await orderStore.getCompleteOrders(userId);
        res.status(200).json(completeOrders);
    } catch (e) {
        res.status(400).json((e as Error).message);
    }
};

export default function orderRoutes(app: Application) {
    app.get('/orders', index);
    app.post('/orders', verifyToken, create);
    app.get('/orders/:id', verifyToken, read);
    app.put('/orders/:id', verifyToken, update);
    app.delete('/orders/:id', verifyToken, destroy);
    app.get('/orders/current/:userId', verifyToken, getCurrentOrders);
    app.get('/orders/completed/:userId', verifyToken, getCompleteOrders);
}
