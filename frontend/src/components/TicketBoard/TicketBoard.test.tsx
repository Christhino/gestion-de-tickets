import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/test-utils";
import { TicketBoard } from "./TicketBoard";
import { ticketService } from "../../services/ticketService";
import { pendingTicket, openTicket, closedTicket, ticketList } from "../../test/mocks/fixtures";

vi.mock("../../services/ticketService");
const mockTicketService = vi.mocked(ticketService);

describe("TicketBoard (integration)", () => {
  beforeEach(() => {
    mockTicketService.list.mockResolvedValue(ticketList);
  });

  it("loads and displays tickets split across the correct columns", async () => {
    render(<TicketBoard />);

    const pendingColumn = await screen.findByTestId("column-pending");
    expect(within(pendingColumn).getByText(pendingTicket.title)).toBeInTheDocument();

    const openColumn = screen.getByTestId("column-open");
    expect(within(openColumn).getByText(openTicket.title)).toBeInTheDocument();

    const closedColumn = screen.getByTestId("column-closed");
    expect(within(closedColumn).getByText(closedTicket.title)).toBeInTheDocument();
  });

  it("filters tickets across all columns when searching", async () => {
    render(<TicketBoard />);
    const allColumn = await screen.findByTestId("column-all-tickets");
    await waitFor(() => expect(within(allColumn).getByText(pendingTicket.title)).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText(/rechercher un ticket/i), "login");

    expect(within(allColumn).getByText(pendingTicket.title)).toBeInTheDocument();
    expect(within(allColumn).queryByText(openTicket.title)).not.toBeInTheDocument();
    expect(within(allColumn).queryByText(closedTicket.title)).not.toBeInTheDocument();
  });

  it("creates a ticket end-to-end: opens modal, submits, and shows it in the board", async () => {
    mockTicketService.create.mockResolvedValue({
      id: "T-200",
      title: "New integration ticket",
      status: "pending",
      createdAt: new Date().toISOString(),
      openedAt: null,
      closedAt: null,
    });

    render(<TicketBoard />);
    const allColumn = await screen.findByTestId("column-all-tickets");
    await waitFor(() => expect(within(allColumn).getByText(pendingTicket.title)).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /créer un ticket/i }));
    await userEvent.type(screen.getByLabelText(/titre/i), "New integration ticket");
    await userEvent.click(screen.getByTestId("submit-create-ticket"));

    await waitFor(() =>
      expect(within(allColumn).getByText("New integration ticket")).toBeInTheDocument()
    );
    expect(mockTicketService.create).toHaveBeenCalledWith({ title: "New integration ticket" });
  });

  it("opens a pending ticket from the details panel and updates its status", async () => {
    mockTicketService.updateStatus.mockResolvedValue({
      ...pendingTicket,
      status: "open",
      openedAt: new Date().toISOString(),
    });

    render(<TicketBoard />);
    const pendingColumn = await screen.findByTestId("column-pending");
    const ticketInPendingColumn = await waitFor(() =>
      within(pendingColumn).getByText(pendingTicket.title)
    );

    await userEvent.click(ticketInPendingColumn);
    await userEvent.click(screen.getByRole("button", { name: /ouvrir le ticket/i }));

    await waitFor(() =>
      expect(mockTicketService.updateStatus).toHaveBeenCalledWith(pendingTicket.id, "open")
    );
  });
});