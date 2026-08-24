export type TicketStatus = "pending" | "open" | "closed";

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  createdAt: string;
  openedAt: string | null;
  closedAt: string | null;
}

export interface CreateTicketDTO {
  title: string;
}

export interface UpdateTicketStatusDTO {
  status: TicketStatus;
}
