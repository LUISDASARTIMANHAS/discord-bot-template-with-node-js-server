# AI Agent Instructions for discord-bot-template-with-node-js-server

This repository is a Node.js Discord bot and Express server template with a simple web interface and ticket system.

## What this project is

- **Backend app**: `server.js` sets up an Express app with security middleware, DDOS protection, and loads routes from `pages.js` and `rotas.js`.
- **Discord bot**: `src/index.js` initializes a `discord.js` client, registers slash commands, and handles interactions.
- **Commands**: `src/comandos/*.js` contains slash command definitions and handlers.
- **Ticket system**: `src/handlers/ticketHandler.js` manages ticket button interactions with dynamic customIds.
- **Logging & Cache**: Request logging enabled in `config.json`; activity data stored in `data/Activities.json`.

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

- `npm start` — updates dependencies via `npm-check-updates -u` and starts `server.js` with Node watch mode
- `npm run start:dev` — starts `start.js` via `nodemon` (alternative bot runtime path)
- `npm run startDedicated` — starts `server.js` with Node `--watch` flag
- `npm run autoInstall` — runs `npm update && npm install`

## Environment and runtime notes

- Uses `type: module` and ES module imports.
- Expects `.env` variables like `DISCORD_BOT_TOKEN`, `DISCORD_BOT_CLIENT_ID`, and `DISCORD_BOT_PORT`.
- Uses external package `npm-package-nodejs-utils-lda` for many Discord and Express helpers.
- The server binds to IPv6 by default (`::`) and falls back to `localhost` output.

## Command creation pattern

Every slash command follows this structure:

1. **Command Definition** (using `SlashCommandBuilder` from `@discordjs/builders`):
   ```js
   let cmdCommand = new SlashCommandBuilder()
     .setName("cmd")
     .setDescription("Description")
     .addUserOption(...)  // or other option types
     .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator); // if needed
   cmdCommand = cmdCommand.toJSON();
   ```

2. **Handler Function** (named `handle<CommandName>`):
   - Check `interaction.commandName` matches the command name
   - Extract options via `interaction.options.getUser()`, `getString()`, etc.
   - Use helper functions from `npm-package-nodejs-utils-lda` (e.g., `banUser`, `createTicketChannelFromInteraction`)
   - Reply using `interaction.reply()` or `replyWarning()`

3. **Registration** in `src/index.js`:
   - Import both the command object and handler function
   - Add command to `commands` array
   - Add handler to `commandHandlers` object with key matching command name

## Button handler pattern

Custom button interactions (e.g., ticket creation) are handled in `src/handlers/ticketHandler.js`:
- Check `interaction.isButton()` in the main interaction handler
- Use `customId` format: `create_ticket:categoryId:staffRoleId` (use `"none"` for null values)
- Validate IDs and permissions before processing
- Use embedded `ActionRowBuilder` and `ButtonBuilder` for follow-up buttons

## What AI agents should prioritize

1. **Preserve patterns**: Maintain the command/handler/registration pattern when adding new commands.
2. **Use helpers**: Leverage `npm-package-nodejs-utils-lda` functions (e.g., `banUser`, `replyWarning`, `createTicketChannelFromInteraction`).
3. **Separate concerns**: Keep Express route logic (`server.js`, `rotas.js`) completely separate from Discord bot logic (`src/`).
4. **Environment handling**: Respect `.env` variables (`DISCORD_BOT_TOKEN`, `DISCORD_BOT_CLIENT_ID`, `DISCORD_BOT_PORT`); do not hardcode secrets.
5. **Logging convention**: Use `fopen()` and `fwrite()` helpers for logging to files in `logs/`.

## When the codebase is unclear

- Inspect [src/index.js](src/index.js#L1) first for interaction flows, command registration, and event listeners.
- Inspect [server.js](server.js#L1) for middleware setup and route composition.
- Check [src/comandos/](src/comandos/) for command pattern examples (start with [ban.js](src/comandos/ban.js)).
- Review [config.json](config.json) for CORS, logging, cache, and Discord embed settings.

## Project notes

- **No tests**: This repository has no dedicated test suite; manual testing or CI integration would be beneficial.
- **Documentation authority**: `README.md` is template-level only; rely on AGENTS.md and code inspection for implementation details.
- **External dependencies**: The project heavily depends on `npm-package-nodejs-utils-lda` (v1.0.83+) for bot, Discord, and Express helpers.
- **Data files**: `data/Activities.json` and status JSON are managed by the bot at runtime; do not manually edit unless necessary.
- **Node version**: Requires Node 24.x (pinned in `package.json`); development should use this version.
