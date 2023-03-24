# Qwaroo

Hello to whoever may be reading this, welcome to what is named **Qwaroo**.

Qwaroo is a site containing a bunch of guessing, statistics, quiz browser based games.

## Repository Projects

This repository includes the following apps/packages:

### Apps

- [`API`](apps/api) - The API for the site, it is the brains, and handles all the main backend logic for the users and games. It is written in TypeScript and uses the Express framework.

- [`CDN`](apps/cdn) - The CDN for the site, it is used to serve static and some dynamic content to the users, such as game data. It is written in TypeScript and uses the Express framework.

- [`Discord`](bots/discord) - The Discord bot version of Qwaroo, brings the games to Discord. **It is still in development**. It is written in TypeScript and uses the Maclary bot framework.

- [`Web`](apps/web) - The web client for the site. It is written in TypeScript and uses the NextJS framework.

### Packages

- [`Client`](packages/client) - A client used to handle making requests to the API from any form of client, be it web or mobile.

- [`Common`](packages/common) - Utilities and functions used throughout the server and clients.

- [`Database`](packages/database) - Mongoose database models and connectability functionality.

- [`Middleware`](packages/middleware) - Express middleware used throughout the different servers.

- [`Server`](packages/server) - Code shared between the API and CDN servers.

- [`Types`](packages/types) - TypeScript types used throughout the server and clients.
