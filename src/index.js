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
  const atividades = [
    `${guildsCount} servidores!`,
    configs.flag + configs.descricao + ano,
    `${channelsCount} canais!`,
    configs.flag + configs.descricao + ano,
    `${usersCount} usuários!`,
    configs.flag + configs.descricao + ano,
  ];
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

  function alterarStatus() {
    const ramdomActivity = atividades[getRandomInt(atividades.length - 1)];
    const status = [
      {
        name: ramdomActivity,
        type: ActivityType.Competing,
      },
      {
        name: "Custom: meu status legal",
        type: ActivityType.Custom,
      },
      {
        name: ramdomActivity,
        type: ActivityType.Listening,
      },
      {
        name: ramdomActivity,
        type: ActivityType.Playing,
      },
      {
        name: ramdomActivity,
        type: ActivityType.Streaming,
        url: "twitch.tv",
      },
      {
        name: ramdomActivity,
        type: ActivityType.Watching,
      },
    ];
    const ramdomStatus = status[getRandomInt(status.length - 1)];

    bot.user.setActivity(ramdomStatus);
    bot.user.setStatus("idle");
    console.log("STATUS DO DISCORD DO " + botTag);
    console.log(`Atividade do Status: ${ramdomActivity}`);
  }
});

bot.on("interactionCreate", (interaction) => {
  if (
    interaction.channel?.type == ChannelType.DM ||
    interaction.channel?.type == undefined
  ) {
    return interaction.reply(
      ":warning: Não e permitido usar comandos em DM. Procure um servidor para usar esse comando."
    );
  }

  var getBotPermissons = interaction.guild.members.me.permissions;
  if (!getBotPermissons.has(PermissionsBitField.Flags.ManageMessages)) {
    return interaction.reply(
      ":warning: Não tenho permissões de gerenciar mensagens! ```ManageMessages```"
    );
  }
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
