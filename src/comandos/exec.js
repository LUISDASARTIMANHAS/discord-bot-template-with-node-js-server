// comandos/exec.js
import { exec } from "child_process";

/**
 * Executa um comando no Windows CMD e retorna a saída.
 * @param {string} cmd - O comando CMD a ser executado.
 * @returns {Promise<string>} - A saída do comando.
 */
export function execCmd(cmd) {
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
			type: 3, // STRING
			required: true,
		},
	],
};

/**
 * Lida com a execução do comando /exec
 * @param {import('discord.js').CommandInteraction} interaction - Interação recebida.
 */
export async function handleExec(interaction) {
	const OWNER_ID = "SEU_ID_DISCORD_AQUI"; // Substitua pelo seu ID real
	const comando = interaction.options.getString("comando");

	if (interaction.user.id !== OWNER_ID) {
		return await interaction.reply({
			content: "❌ Você não tem permissão para usar este comando.",
			ephemeral: true,
		});
	}

	const bloqueados = ["format", "shutdown", "rd", "del", "rmdir", "erase"];
	if (bloqueados.some((p) => comando.toLowerCase().includes(p))) {
		return await interaction.reply({
			content: "🚫 Esse comando é perigoso e foi bloqueado.",
			ephemeral: true,
		});
	}

	try {
		await interaction.reply("⏳ Executando comando...");
		const resultado = await execCmd(comando);
		await interaction.editReply({
			content: `🖥️ Saída:\n\`\`\`\n${resultado.slice(0, 1900)}\n\`\`\``,
		});
	} catch (err) {
		await interaction.editReply({
			content: `⚠️ Erro ao executar:\n\`\`\`\n${err.slice(0, 1900)}\n\`\`\``,
		});
	}
}
