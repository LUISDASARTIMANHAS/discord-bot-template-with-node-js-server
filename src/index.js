import { config } from "dotenv";
import { REST } from "@discordjs/rest";
import { Activity, ActivityType, Client, GatewayIntentBits, Routes } from "discord.js";
import { fopen, fwrite } from "../modules/autoFileSysModule.js";
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
let commands = [];


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
  const info =
      `ℹ️ ${botTag} Conectou-se Ao Servidor De Hosteamento
      \n
      ✅INICIADO POR: WebSiteHost
      \n
      Duração:30Min Ou Infinita Pelo Dedicado
      \n
      **Alterações:**
      \n
      ${configs.lista}
      \n
      Comandos Carregados: ${commands.length/2}`

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
    const ramdomActivity = atividades[getRandomInt(atividades.length-1)];
    const status = [
      {
        name: ramdomActivity,
        type: ActivityType.Competing
      },
      {
        name: "Custom: meu status legal",
        type: ActivityType.Custom
      },
      {
        name: ramdomActivity,
        type: ActivityType.Listening
      },
      {
        name: ramdomActivity,
        type: ActivityType.Playing
      },
      {
        name: ramdomActivity,
        type: ActivityType.Streaming,
        url: "twitch.tv"
      },
      {
        name: ramdomActivity,
        type: ActivityType.Watching
      },
    ]
    const ramdomStatus = status[getRandomInt(status.length-1)]

    bot.user.setActivity(ramdomStatus);
    bot.user.setStatus("idle");
    console.log("STATUS DO DISCORD DO " + botTag);
    console.log(`Atividade do Status: ${ramdomActivity}`);
  }
});

bot.on("interactionCreate", (interaction) => {
	handlePing(interaction);
	handleHelp(interaction);
});

// bot.on("interactionCreate", (interaction) => {
//   if ((interaction.isChatInputCommand()) && (interaction.commandName === 'pedido')) {
//         const comida = interaction.options.get('comidas').value
//         const bebida = interaction.options.get('bebidas').value
//         console.log(comida);
//         console.log(bebida);

//         interaction.reply({
//             content: "Seu pedido foi feito: " + comida + ", e para acompanhar: " + bebida
//         })
//     }
//   if (interaction.isCommand() && interaction.commandName === "sayembed") {
//     const titulo = interaction.options.getString("title");
//     const descricao = interaction.options.getString("description");
//     const color = parseInt(
//       interaction.options.getString("color").replace("#", ""),
//       16
//     ); // Converte a cor hexadecimal para um número inteiro
//     const channel = interaction.options.getChannel("channel");

//     const embed = {
//       title: titulo,
//       description: descricao,
//       color: color,
//     };

//     // Envia o embed diretamente para o canal fornecido
//     interaction.guild.channels.cache.get(channel.id).send({ embeds: [embed] });
//     interaction.reply({
//       content: `Embed enviado para o canal ${channel.name}!`,
//     });
//   }
// });

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