import { SlashCommandBuilder } from "@discordjs/builders";
import { discordHandleExecTemplate } from "npm-package-nodejs-utils-lda";

let pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription(
    "ping network utility used to test the connectivity and measure the response time (latency).",
  )
  .addStringOption((option) =>
    option
      .setName("parameters")
      .setDescription("parameters. ping 8.8.8.8")
      .setRequired(false),
  );

pingCommand = pingCommand.toJSON();

// tasklist
async function handlePing(interaction) {
  if (interaction.commandName === "ping") {
    const parameters = interaction.options.getString("parameters");

    await discordHandleExecTemplate(interaction, `ping ${parameters}`);
  }
}

export { pingCommand, handlePing };
