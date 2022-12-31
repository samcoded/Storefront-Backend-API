import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../app';
import { Order, OrderStore } from '../../models/order';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import dotenv from 'dotenv';

const orderStore = new OrderStore();
dotenv.config();
const request = supertest(app);
const SECRET = process.env.JWTSECRET as Secret;

describe('Test Suite for Orders Handler', () => {
    let token: string,
        order: Order,
        user_id: number,
        product_id: number,
        order_id: number;

    beforeAll(async () => {
        const userData: User = {
            username: 'JakeDoe',
            firstname: 'Jake',
            lastname: 'Doe',
            password: 'password123',
        };
        const productData: Product = {
            name: 'Havells Fan',
            price: 2000,
        };

        const { body } = await request.post('/users/create').send(userData);

        token = body.token;

        // @ts-ignore
        const { user } = jwt.verify(token, SECRET);
        user_id = user.id;

        const { body: productBody } = await request
            .post('/products')
            .set('Authorization', 'bearer ' + token)
            .send(productData);

        product_id = productBody.id;

        order = {
            products: [
                {
                    product_id,
                    quantity: 5,
                },
            ],
            user_id,
            status: 'active',
        };
    });

    afterAll(async () => {
        await request
            .delete(`/users/${user_id}`)
            .set('Authorization', 'bearer ' + token);
        await request
            .delete(`/products/${product_id}`)
            .set('Authorization', 'bearer ' + token);
    });

    it('Authorization should be required on eligible endpoints', async () => {
        let res = await request.post('/orders');
        expect(res.status).toBe(401);
        res = await request.delete(`/orders/1`);
        expect(res.status).toBe(401);
        res = await request.get(`/orders/1`);
        expect(res.status).toBe(401);
        res = await request.put(`/orders/1`);
        expect(res.status).toBe(401);
        res = await request.get(`/orders/current/1`);
        expect(res.status).toBe(401);
        res = await request.get(`/orders/completed/1`);
        expect(res.status).toBe(401);
    });

    it('Should access the create endpoint', (done) => {
        request
            .post('/orders')
            .send(order)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                const { body, status } = res;

                expect(status).toBe(200);

                order_id = body.id;

                done();
            });
    });

    it('Should access the index endpoint', (done) => {
        request
            .get('/orders')
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access the read endpoint', (done) => {
        request
            .get(`/orders/${order_id}`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access the user current order endpoint', (done) => {
        request
            .get(`/orders/current/${user_id}`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access the user completed order endpoint', (done) => {
        request
            .get(`/orders/completed/${user_id}`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access the update endpoint', (done) => {
        const newOrder: Order = {
            products: [
                {
                    product_id,
                    quantity: 200,
                },
            ],
            user_id,
            status: 'complete',
        };
        request
            .put(`/orders/${order_id}`)
            .send(newOrder)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access the delete endpoint', (done) => {
        request
            .delete(`/orders/${order_id}`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });
});
