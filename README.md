# Qwaroo

## Install

```sh
git clone https://github.com/apteryxxyz/qwaroo
cd qwaroo && yarn install
```

## Environment Variables

There is a `.env.template` file in the root of the project. Copy it to `.env.development` and fill in the values.

## Build and Run

```sh
# Prepare the project for development
yarn prepare-for:development
# Build all of the packages
yarn build
# Run the next app in development mode
cd apps/next && yarn dev
```
