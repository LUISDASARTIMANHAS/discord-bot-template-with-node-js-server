import { exec } from "child_process";
const bloqueados = ["cd", "format", "shutdown", "rd", "del", "rmdir", "erase"];

/**
 * Executa um comando no Windows CMD e retorna a saída.
 * @param {string} cmd - O comando CMD a ser executado.
 * @returns {Promise<string>} - A saída do comando.
 */
export async function execCmd(cmd) {
	if (bloqueados.some((p) => cmd.toLowerCase().includes(p))) {
		throw new Error("🚫 Esse comando é perigoso e foi bloqueado.");
	}
	return new Promise((resolve, reject) => {
		exec(cmd, { shell: "cmd.exe" }, (error, stdout, stderr) => {
			if (error) return reject(stderr || error.message);
			resolve(stdout || "Comando executado sem saída.");
		});
	});
}

/**
 * Estrutura do comando /exec
 */
export const execCommand = {
	name: "exec",
	description: "Executa um comando no sistema (CMD do Windows).",
	options: [
		{
			name: "comando",
			description: "Comando a ser executado.",
			type: 3,
			required: true,
		},
	],
};

/**
 * Lida com a execução do comando /exec
 * @param {import('discord.js').CommandInteraction} interaction
 */
export async function handleExec(interaction) {
	if (interaction.commandName !== "exec") return;

	const comando = interaction.options.getString("comando");

	try {
		await interaction.reply("⏳ Executando comando...");
		const resultado = await execCmd(comando);
		await interaction.editReply({
			content: `🖥️ Saída:\n\`\`\`\n${resultado.slice(0, 1900)}\n\`\`\``,
		});
	} catch (err) {
	console.error(err);
	await interaction.editReply({
		content: `⚠️ Erro ao executar:\n\`\`\`\n${(err.message || String(err)).slice(0, 1900)}\n\`\`\``,
	});
}

}
