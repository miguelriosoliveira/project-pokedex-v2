# Pokédex web

React app for [Project Pokédex](https://github.com/miguelriosoliveira/project-pokedex-v2). Full setup lives in the [root README](../README.md).

## Scripts

```bash
cp .env.example .env   # VITE_BACKEND_URL=http://localhost:3000
pnpm dev               # http://localhost:5173
pnpm test
pnpm lint
pnpm build
```

`VITE_BACKEND_URL` is required. `VITE_SENTRY_DSN` is optional.

## Routes

| Path | Page |
| --- | --- |
| `/` | Generations |
| `/search` | Whole catalog |
| `/:generationName` | One generation |
| `/pokemon/:pokemonId` | Details, matchups, evolution |

## Deploy

Vercel, with this folder as the app root. Set `VITE_BACKEND_URL` to the Fly API.
