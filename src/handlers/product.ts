import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyToken } from '../middlewares/verifyToken';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    const products = await store.index();
    res.json(products);
};

const show = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        if (!id) {
            return res.status(400).send('Missing required parameter :id.');
        }
        const product: Product = await store.show(id);
        res.json(product);
    } catch (e) {
        res.status(400);
        res.json(e);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const name = req.body.name;
        const price = req.body.price;
        const product: Product = {
            name,
            price,
        };
        if (!name || !price) {
            res.status(400);
            res.send('Some required parameters are missing! eg. :name, :price');
            return false;
        }
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const name = req.body.name as unknown as string;
        const price = req.body.price as unknown as number;
        if (!name || !price || !id) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :name, :price, :id'
            );
            return false;
        }
        const product: Product = await store.update(id, name, price);
        res.json(product);
    } catch (err) {
        res.status(400).json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        if (!id) {
            res.status(400).send('Missing required parameter :id.');
            return false;
        }
        await store.delete(id);
        res.send(`Product with id ${id} successfully deleted.`);
    } catch (err) {
        res.status(400).json(err);
    }
};

const productRoutes = (app: express.Application) => {
    app.get('/products', index);
    app.post('/products', verifyToken, create);
    app.get('/products/:id', show);
    app.put('/products/:id', verifyToken, update);
    app.delete('/products/:id', verifyToken, destroy);
};

export default productRoutes;
