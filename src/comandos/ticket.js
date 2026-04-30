import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { setEmbed } from "npm-package-nodejs-utils-lda";

let ticketCommand = new SlashCommandBuilder()
  .setName("ticket")
  .setDescription("Cria painel de tickets")
  .addChannelOption((option) =>
    option
      .setName("categoria")
      .setDescription("Categoria onde os tickets serão criados")
      .setRequired(false)
  )
  .addRoleOption((option) =>
    option
      .setName("cargo_suporte")
      .setDescription("Cargo que terá acesso aos tickets")
      .setRequired(false)
  );

ticketCommand = ticketCommand.toJSON();

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */
async function handleTicket(interaction) {
  if (interaction.commandName !== "ticket") return;

  const categoria = interaction.options.getChannel("categoria");
  const cargo = interaction.options.getRole("cargo_suporte");

  const embed = setEmbed(
    "🎫 Sistema de Tickets",
    "Clique no botão abaixo para abrir um ticket.",
    0x00aeff,
    "Suporte",
    ""
  );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(
        `create_ticket:${categoria?.id || "none"}:${cargo?.id || "none"}`
      )
      .setLabel("Abrir Ticket")
      .setStyle(ButtonStyle.Success)
  );

  await interaction.reply({
    embeds: [embed],
    components: [row],
  });
}

export { ticketCommand, handleTicket };