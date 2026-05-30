import { SlashCommandBuilder } from "@discordjs/builders";
import {
  getChannelsCount,
  getGuildsCount,
  getUsersCount,
  setEmbed,
} from "npm-package-nodejs-utils-lda";

let statusCommand = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Mostra as estatísticas e o status atual do bot");

statusCommand = statusCommand.toJSON();

function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */
async function handleStatus(interaction) {
  if (interaction.commandName !== "status") return;

  const bot = interaction.client;
  const guilds = getGuildsCount(bot);
  const users = getUsersCount(bot);
  const channels = getChannelsCount(bot);
  const ping = Math.round(bot.ws.ping || 0);
  const uptime = formatUptime(bot.uptime || 0);
  const memoryUsage = process.memoryUsage();
  const heapUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024);

  const embed = setEmbed(
    "📊 Status do Bot",
    "Estatísticas em tempo real do bot e sua atividade atual.",
    0x00aeff,
    "Status",
    ""
  );

  embed.fields = [
    { name: "Servidores", value: `${guilds}`, inline: true },
    { name: "Usuários", value: `${users}`, inline: true },
    { name: "Canais", value: `${channels}`, inline: true },
    { name: "Ping", value: `${ping} ms`, inline: true },
    { name: "Uptime", value: `${uptime}`, inline: true },
    {
      name: "Memória",
      value: `${heapUsed} / ${heapTotal} MB`,
      inline: true,
    },
  ];

  await interaction.reply({ embeds: [embed] });
}

export { statusCommand, handleStatus };