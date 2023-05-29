FROM node:18-alpine3.14 AS build
WORKDIR /app

COPY . .

# Prepare 'out' directory
RUN --mount=type=cache,target=/app/.yarn/cache \
    yarn dlx prune --scope=www && \
    cp -R .yarn .yarnrc.yml tsconfig.json out/ && \
    cd out

# Install dependencies and build
RUN yarn install --immutable && \
    yarn turbo run build --filter=@qwaroo/* && \
    yarn turbo run build --filter=www && \
    yarn workspaces focus --all --production && \
    rm -rf node_modules/.cache .yarn/cache apps/www/.next/cache

FROM node:18-alpine3.14 as app
WORKDIR /app
COPY --chown=node:node --from=build /app/out .

WORKDIR /app/apps/www
EXPOSE 3000
CMD ["yarn", "start"]
