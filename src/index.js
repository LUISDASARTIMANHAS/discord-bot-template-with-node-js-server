import { config } from "dotenv";
import { REST } from "@discordjs/rest";
import {
  Client,
  GatewayIntentBits,
  Routes,
} from "discord.js";
import { fopen, fwrite } from "npm-package-nodejs-utils-lda";
import { helpCommand, handleHelp } from "./comandos/help.js";
import { pingCommand, handlePing } from "./comandos/ping.js";
import { sendLogs, sendLogsEmbed } from "./comandos/sendLogs.js";
import { setStatusCommand, handleSetStatus } from "./comandos/setStatus.js";
import {
  alterarStatus,
  getChannelsCount,
  getGuildsCount,
  getUsersCount,
  validateInteractionChannel,
  verifyManageMessagesInInteraction,
} from "./utils.js";
config();
const token = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const rest = new REST({ version: "10" }).setToken(token);
let commands = [helpCommand, pingCommand, setStatusCommand];

bot.on("ready", async () => {
  const channelLogs = await bot.channels.fetch("1032778034811506738");

  alterarStatus(bot);
  setInterval(alterarStatus, 60000);
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

bot.on("interactionCreate", (interaction) => {
  validateInteractionChannel(interaction);

  verifyManageMessagesInInteraction(interaction);
  handlePing(interaction);
  handleHelp(interaction);
  handleSetStatus(interaction);
});

async function main() {
  try {
    console.log("Recarregando comandos de barra /");
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });
    bot.login(token);
  } catch (err) {
    console.log(err);
  }
}
main();
