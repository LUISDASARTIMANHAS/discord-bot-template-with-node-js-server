import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import {
  setEmbed,
  createTicketChannelFromInteraction,
  closeTicket,
} from "npm-package-nodejs-utils-lda";

/**
 * Handler de botões do sistema de ticket
 * @param {import("discord.js").Interaction} interaction
 */
async function handleTicketButtons(interaction) {
  if (!interaction.isButton()) return;

  // =========================
  // CRIAR TICKET (DINÂMICO)
  // =========================
  if (interaction.customId.startsWith("create_ticket")) {
    const parts = interaction.customId.split(":");

    /**
     * Estrutura esperada:
     * create_ticket:categoryId:staffRoleId
     */
    const categoryId = parts[1] !== "none" ? parts[1] : null;
    const staffRoleId = parts[2] !== "none" ? parts[2] : null;

    const channel = await createTicketChannelFromInteraction(interaction, {
      categoryId,
      staffRoleId,
    });

    if (!channel) return;

    const embed = setEmbed(
      "📩 Ticket Aberto",
      "Descreva seu problema.\nClique no botão abaixo para fechar.",
      0x00ff00,
      "",
      ""
    );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("Fechar Ticket")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({
      content: `<@${interaction.user.id}>`,
      embeds: [embed],
      components: [row],
    });

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: `Ticket criado: ${channel}`,
        ephemeral: true,
      });
    }
  }

  // =========================
  // FECHAR TICKET
  // =========================
  if (interaction.customId === "close_ticket") {
    await closeTicket(interaction);
  }
}

export { handleTicketButtons };