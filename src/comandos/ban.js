import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionsBitField } from "discord.js";

import {
  replyWarning,
  getGuildByInteraction,
  getUserByInteraction,
  getMemberByInteraction,
  getBotPermissionsByInteraction,
} from "npm-package-nodejs-utils-lda";

let banCommand = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Ban a user from the server")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("User to ban")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Reason for the ban")
      .setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers);

banCommand = banCommand.toJSON();

/**
 * Executa o comando /ban
 *
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @returns {Promise<void>}
 */
async function handleBan(interaction) {
  if (interaction.commandName !== "ban") return;

  const guild = getGuildByInteraction(interaction);
  const moderator = getMemberByInteraction(interaction);

  if (!guild || !moderator) {
    await replyWarning(interaction, "Guild or member not found.");
    return;
  }

  const targetUser = interaction.options.getUser("target");
  const reason =
    interaction.options.getString("reason") || "No reason provided";

  try {
    const targetMember = await guild.members.fetch(targetUser.id);

    if (!targetMember) {
      await replyWarning(interaction, "User not found in this server.");
      return;
    }

    // impedir auto-ban
    if (targetUser.id === getUserByInteraction(interaction)?.id) {
      await replyWarning(interaction, "You cannot ban yourself.");
      return;
    }

    // impedir ban no dono do servidor
    if (targetUser.id === guild.ownerId) {
      await replyWarning(interaction, "You cannot ban the server owner.");
      return;
    }

    // verificar permissões do bot
    const botPermissions = getBotPermissionsByInteraction(interaction);

    if (
      !botPermissions ||
      !botPermissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      await replyWarning(interaction, "I do not have permission to ban users.");
      return;
    }

    // verificar se é possível banir
    if (!targetMember.bannable) {
      await replyWarning(
        interaction,
        "I cannot ban this user (role hierarchy or permissions).",
      );
      return;
    }

    await guild.members.ban(targetUser.id, { reason });

    await interaction.reply({
      content: `🔨 User **${targetUser.tag}** was banned.\nReason: ${reason}`,
    });
  } catch (err) {
    console.error(err);
    await replyWarning(interaction, `Error banning user: ${err.message}`);
  }
}

export { banCommand, handleBan };