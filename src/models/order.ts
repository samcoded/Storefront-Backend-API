// @ts-ignore
import Client from '../database';
import { Product, ProductStore } from '../models/product';

export interface OrderProduct {
    product_id: number;
    quantity: number;
    name?: string;
    price?: number;
}

export interface Order {
    id?: number;
    products: OrderProduct[];
    user_id: number;
    status: boolean;
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            // @ts-ignore
            const connection = await Client.connect();
            const sql = 'SELECT * FROM orders';

            const { rows } = await connection.query(sql);

            const orderProductsSql =
                'SELECT product_id, quantity, name, price FROM order_products JOIN products ON order_products.product_id=products.id WHERE order_id=($1)';
            const orders = [];

            for (const order of rows) {
                const { rows: orderProductRows } = await connection.query(
                    orderProductsSql,
                    [order.id]
                );
                orders.push({
                    ...order,
                    products: orderProductRows,
                });
            }

            connection.release();

            return orders;
        } catch (err) {
            throw new Error(`Could not get orders. ${err}`);
        }
    }

    async create(order: Order): Promise<Order> {
        const { products, status, user_id } = order;

        try {
            const sql =
                'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
            // @ts-ignore
            const connection = await Client.connect();
            const { rows } = await connection.query(sql, [user_id, status]);
            const order = rows[0];

            const orderProductsSql =
                'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity';
            const orderProducts = [];

            for (const product of products) {
                const { product_id, quantity } = product;

                const { rows } = await connection.query(orderProductsSql, [
                    order.id,
                    product_id,
                    quantity,
                ]);

                const productSql = 'SELECT * FROM products WHERE id=($1)';
                const prodDetails = await connection.query(productSql, [
                    product_id,
                ]);

                if (prodDetails.rows.length > 0) {
                    rows[0].name = prodDetails.rows[0].name;
                    rows[0].price = prodDetails.rows[0].price;
                }
                orderProducts.push(rows[0]);
            }

            connection.release();

            return {
                ...order,
                products: orderProducts,
            };
        } catch (err) {
            throw new Error(
                `Could not add new order for user ${user_id}. ${err}`
            );
        }
    }

    async read(id: number): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            // @ts-ignore
            const connection = await Client.connect();
            const { rows } = await connection.query(sql, [id]);
            const order = rows[0];

            const orderProductsSql =
                'SELECT product_id, quantity, name, price FROM order_products JOIN products ON order_products.product_id=products.id WHERE order_id=($1)';
            const { rows: orderProductRows } = await connection.query(
                orderProductsSql,
                [id]
            );

            connection.release();

            return {
                ...order,
                products: orderProductRows,
            };
        } catch (err) {
            throw new Error(`Could not find order ${id}. ${err}`);
        }
    }

    async update(id: number, newOrderData: Order): Promise<Order> {
        const { products, status, user_id } = newOrderData;

        try {
            const sql =
                'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
            // @ts-ignore
            const connection = await Client.connect();
            const { rows } = await connection.query(sql, [status, id]);
            const order = rows[0];

            const orderProductsSql =
                'UPDATE order_products SET product_id = $1, quantity = $2 WHERE order_id = $3 RETURNING product_id, quantity';
            const orderProducts = [];

            for (const product of products) {
                const { product_id, quantity } = product;

                const { rows } = await connection.query(orderProductsSql, [
                    product_id,
                    quantity,
                    order.id,
                ]);
                orderProducts.push(rows[0]);
            }

            connection.release();

            return {
                ...order,
                products: orderProducts,
            };
        } catch (err) {
            throw new Error(
                `Could not update order for user ${user_id}. ${err}`
            );
        }
    }

    async delete(id: number): Promise<Order> {
        try {
            // @ts-ignore
            const connection = await Client.connect();
            const orderProductsSql =
                'DELETE FROM order_products WHERE order_id=($1)';
            await connection.query(orderProductsSql, [id]);

            const sql = 'DELETE FROM orders WHERE id=($1)';
            const { rows } = await connection.query(sql, [id]);
            const order = rows[0];

            connection.release();

            return order;
        } catch (err) {
            throw new Error(`Could not delete order ${id}. ${err}`);
        }
    }

    async getCurrentOrders(id: number) {
        try {
            const sql =
                'SELECT * FROM orders WHERE user_id=($1) AND status=true';
            // @ts-ignore
            const connection = await Client.connect();
            const { rows } = await connection.query(sql, [id]);
            const order = rows[0];

            const orderProductsSql =
                'SELECT product_id, quantity, name, price FROM order_products JOIN products ON order_products.product_id=products.id WHERE order_id=($1)';
            const { rows: orderProductRows } = await connection.query(
                orderProductsSql,
                [order.id]
            );

            connection.release();

            return {
                ...order,
                products: orderProductRows,
            };
        } catch (err) {
            throw new Error(`Could not find order ${id}. ${err}`);
        }
    }

    async getCompleteOrders(id: number) {
        try {
            const sql =
                'SELECT * FROM orders WHERE user_id=($1) AND status=false';
            // @ts-ignore
            const connection = await Client.connect();

            const { rows } = await connection.query(sql, [id]);

            const orderProductsSql =
                'SELECT product_id, quantity, name, price FROM order_products JOIN products ON order_products.product_id=products.id WHERE order_id=($1)';
            const orders = [];

            for (const order of rows) {
                const { rows: orderProductRows } = await connection.query(
                    orderProductsSql,
                    [order.id]
                );
                orders.push({
                    ...order,
                    products: orderProductRows,
                });
            }

            connection.release();

            return orders;
        } catch (err) {
            throw new Error(`Could not get user orders. ${err}`);
        }
    }
}
