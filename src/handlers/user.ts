import { Application, Request, Response } from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { generateToken } from '../utils/generateToken';
import { User, UserStore } from '../models/user';

const userStore = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        const users: User[] = await userStore.getUser();
        res.json(users);
    } catch (err) {
        res.status(400).json(err);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const firstname = req.body.firstname as unknown as string;
        const lastname = req.body.lastname as unknown as string;
        const username = req.body.username as unknown as string;
        const password = req.body.password as unknown as string;

        if (!firstname || !lastname || !username || !password) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :firstName, :lastName, :userName, :password'
            );
            return false;
        }
        const user: User = await userStore.create({
            firstname,
            lastname,
            username,
            password,
        });

        //generate token and send it back to the user
        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};

const read = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        if (!id) {
            return res.status(400).send('Missing required parameter :id.');
        }
        const user: User = await userStore.read(id);
        res.json(user);
    } catch (e) {
        res.status(400);
        res.json(e);
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const firstname = req.body.firstname as unknown as string;
        const lastname = req.body.lastname as unknown as string;
        if (!firstname || !lastname || !id) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :firstName, :lastName, :id'
            );
            return false;
        }
        const user: User = await userStore.update(id, firstname, lastname);
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        if (!id) {
            res.status(400).send('Missing required parameter :id.');
            return false;
        }
        await userStore.deleteUser(id);
        res.send(`User with id ${id} successfully deleted.`);
    } catch (err) {
        res.status(400).json(err);
    }
};

const authenticate = async (req: Request, res: Response) => {
    try {
        const username =
            (req.body.username as unknown as string) || 'ChrissAnne';
        const password =
            (req.body.password as unknown as string) || 'password123';
        if (!username || !password) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :username, :password'
            );
            return false;
        }
        const user: User | null = await userStore.authenticate(
            username,
            password
        );
        if (!user) {
            return res.status(401).send(`Wrong password for user ${username}.`);
        }
        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        res.status(400).json(err);
    }
};

export default function userRoutes(app: Application) {
    app.get('/users', verifyToken, index);
    app.post('/users/create', create);
    app.get('/users/:id', verifyToken, read);
    app.put('/users/:id', verifyToken, update);
    app.delete('/users/:id', verifyToken, deleteUser);
    app.post('/users/authenticate', authenticate);
}
