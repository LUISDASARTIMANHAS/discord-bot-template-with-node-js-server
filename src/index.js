import { config } from "dotenv";
import { REST } from "@discordjs/rest";
import {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  Routes,
} from "discord.js";

import {
  fopen,
  fwrite,
  setStatusCommand,
  handleSetStatus,
  handleExec,
  execCommand,
  nslookupCommand,
  handleNslookup,
  tracertCommand,
  handleTracert,
  getBotPermissionsByInteraction,
  getChannelsCount,
  getGuildsCount,
  getInteractionSummary,
  getUsersCount,
  replyWarning,
  changeStatus,
  verifyManageMessagesInInteraction,
  validateInteractionChannel,
} from "npm-package-nodejs-utils-lda";
import { tasklistCommand, handleTasklist } from "./comandos/tasklist.js";
import { helpCommand, handleHelp } from "./comandos/help.js";
import { pingCommand, handlePing } from "./comandos/ping.js";
config();
const token = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const rest = new REST({ version: "10" }).setToken(token);
const handles = [
  handleHelp,
  handlePing,
  handleSetStatus,
  handleExec,
  handleNslookup,
  handleTracert,
  handleTasklist,
];
let commands = [
  helpCommand,
  pingCommand,
  setStatusCommand,
  execCommand,
  nslookupCommand,
  tracertCommand,
  tasklistCommand
];

bot.on("clientReady", async () => {
  const channelLogs = await bot.channels.fetch("1032778034811506738");

  changeStatus(bot);
  setInterval(() => {
    changeStatus(bot);
  }, 60000);
  // sendLogsEmbed(
  //   channelLogs,
  //   "**__🖥️MENSAGEM DO SERVIDOR🖥️:__**",
  //   info,
  //   16753920,
  //   "",
  //   ""
  // );

  console.log("Usuários:" + getUsersCount(bot));
  console.log("Canais:" + getChannelsCount(bot));
  console.log("Servidores:" + getGuildsCount(bot));
});

bot.on("interactionCreate", async (interaction) => {
  try {
    const interactionSummary = getInteractionSummary(interaction);
    console.log(interactionSummary);
    let validationChannel = await validateInteractionChannel(interaction);
    let validationVerifyManageMessagesInInteraction =
      await verifyManageMessagesInInteraction(interaction);

    if (validationChannel) {
      return;
    }

    if (validationVerifyManageMessagesInInteraction) {
      return;
    }

    for (const handle of handles) {
      await handle(interaction);
    }
  } catch (error) {
    return await replyWarning(
      interaction,
      `ERR: 500 - INTERNAL SERVER ERROR. REASON: ${error}`,
      false,
    );
  }
});

async function main() {
  try {
    if (!token || !CLIENT_ID) {
      console.error("Error: TOKEN or CLIENT_ID not defined in .env");
      return;
    }
    console.log("Recarregando comandos de barra /");
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });
    await bot.login(token);
    console.log(commands);
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      console.log("restarting...");
      main();
    }, 1000 * 20);
  }
}
await main();
