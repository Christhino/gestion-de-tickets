import request from "supertest";
import { createApp } from "../app";
import { ticketStore } from "../store/ticketStore";
import type { Ticket } from "../types/ticket";

const seed: Ticket[] = [
  {
    id: "T-100",
    title: "Seed pending ticket",
    status: "pending",
    createdAt: new Date().toISOString(),
    openedAt: null,
    closedAt: null,
  },
  {
    id: "T-101",
    title: "Seed open ticket",
    status: "open",
    createdAt: new Date().toISOString(),
    openedAt: new Date().toISOString(),
    closedAt: null,
  },
];

describe("Ticket API", () => {
  const app = createApp();

  beforeEach(() => {
    ticketStore._resetForTests([...seed]);
  });

  it("GET /api/tickets returns the seeded tickets", async () => {
    const res = await request(app).get("/api/tickets");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("POST /api/tickets creates a pending ticket with a valid title", async () => {
    const res = await request(app).post("/api/tickets").send({ title: "New bug" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
    expect(res.body.title).toBe("New bug");
    expect(res.body.openedAt).toBeNull();
    expect(res.body.closedAt).toBeNull();
  });

  it("POST /api/tickets rejects an empty title", async () => {
    const res = await request(app).post("/api/tickets").send({ title: "   " });
    expect(res.status).toBe(400);
  });

  it("PATCH /api/tickets/:id/status opens a pending ticket and sets openedAt", async () => {
    const res = await request(app).patch("/api/tickets/T-100/status").send({ status: "open" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("open");
    expect(res.body.openedAt).not.toBeNull();
  });

  it("PATCH /api/tickets/:id/status closes an open ticket", async () => {
    const res = await request(app).patch("/api/tickets/T-101/status").send({ status: "closed" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("closed");
    expect(res.body.closedAt).not.toBeNull();
  });

  it("PATCH /api/tickets/:id/status reopens a closed ticket", async () => {
    await request(app).patch("/api/tickets/T-101/status").send({ status: "closed" });
    const res = await request(app).patch("/api/tickets/T-101/status").send({ status: "open" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("open");
    expect(res.body.closedAt).toBeNull();
  });

  it("PATCH /api/tickets/:id/status returns 404 for an unknown ticket", async () => {
    const res = await request(app).patch("/api/tickets/T-999/status").send({ status: "closed" });
    expect(res.status).toBe(404);
  });
});