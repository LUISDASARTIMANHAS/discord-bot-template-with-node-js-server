import { SlashCommandBuilder } from "@discordjs/builders";
import { discordHandleExecTemplate } from "npm-package-nodejs-utils-lda";

let curlCommand = new SlashCommandBuilder()
  .setName("curl")
  .setDescription(
    "curl is used in command lines or scripts to transfer data.",
  )
  .addStringOption((option) =>
    option
      .setName("parameters")
      .setDescription("parameters. curl -d '{'key':'value'}' https://api.example.com")
      .setRequired(false),
  );

curlCommand = curlCommand.toJSON();

// tasklist
async function handleCurl(interaction) {
  if (interaction.commandName === "curl") {
    const parameters = interaction.options.getString("parameters");

    await discordHandleExecTemplate(interaction, `curl ${parameters}`);
  }
}

export { curlCommand, handleCurl };
