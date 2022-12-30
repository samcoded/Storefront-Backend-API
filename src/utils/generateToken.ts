import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWTSECRET as Secret;

export function generateToken(user: User) {
    return jwt.sign({ user }, SECRET);
}
