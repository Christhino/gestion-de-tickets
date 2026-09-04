import { Clock } from "lucide-react";
import type { Ticket } from "../../types/ticket";
import { StatusPill } from "../StatusPill";
import { formatDateTime } from "../../utils/formatDateTime";

interface TicketCardProps {
  ticket: Ticket;
  onOpen: (ticket: Ticket) => void;
}

export function TicketCard({ ticket, onOpen }: TicketCardProps) {
  return (
    <button
      onClick={() => onOpen(ticket)}
      className="group w-full text-left rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[11px] text-slate-400">{ticket.id}</span>
        <StatusPill status={ticket.status} />
      </div>
      <p className="mt-1.5 text-sm font-medium text-slate-800 leading-snug">{ticket.title}</p>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Clock className="h-3 w-3" />
        <span>Créé le {formatDateTime(ticket.createdAt)}</span>
      </div>
    </button>
  );
}