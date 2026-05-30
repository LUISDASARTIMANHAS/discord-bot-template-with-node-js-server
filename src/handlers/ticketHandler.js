import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  MessageFlags,
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

    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }

    if (categoryId) {
      const category = interaction.guild?.channels.cache.get(categoryId);
      if (!category || category.type !== ChannelType.GuildCategory) {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({
            content: "Categoria inválida para tickets. Use uma categoria válida.",
          });
        } else {
          await interaction.reply({
            content: "Categoria inválida para tickets. Use uma categoria válida.",
            flags: MessageFlags.Ephemeral,
          });
        }
        return;
      }
    }

    const channel = await createTicketChannelFromInteraction(interaction, {
      categoryId,
      staffRoleId,
    });

    if (!channel) {
      if (!interaction.replied && interaction.deferred) {
        await interaction.editReply({
          content: "Não foi possível abrir o ticket. Tente novamente mais tarde.",
        });
      }
      return;
    }

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

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: `Ticket criado: ${channel}`,
      });
    } else {
      await interaction.reply({
        content: `Ticket criado: ${channel}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // =========================
  // FECHAR TICKET
  // =========================
  if (interaction.customId === "close_ticket") {
    try {
      await closeTicket(interaction);
    } catch (error) {
      console.error(error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "Erro ao fechar o ticket. Tente novamente mais tarde.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }
}

export { handleTicketButtons };