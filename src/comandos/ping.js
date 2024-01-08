import { SlashCommandBuilder } from "@discordjs/builders";

const pingCommand = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Usado para ver o leg e latencia do bot')

export default pingCommand.toJSON();