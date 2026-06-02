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
  createStaffDiscussionThread,
  closeTicket,
  parseTicketCreateCustomId,
  parseTicketCloseCustomId,
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isImageUrl(url) {
  return /(\.png|\.jpe?g|\.gif|\.webp|\.svg|\.bmp)(\?.*)?$/i.test(url);
}

async function saveTicketTranscript(channel, interaction) {
  if (!channel || !channel.isTextBased()) return null;

  ensureTranscriptFolder();

  try {
    const messagesCollection = await channel.messages.fetch({ limit: 100 });
    const messages = [...messagesCollection.values()].sort(
      (a, b) => a.createdTimestamp - b.createdTimestamp,
    );

    const now = new Date();
    const header = `Ticket: ${channel.name}\nCanal: ${channel.id}\nCriado por: ${interaction.user.tag}\nFechado em: ${now.toLocaleString("pt-BR")}\nMensagens: ${messages.length}\n\n`;

    const lines = messages.map((message) => {
      const time = new Date(message.createdTimestamp).toLocaleString("pt-BR");
      const author = message.author.tag;
      const content = message.content || "";
      const attachments = message.attachments.size
        ? ` [Anexos: ${message.attachments.map((a) => a.url).join(", ")}]`
        : "";
      return `[${time}] ${author}: ${content}${attachments}`;
    });

    const htmlMessages = messages.map((message) => {
      const time = new Date(message.createdTimestamp).toLocaleString("pt-BR");
      const authorName = escapeHtml(
        message.member?.displayName || message.author.username,
      );
      const authorTag = escapeHtml(message.author.tag);
      const avatar = escapeHtml(
        message.author.displayAvatarURL({ size: 128, extension: "png" }),
      );
      const content = escapeHtml(message.content || "");
      const attachments = message.attachments.map((attachment) => {
        const url = escapeHtml(attachment.url);
        if (isImageUrl(attachment.url)) {
          return `<div class=\"attachment\"><a href=\"${url}\" target=\"_blank\">${escapeHtml(attachment.name || attachment.url)}</a><br><img src=\"${url}\" alt=\"${escapeHtml(attachment.name || "imagem")}\" /></div>`;
        }
        return `<div class=\"attachment\"><a href=\"${url}\" target=\"_blank\">${escapeHtml(attachment.name || attachment.url)}</a></div>`;
      });

      return `
        <div class=\"message\">
          <div class=\"meta\">
            <img class=\"avatar\" src=\"${avatar}\" alt=\"${authorName}\" />
            <div class=\"author-info\">
              <div class=\"author\">${authorName}</div>
              <div class=\"author-tag\">${authorTag}</div>
              <div class=\"timestamp\">${escapeHtml(time)}</div>
            </div>
          </div>
          <div class=\"content\">${content || "<em>Sem texto</em>"}</div>
          ${attachments.length ? attachments.join("") : ""}
        </div>
      `;
    });

    const transcriptPathTxt = path.join(
      TICKET_TRANSCRIPT_DIR,
      `${channel.name}-${channel.id}.txt`,
    );
    const transcriptPathHtml = path.join(
      TICKET_TRANSCRIPT_DIR,
      `${channel.name}-${channel.id}.html`,
    );

    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Transcrição de ${escapeHtml(channel.name)}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 24px; }
    .container { max-width: 900px; margin: 0 auto; background: #111827; border-radius: 16px; padding: 24px; box-shadow: 0 20px 60px rgba(15,23,42,.35); }
    .header { margin-bottom: 24px; }
    .header h1 { margin: 0 0 12px; font-size: 28px; }
    .header p { margin: 4px 0; color: #94a3b8; }
    .message { border-top: 1px solid rgba(148,163,184,.12); padding: 18px 0; }
    .message:first-child { border-top: none; }
    .meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #2563eb; }
    .author-info { display: flex; flex-direction: column; gap: 2px; }
    .author { color: #60a5fa; font-weight: 700; font-size: 16px; }
    .author-tag { color: #94a3b8; font-size: 13px; }
    .timestamp { color: #cbd5e1; font-size: 13px; }
    .content { white-space: pre-wrap; line-height: 1.65; }
    .attachment { margin-top: 12px; }
    .attachment img { max-width: 100%; border-radius: 12px; margin-top: 8px; }
    a { color: #7dd3fc; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Transcrição do Ticket ${escapeHtml(channel.name)}</h1>
      <p>Canal: ${escapeHtml(channel.id)}</p>
      <p>Criado por: ${escapeHtml(interaction.user.tag)}</p>
      <p>Fechado em: ${escapeHtml(now.toLocaleString("pt-BR"))}</p>
      <p>Total de mensagens: ${messages.length}</p>
    </div>
    ${htmlMessages.join("\n")}
  </div>
</body>
</html>`;

    await fwrite(transcriptPathTxt, header + lines.join("\n"));
    await fwrite(transcriptPathHtml, htmlContent);
    return { transcriptPathTxt, transcriptPathHtml };
  } catch (err) {
    console.error("[saveTicketTranscript]:", err);
    return null;
  }
}

async function sendTranscriptToLogChannel(interaction, transcriptData, logChannelId) {
  const channelId = logChannelId || process.env.TICKET_LOG_CHANNEL_ID;
  if (!channelId || !transcriptData) return;

  const logChannel = await interaction.client.channels
    .fetch(channelId)
    .catch(() => null);
  if (!logChannel?.isTextBased()) return;

  const attachments = [];
  if (transcriptData.transcriptPathTxt) {
    attachments.push(new AttachmentBuilder(transcriptData.transcriptPathTxt, {
      name: path.basename(transcriptData.transcriptPathTxt),
    }));
  }
  if (transcriptData.transcriptPathHtml) {
    attachments.push(new AttachmentBuilder(transcriptData.transcriptPathHtml, {
      name: path.basename(transcriptData.transcriptPathHtml),
    }));
  }
  if (!attachments.length) return;

  await logChannel.send({
    content: `🧾 Transcrição do ticket fechado: **${interaction.channel?.name || "sem nome"}**`,
    files: attachments,
  });
}

/**
 * Handler de botões do sistema de ticket
 * @param {import("discord.js").Interaction} interaction
 */
async function handleTicketButtons(interaction) {
  if (!interaction.isButton()) return;

  // =========================
  // CRIAR TICKET (CLASSIFICADO)
  // =========================
  if (interaction.customId.startsWith("create_ticket")) {
    const {
      ticketType,
      categoryId,
      staffRoleId,
      logChannelId,
    } = parseTicketCreateCustomId(interaction.customId);

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
      ticketType,
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

    const staffTopic = await createStaffDiscussionThread(channel, staffRoleId);

    const embed = setEmbed(
      `🎫 Ticket ${ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} Aberto`,
      "Obrigado por abrir um ticket. Nossa equipe de suporte irá responder o mais rápido possível.",
      0x00ff00,
      "Aguardando atendimento",
      "",
    );

    embed.fields = [
      {
        name: "Classificação",
        value: `**${ticketType.toUpperCase()}**`,
        inline: true,
      },
      {
        name: "Usuário",
        value: `<@${interaction.user.id}>`,
        inline: true,
      },
      {
        name: "Instruções",
        value: "Por favor, descreva seu problema com detalhes e adicione capturas de tela quando necessário.",
        inline: false,
      },
      {
        name: "Importante",
        value: "Esta conversa será registrada e arquivada como transcrição após o fechamento. A equipe de suporte tem um tópico privado para discussão.",
        inline: false,
      },
    ];

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`close_ticket:${ticketType}:${logChannelId || "none"}`)
        .setLabel("Fechar Ticket")
        .setStyle(ButtonStyle.Danger),
    );

    const staffMessage = staffTopic
      ? `\n\n🔒 **Tópico de Staff:** ${staffTopic}`
      : "";

    await channel.send({
      content: `<@${interaction.user.id}>${staffMessage}`,
      embeds: [embed],
      components: [row],
    });

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: `✅ Ticket criado: ${channel}\n**Classificação:** ${ticketType.toUpperCase()}`,
      });
    } else {
      await interaction.reply({
        content: `✅ Ticket criado: ${channel}\n**Classificação:** ${ticketType.toUpperCase()}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // =========================
  // FECHAR TICKET
  // =========================
  if (interaction.customId.startsWith("close_ticket")) {
    try {
      const { ticketType, logChannelId: closeLogChannelId } = parseTicketCloseCustomId(
        interaction.customId,
      );

      const transcriptData = await saveTicketTranscript(interaction.channel, interaction);
      await sendTranscriptToLogChannel(interaction, transcriptData, closeLogChannelId);
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