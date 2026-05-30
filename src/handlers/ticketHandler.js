import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  MessageFlags,
} from "discord.js";
import {
  setEmbed,
  createTicketChannelFromInteraction,
  closeTicket,
  fwrite,
} from "npm-package-nodejs-utils-lda";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const TICKET_TRANSCRIPT_DIR = path.join(process.cwd(), "logs", "tickets");

function ensureTranscriptFolder() {
  if (!existsSync(TICKET_TRANSCRIPT_DIR)) {
    mkdirSync(TICKET_TRANSCRIPT_DIR, { recursive: true });
  }
}

async function saveTicketTranscript(channel, interaction) {
  if (!channel || !channel.isTextBased()) return null;

  ensureTranscriptFolder();

  try {
    const messagesCollection = await channel.messages.fetch({ limit: 100 });
    const messages = [...messagesCollection.values()].sort(
      (a, b) => a.createdTimestamp - b.createdTimestamp,
    );

    const header = `Ticket: ${channel.name}\nCanal: ${channel.id}\nCriado por: ${interaction.user.tag}\nFechado em: ${new Date().toLocaleString("pt-BR")}\nMensagens: ${messages.length}\n\n`;

    const lines = messages.map((message) => {
      const time = new Date(message.createdTimestamp).toLocaleString("pt-BR");
      const author = message.author.tag;
      const content = message.content || "";
      const attachments = message.attachments.size
        ? ` [Anexos: ${message.attachments.map((a) => a.url).join(", ")}]`
        : "";
      return `[${time}] ${author}: ${content}${attachments}`;
    });

    const transcriptPath = path.join(
      TICKET_TRANSCRIPT_DIR,
      `${channel.name}-${channel.id}.txt`,
    );

    await fwrite(transcriptPath, header + lines.join("\n"));
    return transcriptPath;
  } catch (err) {
    console.error("[saveTicketTranscript]:", err);
    return null;
  }
}

async function sendTranscriptToLogChannel(interaction, transcriptPath) {
  const logChannelId = process.env.TICKET_LOG_CHANNEL_ID;
  if (!logChannelId || !transcriptPath) return;

  const logChannel = await interaction.client.channels
    .fetch(logChannelId)
    .catch(() => null);
  if (!logChannel?.isTextBased()) return;

  const attachment = new AttachmentBuilder(transcriptPath, {
    name: path.basename(transcriptPath),
  });

  await logChannel.send({
    content: `🧾 Transcrição do ticket fechado: **${interaction.channel?.name || "sem nome"}**`,
    files: [attachment],
  });
}

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

    if (categoryId) {
      const category = interaction.guild?.channels.cache.get(categoryId);
      if (!category || category.type !== ChannelType.GuildCategory) {
        await interaction.reply({
          content: "Categoria inválida para tickets. Use uma categoria válida.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    const channel = await createTicketChannelFromInteraction(interaction, {
      categoryId,
      staffRoleId,
    });

    if (!channel) return;

    await channel.setTopic(
      `Ticket de ${interaction.user.tag} • Aberto em ${new Date().toLocaleString("pt-BR")}`,
    ).catch(() => null);

    const embed = setEmbed(
      "📩 Ticket Aberto",
      "Obrigado por abrir um ticket. Nossa equipe de suporte irá responder o mais rápido possível.",
      0x00ff00,
      "Aguardando atendimento",
      "",
    );

    embed.fields = [
      {
        name: "Instruções",
        value: "Por favor, descreva seu problema com detalhes e adicione capturas de tela quando necessário.",
        inline: false,
      },
      {
        name: "Importante",
        value: "Esta conversa será registrada e arquivada como transcrição após o fechamento.",
        inline: false,
      },
    ];

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("Fechar Ticket")
        .setStyle(ButtonStyle.Danger),
    );

    await channel.send({
      content: `<@${interaction.user.id}>`,
      embeds: [embed],
      components: [row],
    });

    if (!interaction.replied && !interaction.deferred) {
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
      const transcriptPath = await saveTicketTranscript(interaction.channel, interaction);
      await sendTranscriptToLogChannel(interaction, transcriptPath);
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