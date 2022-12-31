import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../app';
import { User } from '../../models/user';
import dotenv from 'dotenv';

dotenv.config();

const request = supertest(app);
const SECRET = process.env.JWTSECRET as Secret;

describe('Test Suite for Users Handler', () => {
    const userData: User = {
        username: 'JakeDoe',
        firstname: 'Jake',
        lastname: 'Doe',
        password: 'password123',
    };

    let token: string;
    let userId: number = 1;

    it('Authorization should be required on eligible endpoints', async () => {
        let res = await request.get('/users');
        expect(res.status).toBe(401);

        res = await request.get(`/users/${userId}`);
        expect(res.status).toBe(401);

        res = await request.put(`/users/${userId}`).send({
            firstName: userData.firstname + 'test',
            lastName: userData.lastname + 'test',
        });

        expect(res.status).toBe(401);

        res = await request.delete(`/users/${userId}`);
        expect(res.status).toBe(401);
    });

    it('Should access the create endpoint', async () => {
        const res = await request.post('/users/create').send(userData);

        const { body, status } = res;
        token = body.token;
        // @ts-ignore
        const { user } = jwt.verify(token, SECRET);
        userId = user.id;

        expect(status).toBe(200);
    });

    it('Should access the index endpoint', (done) => {
        request
            .get('/users')
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access read endpoint', (done) => {
        request
            .get(`/users/${userId}`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access update endpoint', (done) => {
        const newUserData: User = {
            ...userData,
            firstname: 'Paul',
            lastname: 'Rock',
        };

        request
            .put(`/users/${userId}`)
            .send(newUserData)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access auth endpoint with correct password and log in user', (done) => {
        request
            .post('/users/auth')
            .send({
                username: userData.username,
                password: userData.password,
            })
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('Should access auth endpoint with wrong password and get an error', (done) => {
        request
            .post('/users/auth')
            .send({
                username: userData.username,
                password: 'wrongpw',
            })
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(401);
                done();
            });
    });

    it('Should access the delete endpoint', (done) => {
        request
            .delete(`/users/${userId}`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });
});
