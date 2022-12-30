import { User, UserStore } from '../../models/user';

const userStore = new UserStore();

describe('User Model', () => {
    const user: User = {
        username: 'JakeDoe',
        firstname: 'Jake',
        lastname: 'Doe',
        password: 'password123',
    };

    async function createUser(user: User) {
        return userStore.create(user);
    }

    async function deleteUser(id: number) {
        return userStore.delete(id);
    }

    it('Index method is present', () => {
        expect(userStore.index).toBeDefined();
    });
    it('Check User Exist method is present', () => {
        expect(userStore.checkUserExist).toBeDefined();
    });
    it('Read method is present', () => {
        expect(userStore.read).toBeDefined();
    });

    it('Create method is present', () => {
        expect(userStore.create).toBeDefined();
    });

    it('Update method is present', () => {
        expect(userStore.update).toBeDefined();
    });

    it('Remove method is present', () => {
        expect(userStore.delete).toBeDefined();
    });

    it('Create method should create a user', async () => {
        const createdUser: User = await createUser(user);

        if (createdUser) {
            const { username, firstname, lastname } = createdUser;

            expect(username).toBe(user.username);
            expect(firstname).toBe(user.firstname);
            expect(lastname).toBe(user.lastname);
        }

        await deleteUser(createdUser.id as number);
    });

    it('Index method should return a list of users', async () => {
        const createdUser: User = await createUser(user);
        const userList = await userStore.index();
        // console.log(createdUser);
        // console.log(userList);
        expect(userList).toEqual([createdUser]);

        await deleteUser(createdUser.id as number);
    });

    it('Show method should return the correct user with id', async () => {
        const createdUser: User = await createUser(user);
        const userFromDb = await userStore.read(createdUser.id as number);

        expect(userFromDb).toEqual(createdUser);

        await deleteUser(createdUser.id as number);
    });

    it('Remove method should remove the correct user with id', async () => {
        const createdUser: User = await createUser(user);

        await deleteUser(createdUser.id as number);

        const userList = await userStore.index();

        expect(userList).toEqual([]);
    });

    it('Update method should update the correct user with id', async () => {
        const createdUser: User = await createUser(user);

        const firstname: string = 'Paul';
        const lastname: string = 'Rock';
        const newUserData: User = await userStore.update(
            createdUser.id as number,
            firstname,
            lastname
        );

        expect(firstname).toEqual(newUserData.firstname as string);
        expect(lastname).toEqual(newUserData.lastname as string);

        await deleteUser(createdUser.id as number);
    });

    it('Authenticates the user with a correct username and password', async () => {
        const createdUser: User = await createUser(user);

        const checkUser = await userStore.authenticate(
            user.username,
            user.password as string
        );

        // console.log(checkUser);
        // console.log(createdUser);
        if (checkUser) {
            const { username, firstname, lastname } = checkUser;
            // console.log(username);
            expect(username).toBe(user.username);
            expect(firstname).toBe(user.firstname);
            expect(lastname).toBe(user.lastname);
        }

        await deleteUser(createdUser.id as number);
    });
});
