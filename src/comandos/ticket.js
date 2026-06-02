import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} from "discord.js";
import { createField, setEmbed } from "npm-package-nodejs-utils-lda";

// Definição das classificações de tickets
const TICKET_TYPES = {
  geral: {
    label: "📋 Geral",
    emoji: "📋",
    color: 0x00aeff,
  },
  bug: {
    label: "🐛 Bug",
    emoji: "🐛",
    color: 0xff0000,
  },
  suport: {
    label: "🆘 Suporte",
    emoji: "🆘",
    color: 0x00ff00,
  },
  denuncia: {
    label: "⚠️ Denúncia",
    emoji: "⚠️",
    color: 0xff8800,
  },
  solicitacao: {
    label: "📝 Solicitação",
    emoji: "📝",
    color: 0x00ccff,
  },
};

let ticketCommand = new SlashCommandBuilder()
  .setName("ticket")
  .setDescription("Cria painel de tickets profissional com classificações")
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
      .setDescription("Cargo que terá acesso aos tickets e tópicos privados")
      .setRequired(false),
  )
  .addChannelOption((option) =>
    option
      .setName("log_channel")
      .setDescription("Canal para enviar a transcrição do ticket")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false),
  );

ticketCommand = ticketCommand.toJSON();

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */
async function handleTicket(interaction) {
  if (interaction.commandName !== "ticket") return;

  const categoria = interaction.options.getChannel("categoria");
  const cargo = interaction.options.getRole("cargo_suporte");
  const logChannel = interaction.options.getChannel("log_channel");

  const categoriaTexto = categoria ? categoria.name : "Sem categoria definida";
  const suporteTexto = cargo ? `<@&${cargo.id}>` : "Sem cargo configurado";
  const logChannelTexto = logChannel
    ? `<#${logChannel.id}>`
    : "Sem canal de transcrição definido";

  const embed = setEmbed(
    "🎫 Painel de Tickets Classificados",
    "Abra um ticket de acordo com sua classificação. Todas as conversas são registradas e arquivadas automaticamente. Será criado um tópico privado para a equipe de suporte discutir sobre o ticket.",
    0x00aeff,
    "Suporte",
    "",
    [
      createField(
        "Como funciona",
        "1️⃣ Clique no botão da sua classificação\n2️⃣ Descreva seu problema com detalhes\n3️⃣ Um tópico privado será criado para a staff discutir\n4️⃣ Aguarde nosso atendimento",
      ),
      createField("Categoria", categoriaTexto, true),
      createField("Cargo de suporte", suporteTexto, true),
      createField(
        "Classificações disponíveis",
        "📋 **Geral** - Dúvidas gerais\n🐛 **Bug** - Reportar erros\n🆘 **Suporte** - Ajuda técnica\n⚠️ **Denúncia** - Reportar pessoas/staff\n📝 **Solicitação** - Solicitações especiais",
        false,
      ),
      createField(
        "Boas práticas",
        "Escolha a classificação correta, explique com detalhes, inclua prints quando necessário e não feche o ticket antes da confirmação.",
        false,
      ),
    ],
  );

  // Criar múltiplas linhas de botões (3 na primeira, 2 na segunda)
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(
        `create_ticket:geral:${categoria?.id || "none"}:${cargo?.id || "none"}:${logChannel?.id || "none"}`,
      )
      .setLabel("📋 Geral")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(
        `create_ticket:bug:${categoria?.id || "none"}:${cargo?.id || "none"}:${logChannel?.id || "none"}`,
      )
      .setLabel("🐛 Bug")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(
        `create_ticket:suport:${categoria?.id || "none"}:${cargo?.id || "none"}:${logChannel?.id || "none"}`,
      )
      .setLabel("🆘 Suporte")
      .setStyle(ButtonStyle.Success),
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(
        `create_ticket:denuncia:${categoria?.id || "none"}:${cargo?.id || "none"}:${logChannel?.id || "none"}`,
      )
      .setLabel("⚠️ Denúncia")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(
        `create_ticket:solicitacao:${categoria?.id || "none"}:${cargo?.id || "none"}:${logChannel?.id || "none"}`,
      )
      .setLabel("📝 Solicitação")
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.editReply({
    embeds: [embed],
    components: [row1, row2],
  });
}

export { ticketCommand, handleTicket, TICKET_TYPES };
