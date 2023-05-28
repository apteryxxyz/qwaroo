FROM node:18-alpine3.14
WORKDIR /app

# Install root dependencies
COPY .yarn .yarn/
COPY package.json tsconfig.json .yarnrc.yml ./
RUN yarn install

# Install package dependencies and build
COPY packages ./packages
RUN yarn install
RUN yarn workspaces foreach --include="@qwaroo/*" run build

# Install app dependencies and build
COPY apps/www ./apps/www
RUN yarn install
RUN yarn workspace www build

# Delete cache
RUN yarn cache clean

EXPOSE 3000
CMD ["yarn", "workspace", "www", "start"]