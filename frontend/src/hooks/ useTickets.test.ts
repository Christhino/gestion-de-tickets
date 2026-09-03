// src/hooks/useTickets.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useTickets } from "./useTickets";
import { ticketService } from "../services/ticketService";
import { ticketList } from "../test/mocks/fixtures";

vi.mock("../services/ticketService");

const mockTicketService = vi.mocked(ticketService);

describe("useTickets", () => {
  beforeEach(() => {
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
});