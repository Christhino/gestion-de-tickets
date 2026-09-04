import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, PlayCircle, RotateCcw, X } from "lucide-react";
import type  { Ticket } from "../../types/ticket";
import { StatusPill } from "../StatusPill";
import { formatDateTime } from "../../utils/formatDateTime";

function formatElapsed(startIso: string | null): string {
  if (!startIso) return "00:00:00";
  const diff = Math.max(0, Date.now() - new Date(startIso).getTime());
  const h = String(Math.floor(diff / 3_600_000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function LiveTimer({ openedAt }: { openedAt: string | null }) {
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums">{formatElapsed(openedAt)}</span>;
}

interface TicketDetailsProps {
  ticket: Ticket | null;
  onClose: () => void;
  onOpenTicket: (ticket: Ticket) => void;
  onCloseTicket: (ticket: Ticket) => void;
  onReopenRequest: (ticket: Ticket) => void;
  updating: boolean;
  updateError: string | null;
}

export function TicketDetails({
  ticket,
  onClose,
  onOpenTicket,
  onCloseTicket,
  onReopenRequest,
  updating,
  updateError,
}: TicketDetailsProps) {
  if (!ticket) return null;
  const isPending = ticket.status === "pending";
  const isOpen = ticket.status === "open";
  const isClosed = ticket.status === "closed";

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 backdrop-blur-[1px]" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-sm bg-white shadow-2xl ring-1 ring-slate-200 flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="font-mono text-xs text-slate-400">{ticket.id}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <h3 className="text-lg font-semibold text-slate-900 leading-snug">{ticket.title}</h3>
          <div className="mt-3">
            <StatusPill status={ticket.status} />
          </div>

          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Créé</dt>
              <dd className="mt-0.5 text-slate-700">{formatDateTime(ticket.createdAt)}</dd>
            </div>
            {isOpen && (
              <>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Ouvert</dt>
                  <dd className="mt-0.5 text-slate-700">{formatDateTime(ticket.openedAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Temps d'ouverture</dt>
                  <dd className="mt-0.5 text-slate-700 text-base">
                    <LiveTimer openedAt={ticket.openedAt} />
                  </dd>
                </div>
              </>
            )}
            {isClosed && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Fermé</dt>
                <dd className="mt-0.5 text-slate-700">{formatDateTime(ticket.closedAt)}</dd>
              </div>
            )}
            {isPending && (
              <p className="text-sm text-slate-400">Ce ticket n'a pas encore été démarré.</p>
            )}
          </dl>

          {updateError && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-red-600">
              <AlertTriangle className="h-3.5 w-3.5" /> {updateError}
            </p>
          )}
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          {isPending && (
            <button
              onClick={() => onOpenTicket(ticket)}
              disabled={updating}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              {updating ? "Ouverture…" : "Ouvrir le ticket"}
            </button>
          )}
          {isOpen && (
            <button
              onClick={() => onCloseTicket(ticket)}
              disabled={updating}
              className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {updating ? "Fermeture…" : "Fermer le ticket"}
            </button>
          )}
          {isClosed && (
            <button
              onClick={() => onReopenRequest(ticket)}
              disabled={updating}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Réouvrir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
