# PaaSTech Client API

## Description

PaaSTech API's [Nest](https://github.com/nestjs/nest) framework TypeScript repository.

## Installation

```bash
$ npm install
```

## Development

First, copy `.env.example` into your own `.env` file and replace all appropriate values.

**WARNING**: There should be *no need* to replace the given default `DATABASE_URL`,
which is already fully configured to use in development mode.

To run the application, you will need to use the Docker Compose in the root folder:

```sh
$ docker compose up -d
```

After this, you will need to run **once**:

```sh
# generates prisma's client for TS types and classes
$ npx prisma generate

# applies the migrations to the database
$ npx prisma migrate deploy
```

If you need to generate migrations after editing the `schema.prisma` file, you can run:

```sh
$ npx prisma migrate dev --name "name of your migration here"
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
