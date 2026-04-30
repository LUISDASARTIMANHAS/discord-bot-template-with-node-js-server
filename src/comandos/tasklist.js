import { SlashCommandBuilder } from "@discordjs/builders";
import { discordHandleExecTemplate } from "npm-package-nodejs-utils-lda";

let tasklistCommand = new SlashCommandBuilder()
  .setName("tasklist")
  .setDescription(
    "Windows que exibe todos os processos e programas em execução no computador local ou remoto.",
  )
  .addStringOption((option) =>
    option
      .setName("parameters")
      .setDescription("parameters. tasklist /v /fi 'PID gt 1000' /fo csv")
      .setRequired(false),
  );

tasklistCommand = tasklistCommand.toJSON();

// tasklist
async function handleTasklist(interaction) {
  if (interaction.commandName === "tasklist") {
    const parameters = interaction.options.getString("parameters");

    discordHandleExecTemplate(interaction, "tasklist",parameters);
  }
}

export { tasklistCommand, handleTasklist };
