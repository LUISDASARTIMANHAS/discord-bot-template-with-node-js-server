import { SlashCommandBuilder } from "@discordjs/builders";
import { execCmd } from "npm-package-nodejs-utils-lda";

let tasklistCommand = new SlashCommandBuilder()
  .setName("tasklist")
  .setDescription("Windows que exibe todos os processos e programas em execução no computador local ou remoto.")
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

    try {
      await interaction.reply(`⏳ Executando tasklist ${parameters}...`);
      const resultado = await execCmd(`tasklist ${parameters}`);
      await interaction.editReply({
        content: `🖥️ tasklist ${parameters}:\n\`\`\`\n${resultado.slice(0, 1900)}\n\`\`\``,
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `⚠️ Erro ao executar:\n\`\`\`\n${(err.message || String(err)).slice(0, 1900)}\n\`\`\``,
      });
    }
  }
}

export { tasklistCommand, handleTasklist };
