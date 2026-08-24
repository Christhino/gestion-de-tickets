/**
 * Store en mémoire pour les tickets.
*/
import type { Ticket } from "../types/ticket";

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60_000).toISOString();
}

// Fake data
let tickets: Ticket[] = [
  {
    id: "T-101",
    title: "Fix authentication flow",
    status: "open",
    createdAt: minutesAgo(180),
    openedAt: minutesAgo(170),
    closedAt: null,
  },
  {
    id: "T-102",
    title: "Update dashboard layout",
    status: "open",
    createdAt: minutesAgo(120),
    openedAt: minutesAgo(110),
    closedAt: null,
  },
  {
    id: "T-103",
    title: "Implement global search",
    status: "open",
    createdAt: minutesAgo(60),
    openedAt: minutesAgo(55),
    closedAt: null,
  },
  {
    id: "T-104",
    title: "Fix API documentation",
    status: "closed",
    createdAt: minutesAgo(600),
    openedAt: minutesAgo(590),
    closedAt: minutesAgo(400),
  },
  {
    id: "T-105",
    title: "Resolve production issue",
    status: "closed",
    createdAt: minutesAgo(300),
    openedAt: minutesAgo(295),
    closedAt: minutesAgo(200),
  },
  {
    id: "T-106",
    title: "Investigate slow checkout page",
    status: "pending",
    createdAt: minutesAgo(30),
    openedAt: null,
    closedAt: null,
  },
  {
    id: "T-107",
    title: "Add CSV export to reports",
    status: "pending",
    createdAt: minutesAgo(10),
    openedAt: null,
    closedAt: null,
  },
];

let nextNumericId = 108;

export const ticketStore = {
  findAll(): Ticket[] {
    return [...tickets];
  },

  findById(id: string): Ticket | undefined {
    return tickets.find((t) => t.id === id);
  },

  insert(ticket: Ticket): Ticket {
    tickets = [ticket, ...tickets];
    return ticket;
  },

  update(id: string, patch: Partial<Ticket>): Ticket | undefined {
    let updated: Ticket | undefined;
    tickets = tickets.map((t) => {
      if (t.id !== id) return t;
      updated = { ...t, ...patch };
      return updated;
    });
    return updated;
  },

  generateId(): string {
    const id = `T-${nextNumericId}`;
    nextNumericId += 1;
    return id;
  },

  _resetForTests(seed: Ticket[]): void {
    tickets = seed;
  },
};
