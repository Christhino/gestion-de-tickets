import type { Ticket } from "../../types/ticket";

export const pendingTicket: Ticket = {
  id: "T-100",
  title: "Fix login bug",
  status: "pending",
  createdAt: "2026-01-01T10:00:00.000Z",
  openedAt: null,
  closedAt: null,
};

export const openTicket: Ticket = {
  id: "T-101",
  title: "Update dependencies",
  status: "open",
  createdAt: "2026-01-01T09:00:00.000Z",
  openedAt: "2026-01-01T09:30:00.000Z",
  closedAt: null,
};

export const closedTicket: Ticket = {
  id: "T-102",
  title: "Refactor API client",
  status: "closed",
  createdAt: "2026-01-01T08:00:00.000Z",
  openedAt: "2026-01-01T08:15:00.000Z",
  closedAt: "2026-01-01T09:00:00.000Z",
};

export const ticketList: Ticket[] = [pendingTicket, openTicket, closedTicket];