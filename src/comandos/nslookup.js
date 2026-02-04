import { SlashCommandBuilder } from "@discordjs/builders";
import { execCmd } from "./exec.js";

let nslookupCommand = new SlashCommandBuilder()
  .setName("nslookup")
  .setDescription("name server lookup")
  .addStringOption((option) =>
    option
      .setName("domain")
      .setDescription("enter domain or ip to lookup")
      .setRequired(true),
  );

nslookupCommand = nslookupCommand.toJSON();

// help.js
async function handleNslookup(interaction) {
  if (interaction.commandName === "nslookup") {
    const domain = interaction.options.getString("domain");

    try {
      await interaction.reply(`⏳ Executando NSLOOKUP IN ${domain}...`);
      const resultado = await execCmd(`nslookup ${domain}`);
      await interaction.editReply({
        content: `🖥️ Nslookup ${domain}:\n\`\`\`\n${resultado.slice(0, 1900)}\n\`\`\``,
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `⚠️ Erro ao executar:\n\`\`\`\n${(err.message || String(err)).slice(0, 1900)}\n\`\`\``,
      });
    }
  }
}

export { nslookupCommand, handleNslookup };
