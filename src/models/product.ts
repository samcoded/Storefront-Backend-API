// @ts-ignore
import Client from '../database';

export type Product = {
    id?: number;
    name: string;
    price: number;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'SELECT * FROM products';

            const result = await conn.query(sql);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await Client.connect();

            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }

    async create(b: Product): Promise<Product> {
        try {
            const sql =
                'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
            // @ts-ignore
            const conn = await Client.connect();

            const result = await conn.query(sql, [b.name, b.price]);

            const product = result.rows[0];

            conn.release();

            return product;
        } catch (err) {
            throw new Error(`Could not add new product ${name}. Error: ${err}`);
        }
    }

    async update(id: number, name: string, price: number): Promise<Product> {
        try {
            const sql =
                'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *';
            // @ts-ignore
            const connection = await Client.connect();
            const { rows } = await connection.query(sql, [name, price, id]);
            connection.release();
            return rows[0];
        } catch (err) {
            throw new Error(
                `Could not update product ${name} ${price}. ${err}`
            );
        }
    }

    async delete(id: number): Promise<Product> {
        try {
            const sql = 'DELETE FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await Client.connect();

            const result = await conn.query(sql, [id]);

            const product = result.rows[0];

            conn.release();

            return product;
        } catch (err) {
            throw new Error(`Could not delete product ${id}. Error: ${err}`);
        }
    }
}
