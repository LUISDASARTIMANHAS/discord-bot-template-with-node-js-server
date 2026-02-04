import { SlashCommandBuilder } from "@discordjs/builders";
import { execCmd } from "./exec.js";

let tracertCommand = new SlashCommandBuilder()
  .setName("tracert")
  .setDescription("tool for recording the response delays and routing loops in a network pathway")
  .addStringOption((option) =>
    option
      .setName("domain")
      .setDescription("enter domain or ip to traceroute")
      .setRequired(true),
  );

tracertCommand = tracertCommand.toJSON();

// help.js
async function handleTracert(interaction) {
  if (interaction.commandName === "tracert") {
    const domain = interaction.options.getString("domain");

    try {
      await interaction.reply(`⏳ Executando tracert IN ${domain}...`);
      const resultado = await execCmd(`tracert ${domain}`);
      await interaction.editReply({
        content: `🖥️ tracert ${domain}:\n\`\`\`\n${resultado.slice(0, 1900)}\n\`\`\``,
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `⚠️ Erro ao executar:\n\`\`\`\n${(err.message || String(err)).slice(0, 1900)}\n\`\`\``,
      });
    }
  }
}

export { tracertCommand, handleTracert };
