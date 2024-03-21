// ping.js
function sendLogs(channelLogs, message) {
    channelLogs.send(message)
}

function sendLogsEmbed(channelLogs, title, description, color,footerText, footerURL) {
    const date = new Date();
    const ano = date.getFullYear();
    const embed = {
        title: title,
        description: description,
        color: color,
        timestamp: date, // Adiciona um timestamp atual
        footer: {
            text: `₢Todos os Direitos Reservados - ${ano} - ${footerText}`,
            icon_url: footerURL
        }

    };
    channelLogs.send({ embeds: [embed] })
}

export {
    sendLogs,
    sendLogsEmbed
};