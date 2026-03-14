import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionsBitField } from "discord.js";

import {
  banUser,
  replyWarning
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

  const targetUser = interaction.options.getUser("target");
  const reason =
    interaction.options.getString("reason") || "No reason provided";

  const success = await banUser(interaction, targetUser, reason);

  if (!success) return;

  await interaction.reply({
    content: `🔨 User **${targetUser.tag}** was banned.\nReason: ${reason}`,
  });
}

export { banCommand, handleBan };