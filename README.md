# sequelize-redis-caching
 Redis caching in CRUD with Sequelize (MySQL)

 Based on this sample, you can refer to appropriate caching when using Sequelize in CRUD work.

 <img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Redis_Logo.svg/1200px-Redis_Logo.svg.png" width="250px" />

## Start
- Clone this git
```bash
$ git clone https://github.com/zinirun/sequelize-redis-caching.git
```
- Define your database(MySQL) at `.env`
```js
DATABASE = "YOUR_DATABASE_NAME"
DB_USER = "YOUR_DATABASE_USER"
DB_PASSWORD = "YOUR_DATABASE_PASSWORD"
DB_HOST = "localhost"
```
- Start express
```bash
$ yarn install # npm install
$ yarn start # npm start
```

> You can define your Redis host `redisHost` at `./admin/admin.ctrl.js` (It assumes Redis Client runs as Host Docker by default)

## Caching Position
Controllers are defined at `./admin/admin.ctrl.js`. Cached data is saved as `JSON.stringify` and loaded as `JSON.parse`.

- Set Cache from Redis (when C, U, D)
  - `post_products_write`
  - `post_products_edit`
  - `post_products_delete`

- Get Cache from Redis (when R)
  - `get_products`
    - It uses Promisify function `getAsync`
    - It accesses Sequelize when redis has no cache