import jwt, { Secret } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWTSECRET as Secret;

export function verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
): void | boolean {
    if (!req.headers.authorization) {
        res.status(401);
        res.json('Access denied, invalid token');
        return false;
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, SECRET);

        next();
    } catch (err) {
        console.error(err);

        res.status(401);
        res.json('Access denied, invalid token');

        return false;
    }
}
