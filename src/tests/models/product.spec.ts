import { Product, ProductStore } from '../../models/product';

const productStore = new ProductStore();

describe('Test Suite for Products Model', () => {
    const product: Product = {
        name: 'Havells Fan',
        price: 2000,
    };

    async function createProduct(product: Product) {
        return productStore.create(product);
    }

    async function deleteProduct(id: number) {
        return productStore.delete(id);
    }

    it('Index method is present', () => {
        expect(productStore.index).toBeDefined();
    });

    it('Show method is present', () => {
        expect(productStore.show).toBeDefined();
    });

    it('Create method is present', () => {
        expect(productStore.create).toBeDefined();
    });

    it('Update method is present', () => {
        expect(productStore.update).toBeDefined();
    });

    it('Remove method is present', () => {
        expect(productStore.delete).toBeDefined();
    });
    it('Create method should add a product', async () => {
        const createdProduct: Product = await createProduct(product);
        // console.log(createdProduct);
        // console.log(product);
        expect(createdProduct).toEqual({
            id: createdProduct.id,
            ...product,
        });

        await deleteProduct(createdProduct.id as number);
    });

    it('Index method should return a list of products', async () => {
        const createdProduct: Product = await createProduct(product);
        const productList = await productStore.index();
        // console.log(productList);
        // console.log(createdProduct);
        expect(productList).toEqual([createdProduct]);

        await deleteProduct(createdProduct.id as number);
    });

    it('Show method should return the correct product', async () => {
        const createdProduct: Product = await createProduct(product);
        const productFromDb = await productStore.show(
            createdProduct.id as number
        );

        expect(productFromDb).toEqual(createdProduct);

        await deleteProduct(createdProduct.id as number);
    });

    it('Delete method should remove the product', async () => {
        const createdProduct: Product = await createProduct(product);

        await deleteProduct(createdProduct.id as number);

        const productList = await productStore.index();

        expect(productList).toEqual([]);
    });

    it('Update method should update the correct product with id', async () => {
        const createdProduct: Product = await createProduct(product);

        const name: string = 'Havell fan deluxe';
        const price: number = 2500;
        const newProductData: Product = await productStore.update(
            createdProduct.id as number,
            name,
            price
        );

        expect(name).toEqual(newProductData.name as string);
        expect(price).toEqual(newProductData.price as number);

        await deleteProduct(createdProduct.id as number);
    });
});
