.development.env file example

```shell
APP_PORT=4000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=lanars

JWT_SECRET=kardashian
JWT_EXPIRES_IN=1d

REDIS_URI=redis://localhost:6379
```

```shell
# yarn package manager
yarn install
yarn migration:migrate ## migrate from generated files
yarn start ## (or "yarn start:dev" for development )

# npm package manager
npm install
npm run migration:migrate ## migrate from generated files
npm run start ## (or "npm run dev" for development )

# pnpm package manager
pnpm install
pnpm migration:migrate ## migrate from generated files
pnpm run start ## (or "pnpm sdev" for development )

# for run redis and postgres in docker
npm run docker:dev
```

migrations files path - "src/database/migrations"