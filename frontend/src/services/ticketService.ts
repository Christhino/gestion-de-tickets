import type { CreateTicketDTO, Ticket, TicketStatus } from "../types/ticket";

const BASE_URL = "/api";

async function parseJsonOrThrow(res: Response) {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = body?.error ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return body;
}

export const ticketService = {
  async list(): Promise<Ticket[]> {
    const res = await fetch(`${BASE_URL}/tickets`);
    return parseJsonOrThrow(res);
  },

  async create(payload: CreateTicketDTO): Promise<Ticket> {
    const res = await fetch(`${BASE_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJsonOrThrow(res);
  },

  async updateStatus(id: string, status: TicketStatus): Promise<Ticket> {
    const res = await fetch(`${BASE_URL}/tickets/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return parseJsonOrThrow(res);
  },
};
