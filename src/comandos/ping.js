import { SlashCommandBuilder } from "@discordjs/builders";

let pingCommand = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Usado para ver o leg e latencia do bot')
pingCommand = pingCommand.toJSON();
// ping.js
function handlePing(interaction) {
    if (interaction.commandName === 'ping') {
        interaction.reply('Pong!');
    }
}

export {
    pingCommand,
    handlePing
};