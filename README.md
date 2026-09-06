# Project Pokédex

A personal Pokédex you can browse by generation or search across the whole catalog. Data comes from [PokéAPI](https://pokeapi.co/), lives in MongoDB, and is served by a small Express API to a React app.

**Live app:** [project-pokedex.vercel.app](https://project-pokedex.vercel.app)

## Features

- Generation grid with region and starters
- Search by name or number, filter by type, infinite scroll
- Details with official artwork, types, and damage taken / dealt
- Evolution chains that keep forks intact (Oddish, Wurmple, Eevee, …)

## Stack

| | |
| --- | --- |
| App | React 19, Vite, Tailwind CSS 4, React Router |
| API | Express 5, Zod, Mongoose |
| Data | MongoDB, PokéAPI via `pokenode-ts` |
| Tooling | pnpm workspaces, TypeScript 7, Biome, Vitest |
| Hosting | Vercel (`web/`), Fly.io (`server/`) |

## Requirements

- Node.js 24
- [pnpm](https://pnpm.io/) 12
- Docker (local Mongo)

## Getting started

```bash
git clone https://github.com/miguelriosoliveira/project-pokedex-v2.git
cd project-pokedex-v2
pnpm install
```

```bash
cp server/.env.example server/.env
cp web/.env.example web/.env
```

`server/.env` defaults to a local Mongo on port `27017`. `web/.env` should point at the API:

```bash
VITE_BACKEND_URL=http://localhost:3000
```

Start Mongo, fill the catalog from PokéAPI, then run both apps:

```bash
pnpm --filter @project-pokedex/server db:populate
pnpm dev
```

- App: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3000](http://localhost:3000)

`pnpm server` starts Docker Compose for you. The first populate takes about a minute and upserts generations, types, and Pokémon (it will not wipe the database if PokéAPI returns nothing).

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | API + web in parallel |
| `pnpm server` / `pnpm web` | One side only |
| `pnpm --filter @project-pokedex/server db:populate` | Refresh the catalog from PokéAPI |
| `pnpm test` | Vitest in both packages |
| `pnpm lint` | Biome |

Populate reads `server/.env` when that file exists. In CI it uses `PORT` and `MONGO_URL` from the environment. The URI path is the Mongo database name. This project uses `pokedex`:

```text
mongodb+srv://USER:PASS@CLUSTER.mongodb.net/pokedex?appName=pokedex-ts
```

If that path is missing, Mongoose writes to the `test` database instead.

## API

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/generations` | Regions, display names, starters |
| `GET` | `/types` | Type names (stellar / unknown / shadow omitted) |
| `GET` | `/pokemon` | `generation`, `search`, `types`, `page`, `page_size` |
| `GET` | `/pokemon/:number` | Details, matchups, evolution branches |

## Catalog sync

A GitHub Action runs `db:populate` every Monday (and from **Actions → Sync Pokédex from PokeAPI**). It talks to Atlas directly.

Add a repository secret named `MONGO_URL` with the production URI and database name `pokedex` in the path (`…mongodb.net/pokedex?…`). Atlas Network Access must allow GitHub-hosted runners (typically `0.0.0.0/0`).

## Deploy

- **Web** — Vercel, `web/` as the app root. Set `VITE_BACKEND_URL` to the Fly API.
- **API** — `flyctl deploy` from the repo root with `server/fly.toml` (also on push to `main` when server files change). Set `PORT` and `MONGO_URL` as Fly secrets.

## License

MIT. Pokémon and Pokémon character names are trademarks of Nintendo / Game Freak / The Pokémon Company. This is an unofficial fan project; data is provided by PokéAPI.
