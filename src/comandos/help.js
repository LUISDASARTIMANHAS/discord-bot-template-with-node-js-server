import { SlashCommandBuilder } from "@discordjs/builders";

let helpCommand = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Usado para ver os comandos e informações");

helpCommand = helpCommand.toJSON();

// help.js
function handleHelp(interaction) {
  if (interaction.commandName === "help") {
    const date = new Date();
    const ano = date.getFullYear();
    let info = "";
    let comandos = [{ title: "a", description: "a" }];
    // Iterar sobre cada comando no JSON
    comandos.forEach((comando) => {
      info += `__**${comando.title}**__
							${comando.description}
							`;
    });

    const embed = {
      title: "**__PAINEL DE AJUDA__**",
      description: info,
      color: parseInt("FF00FF", 16),
      timestamp: date, // Adiciona um timestamp atual
      footer: {
        text: `₢Todos os Direitos Reservados - ${ano}`,
      },
    };

    interaction.reply({ embeds: [embed] });
  }
}

export { helpCommand, handleHelp };
