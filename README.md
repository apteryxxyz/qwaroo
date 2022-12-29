# Qwaroo

Hello to whoever may be reading this, welcome to what is named **Qwaroo**.

Qwaroo is a site containing a bunch of guessing, statistics, quiz browser based games.

## Repository Projects

This repository includes the following apps/packages:

### Apps

- [`API`](apps/api) - The API for the site, it is the brains of the site, and handles all the backend logic for the users and games. It is written in TypeScript and uses the Express framework.

- [`Web`](apps/web) - The web client for the site. It is written in TypeScript and uses the NextJS framework.

#### Possible Future Apps

- [`Mobile`](apps/mobile) - (Not yet implemented) The mobile client for the site, written in TypeScript and uses the React Native framework.

- [`Discord`](apps/discord) - (Not yet implemented) The Discord bot client, used to play games in Discord servers. Written in TypeScript and uses the Discord.js and Maclary frameworks.

### Packages

- [`Common`](packages/common) - Utilities and functions used throughout the API and clients.

- [`Client`](packages/client) - A client used to handle making requests to the API from any form of client, be it web or mobile.

- [`Database`](packages/database) - Mongoose database models and connectability functionality.

- [`Sources`](packages/sources) - Generators for automatically generating item lists for games.

- [`Types`](packages/types) - TypeScript types used throughout the API and clients.
