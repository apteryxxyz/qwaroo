# ~/docker-bake.hcl

```hcl
target "www" {
    dockerfile = "./apps/www/Dockerfile"
    contexts = {
        app = "./apps/www"
        base = "."
    }
}
```


# ~/apps/www/Dockerfile

```dockerfile
# syntax=docker/dockerfile:1.4

# Stage 1: Build
FROM node:18-alpine3.14 AS workspace
WORKDIR /app

# Setup PNPM
RUN npm install --global pnpm

# Copy the files from the monorepo root
COPY --from=base . .

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Build the local dependencies and apps
RUN pnpm -r build

# Deploy the www app to the pruned folder
RUN pnpm --filter=www deploy pruned

# Copy the built .next to the new pruned folder
RUN cp -r ./apps/www/.next /app/pruned/.next

# Stage 2: Release
FROM node:18-alpine3.14 AS release
WORKDIR /app

# Copy only the required files
COPY --from=workspace /app/pruned/node_modules node_modules
COPY --from=workspace /app/pruned ./

EXPOSE 3000
CMD ["npm", "run", "start"]
```