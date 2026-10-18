// handlers/ticketHandler.js

import {
  createTicketSystem,
  registerButtonHandler,
} from "npm-package-nodejs-utils-lda";

export const ticketSystem = createTicketSystem({
  colors: {
    opened: 0x00ff00,
  },

  transcripts: {
    enabled: true,
    formats: ["txt", "html"],
    directory: "logs/tickets",
    channelId: process.env.TICKET_LOG_CHANNEL_ID,
    messageLimit: 100,
  },

  messages: {
    invalidCategory:
      "Categoria inválida para tickets. Selecione uma categoria válida.",

    createError:
      "Não foi possível abrir o ticket. Verifique as permissões do bot.",

    closeError:
      "Não foi possível fechar o ticket. Verifique as permissões do bot.",
  },
});

/**
 * Handler central dos botões de tickets.
 * Encaminha a interação para o sistema de tickets.
 *
 * @param {import("discord.js").ButtonInteraction} interaction
 * @returns {Promise<boolean>}
 */
export async function handleTicketButtons(interaction) {
  console.log("[TICKET] handleTicketButtons foi chamado.");
  console.log("[TICKET] Custom ID:", interaction.customId);

  try {
    const result = await ticketSystem.handleInteraction(interaction);
    console.log("[TICKET] handleInteraction retornou:", result);
    return result;
  } catch (error) {
    console.error("[TICKET] Erro no sistema de tickets:", error);
    throw error;
  }
}

// Registra os handlers por prefixo apenas uma vez,
// quando este módulo é carregado.
registerButtonHandler(
  "create_ticket:",
  handleTicketButtons,
  { prefix: true },
);

registerButtonHandler(
  "close_ticket:",
  handleTicketButtons,
  { prefix: true },
);