import { ChannelType, PermissionsBitField } from "discord.js";


export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Altera o status do bot de forma aleatória entre diferentes atividades e tipos.
 *
 * @param {import("discord.js").Client} bot - Instância do cliente do Discord.
 * @param {import("discord.js").ActivityType} ActivityType - Tipos de atividades (Competing, Playing, Listening, etc.)
 * @param {object} stats - Estatísticas do servidor para exibir no status.
 * @param {number} stats.guildsCount - Número de servidores em que o bot está.
 * @param {number} stats.channelsCount - Número de canais.
 * @param {number} stats.usersCount - Número de usuários.
 * @param {object} configs - Configurações do bot contendo flag e descrição.
 * @param {string} configs.flag - Símbolo ou bandeira.
 * @param {string} configs.descricao - Descrição do bot.
 * @param {string|number} ano - Ano atual ou variável de referência.
 * @param {string} botTag - Tag do bot para logs.
 * @returns {void} Atualiza o status e loga no console.
 */
export function alterarStatus(bot, ActivityType, stats, configs, ano, botTag) {
  // Cria uma lista de mensagens possíveis de status
  const atividades = [
    `${stats.guildsCount} servidores!`,
    `${configs.flag} ${configs.descricao} ${ano}`,
    `${stats.channelsCount} canais!`,
    `${configs.flag} ${configs.descricao} ${ano}`,
    `${stats.usersCount} usuários!`,
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
    { name: randomActivity, type: ActivityType.Streaming, url: "https://twitch.tv" },
    { name: randomActivity, type: ActivityType.Watching },
  ];

  // Seleciona um status aleatório
  const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

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
  return interaction.guild.members.me.permissions;
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
  const channel = getChannelFromInteraction(interaction);

  if (!channel || channel.type === ChannelType.DM) {
    return replyWarning(
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
    ephemeral: isPrivate,
  });
}