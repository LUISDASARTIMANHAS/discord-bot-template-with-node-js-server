import { SlashCommandBuilder } from "@discordjs/builders";

let helpCommand = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Usado para ver os comandos e informações')

helpCommand = helpCommand.toJSON();

// help.js
function handleHelp(interaction) {
    if (interaction.commandName === 'help') {
        const novaLinha = "\n";
        let info = "ℹ️__**prefixo:**__ " + prefix + novaLinha;

        // Iterar sobre cada comando no JSON
        comandos.forEach((comando) => {
            info += "__**" + comando.title + "**__" +
                novaLinha +
                comando.description +
                novaLinha
        });

        const embed = new Discord.MessageEmbed();
        embed.setTitle(`**__PAINEL DE AJUDA__**`);
        embed.setColor("#FF00FF");
        embed.setDescription(info);
        embed.setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
}

export {
    helpCommand,
    handleHelp
}