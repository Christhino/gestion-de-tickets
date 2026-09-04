import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Hourglass, Plus, Search, Ticket as TicketIcon } from "lucide-react";
import { useTickets } from "../../hooks/useTickets";
import type { Ticket } from "../../types/ticket";
import { TicketColumn } from "../TicketColumn/TicketColumn";
import { TicketCard } from "../TicketCard/TicketCard";
import { CreateTicketModal } from "../TicketForm/CreateTicketModal";
import { TicketDetails } from "../TicketDetails/TicketDetails";
import { ConfirmReopenDialog } from "../ConfirmDialog/ConfirmReopenDialog";
import { BoardSkeleton } from "./BoardSkeleton";

export function TicketBoard() {
  const {
    tickets,
    loading,
    loadError,
    reload,
    creating,
    createError,
    createTicket,
    clearCreateError,
    updatingId,
    updateError,
    updateStatus,
    clearUpdateError,
  } = useTickets();

  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reopenTarget, setReopenTarget] = useState<Ticket | null>(null);
  const [search, setSearch] = useState("");

  const selected = useMemo(() => tickets.find((t) => t.id === selectedId) ?? null, [tickets, selectedId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }, [tickets, search]);

  const pending = useMemo(() => filtered.filter((t) => t.status === "pending"), [filtered]);
  const open = useMemo(() => filtered.filter((t) => t.status === "open"), [filtered]);
  const closed = useMemo(() => filtered.filter((t) => t.status === "closed"), [filtered]);

  const handleCreate = async (title: string) => createTicket(title);

  const handleOpenTicket = async (ticket: Ticket) => {
    await updateStatus(ticket.id, "open");
  };

  const handleCloseTicket = async (ticket: Ticket) => {
    await updateStatus(ticket.id, "closed");
  };

  const handleReopenConfirm = async () => {
    if (!reopenTarget) return;
    const result = await updateStatus(reopenTarget.id, "open");
    if (result) setReopenTarget(null);
  };

  return (
    <div className="w-full min-h-screen font-sans bg-slate-100 text-slate-900">
      <header className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3 mx-auto max-w-7xl">
          <div className="flex items-center justify-center w-8 h-8 text-white bg-indigo-600 rounded-lg">
            <TicketIcon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900">Gestion des tickets</h1>
            <p className="text-xs text-slate-400">
              {loading ? "Chargement…" : `${tickets.length} ticket${tickets.length === 1 ? "" : "s"} au total`}
            </p>
          </div>

          <div className="relative w-56 ml-auto">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un ticket…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </header>

      <main className="px-6 py-6 mx-auto max-w-7xl">
        {loading && <BoardSkeleton />}

        {!loading && loadError && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center border border-red-100 rounded-xl bg-red-50">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <p className="text-sm font-medium text-red-700">Impossible de charger les tickets.</p>
            <button 
              onClick={() => reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {/* Tous les tickets, avec le bouton de création */}
            <TicketColumn
              title="Tous les tickets"
              testId="column-all-tickets"
              count={filtered.length}
              accentClassName="bg-indigo-100 text-indigo-600"
              icon={<TicketIcon className="h-3.5 w-3.5" />}
              emptyLabel={
                tickets.length === 0 ? (
                  <div>
                    <p>Aucun ticket pour le moment.</p>
                    <p className="mt-1 text-slate-400">Créez votre premier ticket.</p>
                  </div>
                ) : (
                  <p>Aucun ticket ne correspond à la recherche.</p>
                )
              }
              headerAction={
                <button
                  onClick={() => setShowCreate(true)}
                  className="mb-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/60 px-3 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  <Plus className="w-4 h-4" /> Créer un ticket
                </button>
              }
            >
              {filtered.map((t) => (
                <TicketCard key={t.id} ticket={t} onOpen={(ticket) => setSelectedId(ticket.id)} />
              ))}
            </TicketColumn>

            {/* Pending — tickets créés, pas encore pris en charge */}
            <TicketColumn
              title="En attente"
              testId="column-pending"
              count={pending.length}
              accentClassName="bg-amber-100 text-amber-600"
              icon={<Hourglass className="h-3.5 w-3.5" />}
              emptyLabel="Aucun ticket en attente."
            >
              {pending.map((t) => (
                <TicketCard key={t.id} ticket={t} onOpen={(ticket) => setSelectedId(ticket.id)} />
              ))}
            </TicketColumn>

            {/* Open */}
            <TicketColumn
              title="Ouverts"
              testId="column-open"
              count={open.length}
              accentClassName="bg-emerald-100 text-emerald-600"
              icon={<Clock className="h-3.5 w-3.5" />}
              emptyLabel="Aucun ticket ouvert."
            >
              {open.map((t) => (
                <TicketCard key={t.id} ticket={t} onOpen={(ticket) => setSelectedId(ticket.id)} />
              ))}
            </TicketColumn>

            {/* Closed */}
            <TicketColumn
              title="Fermés"
              testId="column-closed"
              count={closed.length}
              accentClassName="bg-slate-200 text-slate-500"
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              emptyLabel="Aucun ticket fermé."
            >
              {closed.map((t) => (
                <TicketCard key={t.id} ticket={t} onOpen={(ticket) => setSelectedId(ticket.id)} />
              ))}
            </TicketColumn>
          </div>
        )}
      </main>

      {showCreate && (
        <CreateTicketModal
          onClose={() => {
            setShowCreate(false);
            clearCreateError();
          }}
          onCreate={handleCreate}
          creating={creating}
          error={createError}
          onClearError={clearCreateError}
        />
      )}

      <TicketDetails
        ticket={selected}
        onClose={() => {
          setSelectedId(null);
          clearUpdateError();
        }}
        onOpenTicket={handleOpenTicket}
        onCloseTicket={handleCloseTicket}
        onReopenRequest={setReopenTarget}
        updating={selected !== null && updatingId === selected.id}
        updateError={selected !== null ? updateError : null}
      />

      <ConfirmReopenDialog
        ticket={reopenTarget}
        onCancel={() => setReopenTarget(null)}
        onConfirm={handleReopenConfirm}
        confirming={reopenTarget !== null && updatingId === reopenTarget.id}
      />
    </div>
  );
}
