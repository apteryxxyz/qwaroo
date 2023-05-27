# Stage 1: Build

FROM node:18-alpine3.14 AS workspace
WORKDIR /app

# Setup PNPM
RUN npm install --global pnpm

# Copy the files from the monorepo root
COPY . .

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Build the local dependencies
RUN pnpm --filter=@qwaroo/* build

# Build this app
RUN pnpm --filter=www build

# # Deploy the www app to the pruned folder
# RUN pnpm --filter=www deploy pruned

# # Copy the built .next to the new pruned folder
# RUN cp -r ./apps/www/.next /app/pruned/.next

# Stage 2: Release
# FROM node:18-alpine3.14 AS release
# WORKDIR /app

# # Copy only the required files
# COPY --from=workspace /app/node_modules/ ./node_modules
# COPY --from=workspace /app/apps/www/ ./

EXPOSE 3000
CMD ["pnpm", "--filter=www", "start"]
