import { SlashCommandBuilder } from "@discordjs/builders";

let latencyCommand = new SlashCommandBuilder()
    .setName('latency')
    .setDescription('Usado para ver o lag e latencia do bot')
latencyCommand = latencyCommand.toJSON();
// ping.js
function handleLatency(interaction) {
    if (interaction.commandName === 'latency') {
        interaction.reply('Pong!');
    }
}

export { latencyCommand, handleLatency };