import bcrypt from 'bcrypt';
// @ts-ignore
import Client from '../database';

export interface User {
    id?: number;
    username: string;
    firstname?: string;
    lastname?: string;
    password?: string;
    password_digest?: string;
    token?: string;
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            // @ts-ignore
            const connection = await Client.connect();
            const sql = 'SELECT * FROM users';
            const { rows } = await connection.query(sql);
            connection.release();
            return rows;
        } catch (err) {
            throw new Error(`Can not get users. ${err}`);
        }
    }

    async checkUserExist(username: string): Promise<boolean> {
        try {
            const sql = 'SELECT username FROM users WHERE username=($1)';
            // @ts-ignore
            const conn = await Client.connect();
            const { rows } = await conn.query(sql, [username]);

            if (rows.length > 0) {
                return true;
            }
            conn.release();
            return false;
        } catch (err) {
            // throw new Error(`Could not find user ${username}. ${err}`);
            return false;
        }
    }

    async checkUserIdExist(userId: number): Promise<boolean> {
        try {
            const sql = 'SELECT username FROM users WHERE id=($1)';
            // @ts-ignore
            const conn = await Client.connect();
            const { rows } = await conn.query(sql, [userId]);

            if (rows.length > 0) {
                return true;
            }
            conn.release();
            return false;
        } catch (err) {
            // throw new Error(`Could not find user ${userId}. ${err}`);
            return false;
        }
    }

    async create(user: User): Promise<User> {
        const { firstname, lastname, username, password } = user;

        try {
            const sql =
                'INSERT INTO users (firstname, lastname, username, password) VALUES($1, $2, $3, $4) RETURNING *';
            const hash = bcrypt.hashSync(
                (password as string) + process.env.BCRYPT_PASSWORD,
                parseInt(process.env.SALT_ROUNDS as string, 10)
            );
            // @ts-ignore
            const connection = await Client.connect();
            const { rows } = await connection.query(sql, [
                firstname,
                lastname,
                username,
                hash,
            ]);

            connection.release();
            return rows[0];
        } catch (err) {
            throw new Error(
                `Could not add new user ${firstname} ${lastname}. ${err}`
            );
        }
    }

    async read(id: number): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)';
            // @ts-ignore
            const connection = await Client.connect();
            const { rows } = await connection.query(sql, [id]);
            connection.release();
            return rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}. ${err}`);
        }
    }

    async update(
        id: number,
        firstname: string,
        lastname: string
    ): Promise<User> {
        try {
            const sql =
                'UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *';
            // @ts-ignore
            const connection = await Client.connect();
            const { rows } = await connection.query(sql, [
                firstname,
                lastname,
                id,
            ]);
            connection.release();
            return rows[0];
        } catch (err) {
            throw new Error(
                `Could not update user ${firstname} ${lastname}. ${err}`
            );
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const sql = 'DELETE FROM users WHERE id=($1)';
            // @ts-ignore
            const connection = await Client.connect();
            await connection.query(sql, [id]);
            connection.release();
            return true;
        } catch (err) {
            throw new Error(`Could not delete user ${id}. ${err}`);
        }
    }

    async authenticate(
        username: string,
        password: string
    ): Promise<User | null> {
        try {
            const sql = 'SELECT * FROM users WHERE username=($1)';
            // @ts-ignore
            const conn = await Client.connect();
            const { rows } = await conn.query(sql, [username]);

            if (rows.length > 0) {
                const user = rows[0];
                if (
                    bcrypt.compareSync(
                        password + process.env.BCRYPT_PASSWORD,
                        user.password
                    )
                ) {
                    return user;
                }
            }
            conn.release();
            return null;
        } catch (err) {
            throw new Error(`Could not find user ${username}. ${err}`);
        }
    }
}
