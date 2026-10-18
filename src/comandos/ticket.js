// comandos/ticket.js

import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType, ButtonStyle } from "discord.js";

import {
    buildTicketCreateCustomId,
    createContainer,
    createText,
    createSeparator,
    createContainerMessage,
    createButton,
    createButtonRow,
    registerButtonHandler,
} from "npm-package-nodejs-utils-lda";

import { handleTicketButtons } from "../handlers/ticketHandler.js";

// Classificações disponíveis.
const TICKET_TYPES = {
    geral: {
        label: "📋 Geral",
        style: ButtonStyle.Primary,
    },
    bug: {
        label: "🐛 Bug",
        style: ButtonStyle.Danger,
    },
    suport: {
        label: "🆘 Suporte",
        style: ButtonStyle.Success,
    },
    denuncia: {
        label: "⚠️ Denúncia",
        style: ButtonStyle.Secondary,
    },
    solicitacao: {
        label: "📝 Solicitação",
        style: ButtonStyle.Secondary,
    },
};

const ticketCommand = new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Cria um painel profissional de tickets")
    .addChannelOption((option) =>
        option
            .setName("categoria")
            .setDescription("Categoria onde os tickets serão criados")
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(false),
    )
    .addRoleOption((option) =>
        option
            .setName("cargo_suporte")
            .setDescription("Cargo que terá acesso aos tickets")
            .setRequired(false),
    )
    .addChannelOption((option) =>
        option
            .setName("log_channel")
            .setDescription("Canal para enviar a transcrição dos tickets")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false),
    )
    .toJSON();

/**
 * Cria o painel de tickets com Discord Components V2.
 *
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */
async function handleTicket(interaction) {
  if (interaction.commandName !== "ticket") return;

  const categoria = interaction.options.getChannel("categoria");
  const cargo = interaction.options.getRole("cargo_suporte");
  const logChannel = interaction.options.getChannel("log_channel");

  const categoriaId = categoria?.id ?? "none";
  const cargoId = cargo?.id ?? "none";
  const logChannelId = logChannel?.id ?? "none";

  const categoriaTexto = categoria
    ? `<#${categoria.id}>`
    : "Não configurada";

  const suporteTexto = cargo
    ? `<@&${cargo.id}>`
    : "Não configurado";

  const logTexto = logChannel
    ? `<#${logChannel.id}>`
    : "Não configurado";

  // Monta os botões e registra seus handlers pelos customIds exatos.
  const buttons = Object.entries(TICKET_TYPES).map(
    ([type, ticket]) => {
      const customId = buildTicketCreateCustomId(
        type,
        categoriaId,
        cargoId,
        logChannelId,
      );

      registerButtonHandler(customId, handleTicketButtons);

      return createButton({
        customId,
        label: ticket.label,
        style: ticket.style,
      });
    },
  );

  // Container principal.
  const container = createContainer({
    colorHex: 0x00aeff,
  });

  container.addTextDisplayComponents(
    createText("# 🎫 Central de Atendimento"),
    createText(
      "Precisa de ajuda? Escolha abaixo a classificação que melhor corresponde à sua necessidade para abrir um ticket.",
    ),
  );

  container.addSeparatorComponents(createSeparator());

  container.addTextDisplayComponents(
    createText(
      "### Como funciona\n" +
      "1. Selecione uma classificação.\n" +
      "2. Informe os detalhes do seu problema.\n" +
      "3. A equipe de suporte analisará sua solicitação.\n" +
      "4. Aguarde o atendimento no canal criado para você.",
    ),
  );

  container.addSeparatorComponents(createSeparator());

  container.addTextDisplayComponents(
    createText(
      "### Classificações\n" +
      "📋 **Geral** — dúvidas e informações.\n" +
      "🐛 **Bug** — reporte erros e falhas.\n" +
      "🆘 **Suporte** — ajuda técnica.\n" +
      "⚠️ **Denúncia** — reporte ocorrências.\n" +
      "📝 **Solicitação** — pedidos e sugestões.",
    ),
  );

  container.addSeparatorComponents(createSeparator());

  container.addTextDisplayComponents(
    createText(
      "### Configuração do painel\n" +
      `**Categoria:** ${categoriaTexto}\n` +
      `**Equipe:** ${suporteTexto}\n` +
      `**Canal de logs:** ${logTexto}`,
    ),
  );

  container.addSeparatorComponents(createSeparator());

  container.addTextDisplayComponents(
    createText(
      "Escolha uma das opções abaixo para começar. Forneça informações claras e, quando necessário, inclua evidências para ajudar a equipe.",
    ),
  );

  // Os componentes interativos são organizados em Action Rows.
  container.addActionRowComponents(
    createButtonRow(buttons.slice(0, 3)),
    createButtonRow(buttons.slice(3, 5)),
  );

  // Responde ao comando com Components V2.
  const message = createContainerMessage([container]);

  if (interaction.deferred || interaction.replied) {
    await interaction.editReply(message);
  } else {
    await interaction.reply(message);
  }
}

export { ticketCommand, handleTicket, TICKET_TYPES };