import { ChannelType, PermissionsBitField, ActivityType } from "discord.js";
import {
  fopen,
  getBotPermissionsByInteraction,
  getBotTag,
  getChannelsCount,
  getGuildsCount,
  getRandomInt,
  getUsersCount,
  isDM,
  replyWarning,
} from "npm-package-nodejs-utils-lda";

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
 * Verifica se o bot possui a permissão "ManageMessages" no servidor.
 * Caso contrário, responde com um aviso ao usuário.
 *
 * @param {import("discord.js").Interaction} interaction - Objeto da interação recebida do Discord.
 * @returns {Promise<void>} Retorna uma Promise que resolve quando a verificação termina.
 */

export async function verifyManageMessagesInInteraction(interaction) {
  const botPermissions = getBotPermissionsByInteraction(interaction);

  if ( !botPermissions || !botPermissions.has(PermissionsBitField.Flags.ManageMessages)) {
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
