import { SlashCommandBuilder } from "@discordjs/builders";

const helpCommand = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Usado para ver os comandos e informações')

export default helpCommand.toJSON();

// const Discord = require("discord.js");
// const embed = new Discord.MessageEmbed();
// const {comandos, prefix} = require("../../data/config.json");

// module.exports.run = async (bot, message, args) => {
//   const novaLinha = "\n";

//   let info = "ℹ️__**prefixo:**__ " + prefix + novaLinha;

//   // Iterar sobre cada comando no JSON
//   comandos.forEach((comando) => {
//     info += "__**"+comando.title+"**__" + 
//      novaLinha +
//     comando.description +
//     novaLinha
//   });
  
//   embed.setTitle(`**__PAINEL DE AJUDA__**`);
//   embed.setColor("#FF00FF");
//   embed.setDescription(info);
//   embed.setTimestamp();

//   message.delete().catch((O_o) => {});
//   message.channel.send(embed);
// };