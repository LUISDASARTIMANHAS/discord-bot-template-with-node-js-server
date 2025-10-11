import { config } from "dotenv";
import { REST } from "@discordjs/rest";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import {
  fopen,
  fwrite,
  getBotPermissionsByInteraction,
  getChannelsCount,
  getGuildsCount,
  getInteractionSummary,
  getUsersCount,
  isDM,
  replyWarning,
} from "npm-package-nodejs-utils-lda";
import { helpCommand, handleHelp } from "./comandos/help.js";
import { pingCommand, handlePing } from "./comandos/ping.js";
import { sendLogs, sendLogsEmbed } from "./comandos/sendLogs.js";
import { setStatusCommand, handleSetStatus } from "./comandos/setStatus.js";
import { execCommand, handleExec } from "./comandos/exec.js";
import {
  alterarStatus,
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
let commands = [helpCommand, pingCommand, setStatusCommand,execCommand];

bot.on("clientReady", async () => {
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

bot.on("interactionCreate", async (interaction) => {
  const botPermissions = getBotPermissionsByInteraction(interaction);
  const interactionSummary = getInteractionSummary(interaction);
  console.log(interactionSummary);
  if (isDM(interaction)) {
    return await replyWarning(
      interaction,
      "Não é permitido usar comandos em DM. Procure um servidor para usar esse comando."
    );
  }

  if (
    !botPermissions ||
    !botPermissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    return await replyWarning(
      interaction,
      "Não tenho permissões de gerenciar mensagens! \n I don't have permissions to manage messages!",
      false
    );
  }
  handlePing(interaction);
  handleHelp(interaction);
  handleSetStatus(interaction);
  handleExec(interaction);
});

async function main() {
  try {
    console.log("Recarregando comandos de barra /");
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });
    await bot.login(token);
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      console.log("restarting...");
      main();
    }, 1000 * 20);
  }
}
main();
