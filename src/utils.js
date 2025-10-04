import { ChannelType, PermissionsBitField, ActivityType } from "discord.js";
import { fopen, getRandomInt } from "npm-package-nodejs-utils-lda";

/**
 * Retorna o número de usuários que o bot consegue ver.
 * @param {import("discord.js").Client} bot - Instância do cliente Discord
 * @returns {number} Número total de usuários
 */
export function getUsersCount(bot) {
  // Soma de todos os membros nos servidores que o bot consegue acessar
  return bot.guilds.cache.reduce(
    (total, guild) => total + guild.memberCount,
    0
  );
}

/**
 * Retorna o número de canais que o bot consegue ver.
 * @param {import("discord.js").Client} bot - Instância do cliente Discord
 * @returns {number} Número total de canais
 */
export function getChannelsCount(bot) {
  return bot.channels.cache.size;
}

/**
 * Retorna o número de servidores em que o bot está.
 * @param {import("discord.js").Client} bot - Instância do cliente Discord
 * @returns {number} Número total de servidores
 */
export function getGuildsCount(bot) {
  return bot.guilds.cache.size;
}

/**
 * Retorna a tag do bot (nome#1234)
 * @param {import("discord.js").Client} bot - Instância do cliente Discord
 * @returns {string} Tag do bot
 */
export function getBotTag(bot) {
  return bot.user?.tag ?? "Desconhecido#0000";
}

/**
 * Altera o status do bot de forma aleatória entre diferentes atividades e tipos.
 *
 * @param {import("discord.js").Client} bot - Instância do cliente Discord.
 * @param {string} configs.descricao - Descrição do bot.
 * @returns {void} Atualiza o status do bot e loga informações no console.
 */
export function alterarStatus(bot) {
  const date = new Date();
  const ano = date.getFullYear();
  const configs = fopen("./data/config.json");
  const guildsCount = getGuildsCount(bot);
  const channelsCount = getChannelsCount(bot);
  const usersCount = getUsersCount(bot);
  const botTag = getBotTag(bot);

  // Lista de mensagens possíveis de status
  const atividades = [
    `${guildsCount} servidores!`,
    `${configs.flag} ${configs.descricao} ${ano}`,
    `${channelsCount} canais!`,
    `${configs.flag} ${configs.descricao} ${ano}`,
    `${usersCount} usuários!`,
    `${configs.flag} ${configs.descricao} ${ano}`,
  ];

  // Seleciona uma atividade aleatória
  const randomActivity = atividades[getRandomInt(atividades.length)];

  // Define possíveis tipos de status
  const statusOptions = [
    { name: randomActivity, type: ActivityType.Competing },
    { name: "Custom: meu status legal", type: ActivityType.Custom },
    { name: randomActivity, type: ActivityType.Listening },
    { name: randomActivity, type: ActivityType.Playing },
    {
      name: randomActivity,
      type: ActivityType.Streaming,
      url: "https://twitch.tv",
    },
    { name: randomActivity, type: ActivityType.Watching },
  ];

  // Seleciona um status aleatório
  const randomStatus = statusOptions[getRandomInt(statusOptions.length)];

  // Atualiza status do bot
  bot.user.setActivity(randomStatus);
  bot.user.setStatus("idle");

  // Loga informações
  console.log(`STATUS DO DISCORD DO ${botTag}`);
  console.log(`Atividade do Status: ${randomActivity}`);
}

/**
 * Obtém as permissões atuais do bot dentro de uma interação.
 *
 * @param {import("discord.js").Interaction} interaction - Objeto da interação recebida do Discord.
 * @returns {import("discord.js").PermissionsBitField} Retorna as permissões atuais do bot no servidor.
 */
export function getBotPermissionsByInteraction(interaction) {
  if (!interaction.guild) {
    return null; // Sem guild, não tem permissões
  }
  return interaction.guild.members.me?.permissions ?? null;
}

/**
 * Verifica se a interação aconteceu em DM ou em um servidor.
 *
 * @param {import("discord.js").Interaction} interaction - Interação recebida do Discord.
 * @returns {boolean} Retorna true se for DM, false se for em servidor.
 */
export function isDM(interaction) {
  // Se não tiver guild ou o canal for DM
  return !interaction.guild || interaction.channel?.type === ChannelType.DM;
}

/**
 * Verifica se o bot possui a permissão "ManageMessages" no servidor.
 * Caso contrário, responde com um aviso ao usuário.
 *
 * @param {import("discord.js").Interaction} interaction - Objeto da interação recebida do Discord.
 * @returns {Promise<void>} Retorna uma Promise que resolve quando a verificação termina.
 */

export async function verifyManageMessagesInInteraction(interaction) {
  const botPermissions = getBotPermissionsByInteraction(interaction);

  if (!botPermissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return await replyWarning(
      interaction,
      "Não tenho permissões de gerenciar mensagens! \n I don't have permissions to manage messages!",
      false
    );
  }
}

/**
 * Verifica se a interação está ocorrendo em um canal de servidor válido.
 * Caso seja em DM ou o canal seja indefinido, retorna uma resposta e false.
 *
 * @param {import("discord.js").Interaction} interaction - Objeto da interação do Discord.
 * @returns {Promise<boolean | void>} Retorna false se for em DM, ou void se o canal for válido.
 */
export async function validateInteractionChannel(interaction) {
  if (isDM(interaction)) {
    return await replyWarning(
      interaction,
      "Não é permitido usar comandos em DM. Procure um servidor para usar esse comando."
    );
  }
}

/**
 * Retorna o canal de uma interação de forma segura.
 *
 * @param {import("discord.js").Interaction} interaction - Objeto da interação do Discord.
 * @returns {import("discord.js").Channel | null} Retorna o canal da interação ou null se não existir.
 */
export function getChannelFromInteraction(interaction) {
  return interaction?.channel ?? null;
}

/**
 * Envia uma mensagem de aviso para o usuário dentro da interação.
 *
 * @param {import("discord.js").Interaction} interaction - Objeto da interação onde a resposta será enviada.
 * @param {string} message - Mensagem de aviso a ser exibida.
 * @param {boolean} [isPrivate=true] - Define se a resposta será visível apenas para o autor da interação.
 * @returns {Promise<void>} Retorna uma Promise que resolve quando a resposta for enviada.
 */

export async function replyWarning(interaction, message, isPrivate = true) {
  if (interaction.replied || interaction.deferred) return;

  await interaction.reply({
    content: `:warning: ${message}`,
    flags: isPrivate ? 64 : 0, // 64 = EPHEMERAL
  });
}
