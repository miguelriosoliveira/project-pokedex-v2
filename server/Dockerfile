# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=lts-bullseye
FROM node:${NODE_VERSION} AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Install pnpm (must match packageManager in the root package.json)
ARG PNPM_VERSION=12.3.1
RUN npm install -g pnpm@$PNPM_VERSION


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Workspace manifests first so dependency installs stay cached
COPY --link package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --link server/package.json ./server/
COPY --link web/package.json ./web/
RUN pnpm install --frozen-lockfile --filter @project-pokedex/server

# Application source (web/ is excluded via .dockerignore)
COPY --link server ./server

# Build application
RUN pnpm --filter @project-pokedex/server run build

# Isolated production copy of the server package (no workspace / devDependencies)
RUN pnpm --filter @project-pokedex/server deploy --prod --ignore-scripts /app/deploy


# Final stage for app image
FROM base

ENV NODE_ENV="production"

# Copy built application
COPY --from=build /app/deploy /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "dist/server.js" ]
