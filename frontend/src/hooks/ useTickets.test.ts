import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, waitFor } from "@testing-library/react";
import { renderHook } from "../test/test-utils";
import { useTickets } from "./useTickets";
import { ticketService } from "../services/ticketService";
import { ticketList, pendingTicket } from "../test/mocks/fixtures";
import type { Ticket } from "../types/ticket";

vi.mock("../services/ticketService");

const mockTicketService = vi.mocked(ticketService);

describe("useTickets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTicketService.list.mockResolvedValue(ticketList);
  });

  it("loads tickets on mount", async () => {
    const { result } = renderHook(() => useTickets());
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tickets).toEqual(ticketList);
  });

  it("sets loadError when the fetch fails", async () => {
    mockTicketService.list.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useTickets());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.loadError).toBe("Network error");
  });

  describe("createTicket", () => {
    it("optimistically adds the ticket then replaces it with the server response", async () => {
      const created = {
        id: "T-200",
        title: "New ticket",
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        openedAt: null,
        closedAt: null,
      };
      mockTicketService.create.mockResolvedValue(created);

      const { result } = renderHook(() => useTickets());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let success = false;
      await act(async () => {
        success = await result.current.createTicket("New ticket");
      });

      expect(success).toBe(true);
      await waitFor(() => {
        expect(result.current.tickets).toContainEqual(created);
      });
      expect(result.current.tickets.some((t) => t.id.startsWith("temp-"))).toBe(false);
      expect(result.current.tickets).toHaveLength(ticketList.length + 1);
    });

    it("rolls back the optimistic ticket when the request fails", async () => {
      mockTicketService.create.mockRejectedValue(new Error("Create failed"));

      const { result } = renderHook(() => useTickets());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let success = true;
      await act(async () => {
        success = await result.current.createTicket("Will fail");
      });

      expect(success).toBe(false);
      await waitFor(() => {
        expect(result.current.createError).toBe("Create failed");
      });
      expect(result.current.tickets).toEqual(ticketList);
    });
  });

  describe("updateStatus", () => {
    it("optimistically updates the ticket status then applies the server response", async () => {
      const updated = { ...pendingTicket, status: "open" as const, openedAt: new Date().toISOString() };
      mockTicketService.updateStatus.mockResolvedValue(updated);

      const { result } = renderHook(() => useTickets());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let response = null;
      await act(async () => {
        response = await result.current.updateStatus(pendingTicket.id, "open");
      });

      expect(response).toEqual(updated);
      await waitFor(() => {
        expect(result.current.tickets.find((t) => t.id === pendingTicket.id)).toEqual(updated);
      });
    });

    it("rolls back the status change when the request fails", async () => {
      mockTicketService.updateStatus.mockRejectedValue(new Error("Update failed"));

      const { result } = renderHook(() => useTickets());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let response: Ticket | null = pendingTicket;
      await act(async () => {
        response = await result.current.updateStatus(pendingTicket.id, "open");
      });

      expect(response).toBeNull();
      await waitFor(() => {
        expect(result.current.updateError).toBe("Update failed");
      });
      expect(result.current.tickets.find((t) => t.id === pendingTicket.id)).toEqual(pendingTicket);
    });
  });
});