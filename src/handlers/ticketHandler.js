
import {
  createTicketSystem,
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
 * Pode ser utilizado pelo dispatcher do pacote.
 */
export async function handleTicketButtons(interaction) {
  return ticketSystem.handleInteraction(interaction);
}
