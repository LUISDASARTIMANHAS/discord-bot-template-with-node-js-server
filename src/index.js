import { config } from "dotenv";
import { REST } from "@discordjs/rest";
import {
  Activity,
  ActivityType,
  Client,
  GatewayIntentBits,
  Routes,
} from "discord.js";
import { fopen, fwrite } from "npm-package-nodejs-utils-lda";
import { helpCommand, handleHelp } from "./comandos/help.js";
import { pingCommand, handlePing } from "./comandos/ping.js";
import { sendLogs, sendLogsEmbed } from "./comandos/sendLogs.js";
import { setStatusCommand, handleSetStatus } from "./comandos/setStatus.js";
import { alterarStatus, validateInteractionChannel, verifyManageMessagesInInteraction } from "./utils.js";

const configs = fopen("./data/config.json");
const date = new Date();
const ano = date.getFullYear();
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
  const usersCount = bot.users.cache.size;
  const channelsCount = bot.channels.cache.size;
  const guildsCount = bot.guilds.cache.size;
  const botTag = bot.user.tag;
  const channelLogs = await bot.channels.fetch("1032778034811506738");
  const info = `ℹ️ ${botTag} Conectou-se Ao Servidor De Hosteamento
      \n
      ✅INICIADO POR: WebSiteHost
      \n
      Duração:30Min Ou Infinita Pelo Dedicado
      \n
      **Alterações:**
      \n
      ${configs.lista}
      \n
      Comandos Carregados: ${commands.length / 2}`;

  alterarStatus();
  setInterval(alterarStatus, 60000);
  sendLogsEmbed(
    channelLogs,
    "**__🖥️MENSAGEM DO SERVIDOR🖥️:__**",
    info,
    16753920,
    "",
    ""
  );

  console.log("Usuários:" + usersCount);
  console.log("Canais:" + channelsCount);
  console.log("Servidores:" + guildsCount);
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
