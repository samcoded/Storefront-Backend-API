import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/user';

const SECRET = process.env.TOKEN_SECRET as Secret;

export function generateToken(user: User) {
    return jwt.sign({ user }, SECRET);
}
