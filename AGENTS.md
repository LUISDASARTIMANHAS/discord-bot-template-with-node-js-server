# AI Agent Instructions for pentium-server-automation

This repository is a Node.js Discord bot and Express server template with a simple web interface and ticket system.

## What this project is

- Backend app: `server.js` sets up an Express app, security middleware, DDOS protection, and loads routes from `pages.js` and `rotas.js`.
- Discord bot: `src/index.js` initializes a `discord.js` client, registers slash commands, and handles interactions.
- Commands: `src/comandos/*.js` contains bot commands and command handlers.
- Ticket system: `src/handlers/ticketHandler.js` manages ticket button interactions.

## Important files

- `server.js` — main Express server entry point and middleware setup
- `src/index.js` — Discord bot initialization, command registration, and interaction handling
- `src/comandos/` — command definitions and handlers
- `src/handlers/ticketHandler.js` — ticket button flows and channel creation/closure
- `rotas.js` — API route registration using `npm-package-nodejs-utils-lda`
- `modules/ddosModule.js` — rate-limit middleware configuration
- `config.json` — app configuration values for origin, headers, user agents, and logging
- `README.md` — template description only, not authoritative for implementation details

## Run / development commands

- `npm start` — updates dependencies and starts `server.js` with Node watch mode
- `npm run start:dev` — starts `start.js` via `nodemon` (bot runtime path may differ from `server.js`)
- `npm run startDedicated` — starts `server.js` with Node watch mode

## Environment and runtime notes

- Uses `type: module` and ES module imports.
- Expects `.env` variables like `DISCORD_BOT_TOKEN`, `DISCORD_BOT_CLIENT_ID`, and `DISCORD_BOT_PORT`.
- Uses external package `npm-package-nodejs-utils-lda` for many Discord and Express helpers.
- The server binds to IPv6 by default (`::`) and falls back to `localhost` output.

## What AI agents should prioritize

1. Preserve existing command handler patterns when adding new slash commands.
2. Keep Express route logic separate from Discord bot logic.
3. Avoid changing environment-handling semantics unless adding clearer validation.
4. Respect existing external helper usage from `npm-package-nodejs-utils-lda`.

## When the codebase is unclear

- Inspect `src/index.js` first for interaction flows and command registration.
- Inspect `server.js` for middleware and route composition.
- Check `package.json` for dev/runtime scripts and Node engine version.

## Notes

- There are no dedicated tests in this repository.
- Do not assume `README.md` covers implementation details beyond the initial template description.
