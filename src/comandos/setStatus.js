import { fopen, fwrite } from "npm-package-nodejs-utils-lda";
import { SlashCommandBuilder } from "@discordjs/builders";
const configs = fopen("./data/config.json");

let setStatusCommand = new SlashCommandBuilder()
  .setName("set-status")
  .setDescription("Usado para definir o status do bot.")
  .addStringOption((option) =>
    option
      .setName("status")
      .setDescription("Qual o tipo do status?")
      .setRequired(true)
      .setChoices(
        {
          name: "Online",
          value: "online",
        },
        {
          name: "Não pertubar",
          value: "dnd",
        },
        {
          name: "Ausente",
          value: "idle",
        },
        {
          name: "Invisível",
          value: "invisible",
        }
      )
  )
  .addStringOption((option) =>
    option
      .setName("descrição")
      .setDescription("Qual a descrição do status?")
      .setRequired(true)
  );
setStatusCommand = setStatusCommand.toJSON();

function handleSetStatus(interaction) {
  if (interaction.commandName === "set-status") {
    const options = interaction.options;
    const status = options.get("status").value;
    const descricao = options.get("descrição").value;
    configs.descricao = descricao;
    configs.typeStatus = status;

    fwrite("./data/config.json", configs);
    interaction.reply(
      `O status foi alterado para: ${status} com descrição padrão: ${descricao}.
			O bot sera reiniciado para aplicar configurações.`
    );
    setTimeout(() => interaction.deleteReply(), 2000);
  }
}

export { setStatusCommand, handleSetStatus };
