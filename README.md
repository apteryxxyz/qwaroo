# Owneii

Hello to whoever may be reading this, welcome to what is currently code named **Owenii**.

Owenii is a site containing a bunch of guessing, statistics and fun browser based games.

## Repository Structure

The repository is structured as follows:

### Apps

- [`apps/api`](apps/api) - The API for the site, it is the brains of the site, and handles all the backend logic for the users and games. It is written in TypeScript and uses the Express framework.

- [`apps/web`](apps/web) - (Not yet implemented) The web client for the site. It is written in TypeScript and uses the NextJS framework.

#### Possible Future Apps

- [`apps/mobile`](apps/mobile) - (Not yet implemented) The mobile client for the site, written in TypeScript and uses the React Native framework.

- [`apps/discord`](apps/discord) - (Not yet implemented) The Discord bot client, used to play games in Discord servers. Written in TypeScript and uses the Discord.js and Maclary frameworks.

### Packages

- [`packages/common`](packages/common) - Utilities and functions used throughout the API and clients.

- [`packages/client`](packages/client) - A client used to handle making requests to the API from any form of client, be it web or mobile.

- [`packages/database`](packages/database) - Mongoose database models and connectability functionality.

- [`packages/routes`](packages/routes) - Express routes that point to endpoints on the API.

- [`packages/sources`](packages/sources) - Generators for automatically generating item lists for games.

- [`packages/types`](packages/types) - TypeScript types used throughout the API and clients.
