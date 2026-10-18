// index.js
import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Agent, setGlobalDispatcher } from "undici";
import dns from "node:dns";

import {
  getChannelsCount,
  getGuildsCount,
  getUsersCount,
  replyWarning,
  changeStatus,
  verifyManageMessagesInInteraction,
  validateInteractionChannel,
  commandsSYNC,
  defaultCommands,
  defaultCommandHandlers,
  initializeDefaultCommands,
} from "npm-package-nodejs-utils-lda";

import { tasklistCommand, handleTasklist } from "./comandos/tasklist.js";

import { latencyCommand, handleLatency } from "./comandos/latency.js";

import { helpCommand, handleHelp } from "./comandos/help.js";

import { banCommand, handleBan } from "./comandos/ban.js";

import { ticketCommand, handleTicket } from "./comandos/ticket.js";

import { handleTicketButtons } from "./handlers/ticketHandler.js";

config();

const token = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_BOT_CLIENT_ID;

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  rest: {
    timeout: 30000,
  },
});

const commandHandlers = {
  ...defaultCommandHandlers,
  help: handleHelp,
  tasklist: handleTasklist,
  latency: handleLatency,
  ban: handleBan,
  ticket: handleTicket,
};

const commands = [
  ...defaultCommands,
  helpCommand,
  tasklistCommand,
  latencyCommand,
  banCommand,
  ticketCommand,
];

// Força o uso de IPv4 nas conexões de rede.
setGlobalDispatcher(
  new Agent({
    connect: {
      lookup(hostname, options, callback) {
        dns.lookup(hostname, { ...options, family: 4 }, callback);
      },
    },
  }),
);

// Inicializa os comandos padrão e o despacho centralizado
// dos componentes da biblioteca.
initializeDefaultCommands(bot);

bot.once("clientReady", async () => {
  try {
    await bot.channels.fetch("1032778034811506738");

    changeStatus(bot);

    setInterval(() => {
      changeStatus(bot);
    }, 60000);

    console.log("Usuários: " + getUsersCount(bot));
    console.log("Canais: " + getChannelsCount(bot));
    console.log("Servidores: " + getGuildsCount(bot));
  } catch (error) {
    console.error("Erro ao inicializar o status e os logs:", error);
  }
});

// Listener dos comandos personalizados do cliente.
bot.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    if (await validateInteractionChannel(interaction)) return;
    if (await verifyManageMessagesInInteraction(interaction)) return;

    const handler = commandHandlers[interaction.commandName];

    if (handler) {
      await handler(interaction);
    }
  } catch (error) {
    console.error(error);

    if (!interaction.replied && !interaction.deferred) {
      await replyWarning(
        interaction,
        `ERR: 500 - INTERNAL SERVER ERROR. REASON: ${error}`,
        false,
      );
    }
  }
});

async function main() {
  try {
    if (!token || !CLIENT_ID) {
      console.error("Error: TOKEN or CLIENT_ID not defined in .env");
      return;
    }

    await commandsSYNC(commands);
    await bot.login(token);
  } catch (error) {
    console.error(error);

    setTimeout(() => {
      console.log("restarting...");
      main();
    }, 20000);
  }
}

await main();
