import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/test-utils";
import { TicketCard } from "./TicketCard";
import { pendingTicket } from "../../test/mocks/fixtures";

describe("TicketCard", () => {
  it("displays the ticket id, title and status", () => {
    render(<TicketCard ticket={pendingTicket} onOpen={vi.fn()} />);

    expect(screen.getByText(pendingTicket.id)).toBeInTheDocument();
    expect(screen.getByText(pendingTicket.title)).toBeInTheDocument();
    expect(screen.getByText(pendingTicket.status)).toBeInTheDocument();
  });

  it("calls onOpen with the ticket when clicked", async () => {
    const onOpen = vi.fn();
    render(<TicketCard ticket={pendingTicket} onOpen={onOpen} />);

    await userEvent.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledWith(pendingTicket);
  });
});