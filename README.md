# Squealer

## How to start the web app

```console
// install all dependencies
pnpm i
// start the dev server
pnpm dev
```

If the Prisma schema is changed:

```console
// type definitions must be generated with
pnpm postinstall
// model changes must be pushed to the database
pnpm db:push
```

## Navigate through the database

See what the database looks like with Prisma Studio.

```console
pnpm db:studio
```
