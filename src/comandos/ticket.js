import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";
import { setEmbed } from "npm-package-nodejs-utils-lda";

let ticketCommand = new SlashCommandBuilder()
  .setName("ticket")
  .setDescription("Cria painel de tickets profissional")
  .addChannelOption((option) =>
    option
      .setName("categoria")
      .setDescription("Categoria onde os tickets serão criados")
      .addChannelTypes(ChannelType.GuildCategory)
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

  const categoriaTexto = categoria ? categoria.name : "Sem categoria definida";
  const suporteTexto = cargo ? `<@&${cargo.id}>` : "Sem cargo configurado";

  const embed = setEmbed(
    "🎫 Painel de Tickets",
    "Abra um ticket para falar diretamente com a nossa equipe de suporte. Todas as conversas são registradas e arquivadas automaticamente.",
    0x00aeff,
    "Suporte",
    ""
  );

  embed.fields = [
    {
      name: "Como funciona",
      value: "1️⃣ Clique em **Abrir Ticket**\n2️⃣ Descreva seu problema com detalhes\n3️⃣ Aguarde nosso atendimento na conversa privada",
      inline: false,
    },
    { name: "Categoria", value: categoriaTexto, inline: true },
    { name: "Cargo de suporte", value: suporteTexto, inline: true },
    {
      name: "Boas práticas",
      value: "Explique o problema, inclua prints se puder e não feche o ticket antes de receber a confirmação.",
      inline: false,
    },
  ];

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(
        `create_ticket:${categoria?.id || "none"}:${cargo?.id || "none"}`
      )
      .setLabel("Abrir Ticket")
      .setStyle(ButtonStyle.Success)
  );

  await interaction.editReply({
    embeds: [embed],
    components: [row],
  });
}

export { ticketCommand, handleTicket };