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

// Carrega as variáveis de ambiente
config();

console.log("[BOOT] Iniciando aplicação...");
console.log("[BOOT] Token definido:", Boolean(process.env.DISCORD_BOT_TOKEN));
console.log("[BOOT] Client ID definido:", Boolean(process.env.DISCORD_BOT_CLIENT_ID));

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

console.log("[BOOT] Cliente Discord criado.");

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

console.log("[BOOT] Handlers personalizados:", Object.keys(commandHandlers));
console.log("[BOOT] Total de comandos:", commands.length);

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

console.log("[BOOT] Dispatcher IPv4 configurado.");

// Inicializa os comandos padrão e o despacho centralizado dos componentes.
try {
  console.log("[DISPATCH] Inicializando comandos padrão...");
  initializeDefaultCommands(bot);
  console.log("[DISPATCH] initializeDefaultCommands concluído.");
} catch (error) {
  console.error("[DISPATCH] Falha ao inicializar comandos padrão:", error);
}

// Registra quando qualquer interação chega ao cliente.
// Este listener apenas registra e continua; não interfere no dispatcher.
bot.on("interactionCreate", async (interaction) => {
  console.log("\n[INTERACTION] Interação recebida.");
  console.log("[INTERACTION] Custom ID:", interaction.customId ?? "(sem customId)");

  if (!interaction.isButton()) return;

  console.log("[BUTTON] Botão detectado:", interaction.customId);

  // Encaminha apenas os botões do sistema de tickets.
  if (
    interaction.customId.startsWith("create_ticket:") ||
    interaction.customId.startsWith("close_ticket:")
  ) {
    console.log("[TICKET] Encaminhando para handleTicketButtons...");

    try {
      await handleTicketButtons(interaction);
      console.log("[TICKET] Handler finalizado.");
    } catch (error) {
      console.error("[TICKET] Falha ao processar botão:", error);
    }
  }
});

// Status quando o bot estiver pronto.
bot.once("clientReady", async () => {
  console.log("[READY] Bot conectado ao Discord.");
  console.log("[READY] Usuário do bot:", bot.user?.tag);

  try {
    console.log("[READY] Buscando canal de inicialização...");
    await bot.channels.fetch("1032778034811506738");
    console.log("[READY] Canal encontrado.");

    changeStatus(bot);

    setInterval(() => {
      changeStatus(bot);
    }, 60000);

    console.log("[READY] Usuários:", getUsersCount(bot));
    console.log("[READY] Canais:", getChannelsCount(bot));
    console.log("[READY] Servidores:", getGuildsCount(bot));
  } catch (error) {
    console.error("[READY] Erro ao inicializar status e logs:", error);
  }
});

// Listener dos comandos personalizados do cliente.
bot.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    console.log("[COMMAND] Comando recebido:", interaction.commandName);

    if (await validateInteractionChannel(interaction)) {
      console.log("[COMMAND] Interrompido por validateInteractionChannel.");
      return;
    }

    if (await verifyManageMessagesInInteraction(interaction)) {
      console.log("[COMMAND] Interrompido por verifyManageMessagesInInteraction.");
      return;
    }

    const handler = commandHandlers[interaction.commandName];

    if (handler) {
      console.log("[COMMAND] Executando handler:", interaction.commandName);
      await handler(interaction);
      console.log("[COMMAND] Handler concluído:", interaction.commandName);
    } else {
      console.warn("[COMMAND] Nenhum handler encontrado:", interaction.commandName);
    }
  } catch (error) {
    console.error("[COMMAND] Erro ao processar comando:", error);

    if (!interaction.replied && !interaction.deferred) {
      try {
        await replyWarning(
          interaction,
          `ERR: 500 - INTERNAL SERVER ERROR. REASON: ${error}`,
          false,
        );
      } catch (replyError) {
        console.error("[COMMAND] Erro ao enviar mensagem de erro:", replyError);
      }
    }
  }
});

async function main() {
  try {
    if (!token || !CLIENT_ID) {
      console.error("[LOGIN] TOKEN ou CLIENT_ID não definido no .env.");
      return;
    }

    console.log("[LOGIN] Sincronizando comandos...");
    await commandsSYNC(commands);
    console.log("[LOGIN] Comandos sincronizados.");

    console.log("[LOGIN] Conectando ao Discord...");
    await bot.login(token);
    console.log("[LOGIN] Login solicitado.");
  } catch (error) {
    console.error("[LOGIN] Erro na inicialização:", error);

    setTimeout(() => {
      console.log("[LOGIN] Tentando reiniciar...");
      main();
    }, 20000);
  }
}

await main();