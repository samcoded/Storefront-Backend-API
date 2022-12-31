import { Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import { Product, ProductStore } from '../../models/product';

const orderStore = new OrderStore();

describe('Test Suite for Orders Model', () => {
    const userStore = new UserStore();
    const productStore = new ProductStore();

    let order: Order,
        userId: number,
        productId: number,
        retrievedOrder: Order,
        productData: Product;

    async function createOrder(order: Order) {
        return orderStore.create(order);
    }

    async function deleteOrder(id: number) {
        return orderStore.delete(id);
    }

    beforeAll(async () => {
        const user: User = await userStore.create({
            username: 'JakeDoe',
            firstname: 'Jake',
            lastname: 'Doe',
            password: 'password123',
        });

        userId = user.id as number;
        productData = {
            name: 'Havells fan',
            price: 2000,
        };
        const product: Product = await productStore.create(productData);

        productId = product.id as number;

        order = {
            user_id: userId,
            status: 'active',
            products: [
                {
                    product_id: productId,
                    quantity: 6,
                },
            ],
        };

        retrievedOrder = {
            user_id: userId,
            status: 'active',
            products: [
                {
                    product_id: productId,
                    quantity: 6,
                    ...productData,
                },
            ],
        };
    });

    afterAll(async () => {
        await userStore.delete(userId);
        await productStore.delete(productId as number);
    });

    it('Index method is present', () => {
        expect(orderStore.index).toBeDefined();
    });

    it('Read method is present', () => {
        expect(orderStore.read).toBeDefined();
    });

    it('Create method is present', () => {
        expect(orderStore.create).toBeDefined();
    });

    it('Update method is present', () => {
        expect(orderStore.update).toBeDefined();
    });

    it('Delete method is present', () => {
        expect(orderStore.delete).toBeDefined();
    });

    it('Current Orders method is present', () => {
        expect(orderStore.getCurrentOrders).toBeDefined();
    });

    it('Completed Orders method is present', () => {
        expect(orderStore.getCompleteOrders).toBeDefined();
    });

    it('Create method should add a order', async () => {
        const createdOrder: Order = await createOrder(order);

        expect(createdOrder).toEqual({
            id: createdOrder.id,
            ...retrievedOrder,
        });

        await deleteOrder(createdOrder.id as number);
    });

    it('Index method should return a list of orders', async () => {
        const createdOrder: Order = await createOrder(order);
        const orderList = await orderStore.index();

        expect(orderList).toEqual([createdOrder]);

        await deleteOrder(createdOrder.id as number);
    });

    it('Read method should return the correct orders', async () => {
        const createdOrder: Order = await createOrder(order);
        const orderFromDb = await orderStore.read(createdOrder.id as number);

        expect(orderFromDb).toEqual(createdOrder);

        await deleteOrder(createdOrder.id as number);
    });

    it('Update method should update the order', async () => {
        const createdOrder: Order = await createOrder(order);
        const newOrderData: Order = {
            products: [
                {
                    product_id: productId,
                    quantity: 200,
                },
            ],
            user_id: userId,
            status: 'complete',
        };

        const { products, status } = await orderStore.update(
            createdOrder.id as number,
            newOrderData
        );

        expect(products).toEqual(newOrderData.products);
        expect(status).toEqual(newOrderData.status);

        await deleteOrder(createdOrder.id as number);
    });

    it('Delete method should remove the order', async () => {
        const createdOrder: Order = await createOrder(order);

        await deleteOrder(createdOrder.id as number);

        const orderList = await orderStore.index();

        expect(orderList).toEqual([]);
    });

    it('Current Order method should return the correct orders', async () => {
        const createdOrder: Order = await createOrder(order);
        const orderList = await orderStore.getCurrentOrders(userId);
        expect(orderList).toEqual(createdOrder);

        await deleteOrder(createdOrder.id as number);
    });

    it('Completed Order method should return the correct orders', async () => {
        const createdOrder: Order = await createOrder(order);
        const newOrderData: Order = {
            products: [
                {
                    product_id: productId,
                    quantity: 200,
                },
            ],
            user_id: userId,
            status: 'complete',
        };

        await orderStore.update(createdOrder.id as number, newOrderData);
        const orderFromDb = await orderStore.getCompleteOrders(userId);

        expect(orderFromDb).toEqual([
            {
                id: createdOrder.id,
                user_id: userId,
                status: 'complete',
                products: [
                    {
                        product_id: productId,
                        quantity: 200,
                        ...productData,
                    },
                ],
            },
        ]);

        await deleteOrder(createdOrder.id as number);
    });
});
