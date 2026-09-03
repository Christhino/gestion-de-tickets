// src/test/mocks/ticketService.mock.ts
import { vi } from "vitest";
import { ticketService } from "../../services/ticketService";

export const mockTicketService = vi.mocked(ticketService);