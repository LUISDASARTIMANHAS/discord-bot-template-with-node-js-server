# AI Agent Instructions for discord-bot-template-with-node-js-server

This repository is a Node.js Discord bot and Express server template with a simple web interface, API routes, and a ticket system.

## What this project is

- **Express web server**: `server.js` configures Express 5, security middleware, DDOS protection, page routes, and API routes.
- **Discord bot**: `src/index.js` configures `discord.js`, registers slash commands, and handles interactions.
- **Slash commands**: `src/comandos/*.js` contains command definitions and handlers.
- **Ticket button flow**: `src/handlers/ticketHandler.js` processes ticket-related button interactions.
- **Page routes**: `pages.js` exposes static files and dashboards.
- **API routes**: `rotas.js` registers routes via `npm-package-nodejs-utils-lda`.
- **Config**: `config.json` stores CORS, headers, logging, and cache settings.
- **Runtime data**: `data/Activities.json` and `data/status.json` are managed by the bot.

## Run / development commands

- `npm start` — updates dependencies via `npm-check-updates` and starts `server.js` with `nodemon`
- `npm run start:dev` — starts `start.js` via `nodemon`
- `npm run startDedicated` — starts `server.js` with `node --watch`
- `npm run autoInstall` — runs `npm update && npm install`

## Environment

- Node 24.x
- `type: module`
- Required `.env` variables: `DISCORD_BOT_TOKEN`, `DISCORD_BOT_CLIENT_ID`, `DISCORD_BOT_PORT`
- Do not hardcode secrets.

## Architecture

- `server.js` is the web process: it creates the Express app, mounts middleware, and imports `pages.js` and `rotas.js`.
- `src/index.js` is the Discord bot process: it initializes the client, defines command registration, and handles `interactionCreate` events.
- `pages.js` exports page routes and dashboards.
- `rotas.js` exports API routes and 404 handling.
- `src/comandos/` defines command objects and handlers.
- `src/handlers/ticketHandler.js` handles button interaction flows.

## Command registration pattern

1. Define commands in `src/comandos/<name>.js` using `SlashCommandBuilder`
2. Export a handler function named `handle<Name>`
3. Import both the command and handler in `src/index.js`
4. Add the command to `commands` and the handler to `commandHandlers`
5. Use `commandsSYNC(commands)` to register Discord commands

## Button interaction pattern

- `interactionCreate` checks `interaction.isButton()` first
- `src/handlers/ticketHandler.js` processes ticket buttons
- `customId` format: `create_ticket:categoryId:staffRoleId` with `"none"` for missing values
- Validate inputs before sending follow-up responses

## Agent guidance

- Preserve existing command and route patterns.
- Prefer `npm-package-nodejs-utils-lda` helpers when available.
- Keep Express route logic separate from Discord bot logic.
- Do not register commands or route interaction handlers outside `src/index.js`.
- Inspect source files directly; `README.md` is not authoritative.
- There is no automated test suite; use runtime verification and careful review.

## When the codebase is unclear

- Inspect `src/index.js` first for Discord flow and command handling.
- Inspect `server.js` for Express startup and middleware.
- Inspect `src/comandos/` for command examples, especially `ban.js`.
- Inspect `src/handlers/ticketHandler.js` for button flow.
- Use `config.json` for runtime and security settings.
