// handlers/ticketHandler.js

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
  registerButtonHandler,
  fwrite,
} from "npm-package-nodejs-utils-lda";

import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const TICKET_TRANSCRIPT_DIR = path.join(
  process.cwd(),
  "logs",
  "tickets",
);

function ensureTranscriptFolder() {
  mkdirSync(TICKET_TRANSCRIPT_DIR, { recursive: true });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isImageUrl(url) {
  return /\.(png|jpe?g|gif|webp|svg|bmp)(\?.*)?$/i.test(url);
}

async function saveTicketTranscript(channel, interaction) {
  if (!channel?.isTextBased() || !channel.messages) {
    return null;
  }

  ensureTranscriptFolder();

  try {
    const messagesCollection = await channel.messages.fetch({
      limit: 100,
    });

    const messages = [...messagesCollection.values()].sort(
      (a, b) => a.createdTimestamp - b.createdTimestamp,
    );

    const now = new Date();
    const closedAt = now.toLocaleString("pt-BR");
    const creator = interaction.user?.tag ?? interaction.user?.username ?? "Desconhecido";

    const header = [
      `Ticket: ${channel.name}`,
      `Canal: ${channel.id}`,
      `Fechado por: ${creator}`,
      `Fechado em: ${closedAt}`,
      `Mensagens: ${messages.length}`,
      "",
      "",
    ].join("\n");

    const lines = messages.map((message) => {
      const time = new Date(message.createdTimestamp).toLocaleString("pt-BR");
      const author = message.author?.tag ?? "Desconhecido";
      const content = message.content || "";

      const attachments = message.attachments.size
        ? ` [Anexos: ${message.attachments.map((a) => a.url).join(", ")}]`
        : "";

      return `[${time}] ${author}: ${content}${attachments}`;
    });

    const htmlMessages = messages.map((message) => {
      const time = new Date(message.createdTimestamp).toLocaleString("pt-BR");

      const authorName = escapeHtml(
        message.member?.displayName ||
          message.author?.globalName ||
          message.author?.username ||
          "Desconhecido",
      );

      const authorTag = escapeHtml(
        message.author?.tag ?? message.author?.username ?? "Desconhecido",
      );

      const avatar = escapeHtml(
        message.author?.displayAvatarURL({
          size: 128,
          extension: "png",
        }) ?? "",
      );

      const content = escapeHtml(message.content || "");

      const attachments = [...message.attachments.values()]
        .map((attachment) => {
          const url = escapeHtml(attachment.url);
          const name = escapeHtml(attachment.name || attachment.url);

          if (isImageUrl(attachment.url)) {
            return `
              <div class="attachment">
                <a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>
                <br>
                <img src="${url}" alt="${escapeHtml(attachment.name || "imagem")}" />
              </div>
            `;
          }

          return `
            <div class="attachment">
              <a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>
            </div>
          `;
        })
        .join("");

      return `
        <div class="message">
          <div class="meta">
            <img class="avatar" src="${avatar}" alt="${authorName}" />
            <div class="author-info">
              <div class="author">${authorName}</div>
              <div class="author-tag">${authorTag}</div>
              <div class="timestamp">${escapeHtml(time)}</div>
            </div>
          </div>
          <div class="content">${content || "<em>Sem texto</em>"}</div>
          ${attachments}
        </div>
      `;
    });

    const safeChannelName = channel.name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

    const transcriptPathTxt = path.join(
      TICKET_TRANSCRIPT_DIR,
      `${safeChannelName}-${channel.id}.txt`,
    );

    const transcriptPathHtml = path.join(
      TICKET_TRANSCRIPT_DIR,
      `${safeChannelName}-${channel.id}.html`,
    );

    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Transcrição de ${escapeHtml(channel.name)}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      margin: 0;
      padding: 24px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #111827;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 60px rgba(15,23,42,.35);
    }
    .header { margin-bottom: 24px; }
    .header h1 { margin: 0 0 12px; font-size: 28px; }
    .header p { margin: 4px 0; color: #94a3b8; }
    .message {
      border-top: 1px solid rgba(148,163,184,.12);
      padding: 18px 0;
    }
    .message:first-child { border-top: none; }
    .meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #2563eb;
    }
    .author-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .author { color: #60a5fa; font-weight: 700; font-size: 16px; }
    .author-tag { color: #94a3b8; font-size: 13px; }
    .timestamp { color: #cbd5e1; font-size: 13px; }
    .content { white-space: pre-wrap; line-height: 1.65; }
    .attachment { margin-top: 12px; }
    .attachment img {
      max-width: 100%;
      border-radius: 12px;
      margin-top: 8px;
    }
    a { color: #7dd3fc; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Transcrição do Ticket ${escapeHtml(channel.name)}</h1>
      <p>Canal: ${escapeHtml(channel.id)}</p>
      <p>Fechado por: ${escapeHtml(creator)}</p>
      <p>Fechado em: ${escapeHtml(closedAt)}</p>
      <p>Total de mensagens: ${messages.length}</p>
    </div>
    ${htmlMessages.join("\n")}
  </div>
</body>
</html>`;

    await fwrite(transcriptPathTxt, header + lines.join("\n"));
    await fwrite(transcriptPathHtml, htmlContent);

    return {
      transcriptPathTxt,
      transcriptPathHtml,
    };
  } catch (error) {
    console.error("[ticketHandler] Erro ao gerar transcrição:", error);
    return null;
  }
}

async function sendTranscriptToLogChannel(
  interaction,
  transcriptData,
  logChannelId,
) {
  const channelId =
    logChannelId || process.env.TICKET_LOG_CHANNEL_ID;

  if (!channelId || !transcriptData) {
    return;
  }

  const logChannel = await interaction.client.channels
    .fetch(channelId)
    .catch((error) => {
      console.error("[ticketHandler] Erro ao localizar canal de logs:", error);
      return null;
    });

  if (!logChannel?.isTextBased() || typeof logChannel.send !== "function") {
    console.warn("[ticketHandler] Canal de logs inválido ou indisponível.");
    return;
  }

  const attachments = [];

  if (existsSync(transcriptData.transcriptPathTxt)) {
    attachments.push(
      new AttachmentBuilder(transcriptData.transcriptPathTxt, {
        name: path.basename(transcriptData.transcriptPathTxt),
      }),
    );
  }

  if (existsSync(transcriptData.transcriptPathHtml)) {
    attachments.push(
      new AttachmentBuilder(transcriptData.transcriptPathHtml, {
        name: path.basename(transcriptData.transcriptPathHtml),
      }),
    );
  }

  if (!attachments.length) {
    return;
  }

  await logChannel.send({
    content: `Transcrição do ticket fechado: **${interaction.channel?.name || "sem nome"}**`,
    files: attachments,
  });
}

async function replyEphemeral(interaction, content) {
  if (interaction.deferred) {
    return interaction.editReply({ content });
  }

  if (interaction.replied) {
    return interaction.followUp({
      content,
      flags: MessageFlags.Ephemeral,
    });
  }

  return interaction.reply({
    content,
    flags: MessageFlags.Ephemeral,
  });
}

/**
 * Handler de botões do sistema de tickets.
 * @param {import("discord.js").ButtonInteraction} interaction
 */
async function handleTicketButtons(interaction) {
  if (!interaction.isButton()) {
    return;
  }

  // CRIAR TICKET
  if (interaction.customId.startsWith("create_ticket:")) {
    const {
      ticketType,
      categoryId,
      staffRoleId,
      logChannelId,
    } = parseTicketCreateCustomId(interaction.customId);

    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral,
      });
    }

    if (categoryId) {
      const category = interaction.guild?.channels.cache.get(categoryId);

      if (!category || category.type !== ChannelType.GuildCategory) {
        await replyEphemeral(
          interaction,
          "Categoria inválida para tickets. Selecione uma categoria válida.",
        );
        return;
      }
    }

    const channel = await createTicketChannelFromInteraction(interaction, {
      ticketType,
      categoryId,
      staffRoleId,
    });

    if (!channel) {
      await replyEphemeral(
        interaction,
        "Não foi possível abrir o ticket. Verifique as permissões do bot e tente novamente.",
      );
      return;
    }

    let staffTopic = null;

    try {
      staffTopic = await createStaffDiscussionThread(channel, staffRoleId);
    } catch (error) {
      console.error("[ticketHandler] Erro ao criar tópico da equipe:", error);
    }

    const embed = setEmbed(
      `Ticket ${ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} Aberto`,
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
        value: "Descreva seu problema com detalhes e adicione capturas de tela quando necessário.",
        inline: false,
      },
      {
        name: "Importante",
        value: "Esta conversa poderá ser registrada em uma transcrição após o fechamento.",
        inline: false,
      },
    ];

    const closeCustomId =
      `close_ticket:${ticketType}:${logChannelId || "none"}`;

    // Registra o customId exato no dispatcher do pacote.
    registerButtonHandler(
      closeCustomId,
      handleTicketButtons,
      { replace: true },
    );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(closeCustomId)
        .setLabel("Fechar Ticket")
        .setStyle(ButtonStyle.Danger),
    );

    const staffMessage = staffTopic
      ? `\n\nTópico privado da equipe: ${staffTopic}`
      : "";

    try {
      await channel.send({
        content: `<@${interaction.user.id}>${staffMessage}`,
        embeds: [embed],
        components: [row],
      });
    } catch (error) {
      console.error("[ticketHandler] Erro ao enviar painel do ticket:", error);

      await replyEphemeral(
        interaction,
        `O canal ${channel} foi criado, mas não consegui enviar a mensagem inicial. Verifique as permissões do bot.`,
      );
      return;
    }

    await replyEphemeral(
      interaction,
      `Ticket criado: ${channel}\nClassificação: **${ticketType.toUpperCase()}**`,
    );

    return;
  }

  // FECHAR TICKET
  if (interaction.customId.startsWith("close_ticket:")) {
    // Responde imediatamente para evitar que a interação expire.
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral,
      });
    }

    const { logChannelId } = parseTicketCloseCustomId(
      interaction.customId,
    );

    const channel = interaction.channel;

    if (!channel || !channel.isTextBased()) {
      await replyEphemeral(
        interaction,
        "Não foi possível identificar o canal deste ticket.",
      );
      return;
    }

    // A transcrição não deve impedir o fechamento.
    let transcriptData = null;

    try {
      transcriptData = await saveTicketTranscript(channel, interaction);
    } catch (error) {
      console.error("[ticketHandler] Falha na transcrição:", error);
    }

    try {
      await sendTranscriptToLogChannel(
        interaction,
        transcriptData,
        logChannelId,
      );
    } catch (error) {
      console.error("[ticketHandler] Falha ao enviar a transcrição:", error);
    }

    // closeTicket agenda a exclusão e tenta responder à interação.
    try {
      await closeTicket(interaction);
    } catch (error) {
      console.error("[ticketHandler] Erro ao fechar ticket:", error);

      await replyEphemeral(
        interaction,
        "Não foi possível fechar o ticket. Verifique as permissões do bot.",
      );
    }

    return;
  }
}

// Registra o handler geral para IDs de fechamento criados por este módulo.
// O dispatcher precisa encaminhar os IDs registrados para handleButton.
export { handleTicketButtons };