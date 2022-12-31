import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../app';
import { Product } from '../../models/product';
import { User } from '../../models/user';
import dotenv from 'dotenv';

dotenv.config();
const request = supertest(app);
const SECRET = process.env.JWTSECRET as Secret;

describe('Test Suite for Products Handler', () => {
    const product: Product = {
        name: 'Havells fan',
        price: 2000,
    };

    let token: string, userId: number, productId: number;

    beforeAll(async () => {
        const userData: User = {
            username: 'JakeDoe',
            firstname: 'Jake',
            lastname: 'Doe',
            password: 'password123',
        };

        const { body } = await request.post('/users/create').send(userData);

        token = body.token;

        // @ts-ignore
        const { user } = jwt.verify(token, SECRET);
        userId = user.id;
    });

    afterAll(async () => {
        await request
            .delete(`/users/${userId}`)
            .set('Authorization', 'bearer ' + token);
    });

    it('Authorization should be required on eligible endpoints', async () => {
        let res = await request.post('/products');
        expect(res.status).toBe(401);

        res = await request.delete(`/products/1`);
        expect(res.status).toBe(401);
    });

    it('Should access the create endpoint', (done) => {
        request
            .post('/products')
            .send(product)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                const { body, status } = res;

                expect(status).toBe(200);
                // console.log(body);SS
                productId = body.id;

                done();
            });
    });

    it('Should access the index endpoint', (done) => {
        request.get('/products').then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });

    it('Should access the show endpoint', (done) => {
        request.get(`/products/${productId}`).then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });

    it('Should access update endpoint', (done) => {
        const newProductData: Product = {
            ...product,
            name: 'Havells fan deluxe',
            price: 2500,
        };

        request
            .put(`/products/${productId}`)
            .send(newProductData)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access the delete endpoint', (done) => {
        request
            .delete(`/products/${productId}`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });
});
