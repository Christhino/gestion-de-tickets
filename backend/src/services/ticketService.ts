/**
 * Couche métier
*/
import { ticketStore } from "../store/ticketStore";
import { Ticket, TicketStatus } from "../types/ticket";

export class ValidationError extends Error {}
export class NotFoundError extends Error {}

export const ticketService = {
  listTickets(): Ticket[] {
    // Tri par date de création décroissante les tickets les plus récents en premier
    return ticketStore
      .findAll()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createTicket(rawTitle: unknown): Ticket {
    if (typeof rawTitle !== "string" || rawTitle.trim().length === 0) {
      throw new ValidationError("Title is required and must be a non-empty string.");
    }

    const title = rawTitle.trim();
    const nowIso = new Date().toISOString();

    // Un ticket créé n'est pas encore pris en charge il démarre en "pending"
    const ticket: Ticket = {
      id: ticketStore.generateId(),
      title,
      status: "pending",
      createdAt: nowIso,
      openedAt: null,
      closedAt: null,
    };

    return ticketStore.insert(ticket);
  },

  updateStatus(id: string, rawStatus: unknown): Ticket {
    if (rawStatus !== "open" && rawStatus !== "closed") {
      // "pending" état initial attribué à la création
      throw new ValidationError('Status must be either "open" or "closed".');
    }
    const status = rawStatus as TicketStatus;

    const existing = ticketStore.findById(id);
    if (!existing) {
      throw new NotFoundError(`Ticket ${id} not found.`);
    }

    if (status === existing.status) {
      return existing;
    }

    const nowIso = new Date().toISOString();
    const patch: Partial<Ticket> =
      status === "closed"
        ? { status: "closed", closedAt: nowIso }
        : 
          { status: "open", openedAt: nowIso, closedAt: null };

    return ticketStore.update(id, patch) as Ticket;
  },
};
