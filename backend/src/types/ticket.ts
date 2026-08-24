/**
 * Types partagés pour le domaine "Ticket".
*/

export type TicketStatus = "pending" | "open" | "closed";

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  createdAt: string; // ISO 8601
  openedAt: string | null;
  closedAt: string | null;
}

/** Payload attendu pour POST /api/tickets */
export interface CreateTicketDTO {
  title: string;
}

/** Payload attendu pour PATCH /api/tickets/:id/status */
export interface UpdateTicketStatusDTO {
  status: TicketStatus;
}
