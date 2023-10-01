const { Client, version } = require("discord.js");
const Discord = require("discord.js");
const config = require("./data/config.json");
const express = require("express");
const { token, descricao, prefix, lista } = config;
const bot = new Client();
const novaLinha = "\n";

bot.on("ready", async () => {
    const embedStatus = new Discord.MessageEmbed();
    const usersCount = bot.users.cache.size;
    const channelsCount = bot.channels.cache.size;
    const guildsCount = bot.guilds.cache.size;
    const botTag = bot.user.tag;
    const flag = "🇧🇷";

    let activities = [
        `Utilize ${prefix}help para obter ajuda`,
        descricao,
        `${guildsCount} servidores!`,
        descricao,
        `${channelsCount} canais!`,
        descricao,
        `${usersCount} usuários!`,
        descricao
    ],
        i = 0;
    alterarStatus();
    setInterval(alterarStatus, 60000);

    function alterarStatus() {
        const activity = activities[i++ % activities.length];

        bot.user.setPresence({
            activity: { type: "WATCHING", name: activity },
        });
        console.log("STATUS DO DISCORD DO comons");
        console.log("Atividade: " + activity);
    }

    console.log("Usuários:" + usersCount);
    console.log("Canais:" + channelsCount);
    console.log("Servidores:" + guildsCount);

    // //pings
    // let info =
    //     "ℹ️" +
    //     botTag +
    //     " Conectou-se Ao Servidor De Hosteamento #01" +
    //     novaLinha +
    //     "✅INICIADO POR: WebSiteHost" +
    //     novaLinha +
    //     "Duração:30Min Ou Infinita Pelo Dedicado" +
    //     novaLinha +
    //     "**Alterações:** " +
    //     lista;

    // embedStatus.setTitle(`**__🖥️MENSAGEM DO SERVIDOR PINGOBRAS🖥️:__**`);
    // embedStatus.setColor("#0000FF");
    // embedStatus.setDescription(info);
    // pingobrasLOG.send(embedStatus);
}); //Fim do ready

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(prefix)) return;
    if (
        message.content.startsWith(`<@!${bot.user.id}`) ||
        message.content.startsWith(`<@${bot.user.id}`)
    )
        return;

    let args = message.content.split(" ").slice(1);
    let comando = message.content.split(" ")[0];

    comando = comando.slice(prefix.length);

    try {
        let pastaComandos = require(`./src/comandos/${comando}.js`);
        delete require.cache[require.resolve(`./src/comandos/${comando}.js`)];
        return pastaComandos.run(bot, message, args);
    } catch (err) {
        console.error("Erro Encontrado: " + err);
    }
});

bot.login(token);
