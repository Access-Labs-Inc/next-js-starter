# Next.js v13 Starter template for Access Protocol integration

A Next.js v13 starter template for building apps Access Protocol utilizing:
- Solana Web3.js for communication with Solana
- Solana wallet adapter to connect various wallets
- Access protocol JS bindings to talk to Access Protocol smart contract
- Radix UI, Tailwind CSS and excelent UI lib by [shadcn/ui](https://github.com/shadcn/ui)

## Usage

Requirements:
- [Node.js >18](https://nodejs.org/en)
- [PNPM](https://pnpm.io/)
- [Postgresql >v15](https://www.postgresql.org/)

1) Start the project with `create-next-app`:
```sh
npx create-next-app -e https://github.com/Access-Labs-Inc/next-js-starter
```

2) Edit `.env` and update accordingly the ENV variables.
3) Install dependencies: `pnpm install`
3) Migrate DB: `npx prisma migrate dev`
4) Seed DB: `npx prisma db seed`
5) Run the app: `pnpm dev`

## Development

To run dev env: `pnpm dev`
To start production build: `pnpm preview`
To lint and fix issues: `pnpm lint:fix`
To format code: `pnpm format:write`

### Prisma specific

Generate migration:
```sh
npx prisma migrate dev --name init
```

Seed the database:
```sh
npx prisma db seed
```

Generate new metadata (also runs as postinstall after each `pnpm install`):
```sh
npx prisma generate
```

## Features

- Next.js 13 App Directory
- Radix UI Primitives
- Tailwind CSS
- [Shadcn UI](https://github.com/shadcn/ui)
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Tailwind CSS class sorting, merging and linting.
- [t3-env](https://github.com/t3-oss/t3-env)
- [Zod](https://zod.dev/) for TS-first schema based validation
- [Prisma](https://www.prisma.io/) connecting the DB

## License

Licensed under the [MIT license](https://github.com/Access-Labs-Inc/blob/main/LICENSE.md).
