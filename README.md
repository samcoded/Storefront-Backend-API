# Storefront Backend Project

## Technologies

-   Postgres for the database
-   Node/Express for the application logic
-   dotenv from npm for managing environment variables
-   db-migrate from npm for migrations
-   jsonwebtoken from npm for working with JWTs
-   jasmine from npm for testing

### Install dependencies

```
 npm install
```

### Create database

Create database using Postgres psql tool

```
CREATE USER storefront_user WITH PASSWORD 'YOUR_PASSWORD_HERE';
CREATE DATABASE storefront;
\c storefront;
GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront_user;
CREATE DATABASE storefront_test;
\c storefront_test;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront_user;
```

### Set up database and other important credentials

Rename file `.env.example` to `.env` and fill in the credentials

```
POSTGRES_HOST=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_TEST_DB=
BCRYPT_PASSWORD=
SALT_ROUNDS=
JWTSECRET=
ENV=
```

### Run migrations

```
npm run db-up
```

Reverse all migrations

```
npm run db-down
```

### Build

```
npm run build
```

### Start server

```
npm start
```

### Start dev server

```
npm run dev
```

### Testing

```
npm run test

```
