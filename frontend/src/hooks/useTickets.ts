import { useCallback, useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import type { Ticket, TicketStatus } from "../types/ticket";

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const MIN_LOADING_TIME = 1200;
  const loadTickets = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [data] = await Promise.all([
        ticketService.list(),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME)),
      ]);
      setTickets(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unable to load tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadTickets();
    });
  }, [loadTickets]);

  const createTicket = useCallback(async (title: string) => {
    setCreating(true);
    setCreateError(null);
    try {
      const ticket = await ticketService.create({ title });
      setTickets((prev) => [ticket, ...prev]);
      return true;
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Unable to create the ticket. Please try again.");
      return false;
    } finally {
      setCreating(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: TicketStatus) => {
    setUpdatingId(id);
    setUpdateError(null);
    try {
      const updated = await ticketService.updateStatus(id, status);
      // Le ticket précédent est conservé tel quel en cas d'erreur (voir catch) :
      // on ne remplace la liste qu'après un succès confirmé par le backend.
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Unable to update the ticket. Please try again.");
      return null;
    } finally {
      setUpdatingId(null);
    }
  }, []);

  return {
    tickets,
    loading,
    loadError,
    reload: loadTickets,
    creating,
    createError,
    createTicket,
    clearCreateError: () => setCreateError(null),
    updatingId,
    updateError,
    updateStatus,
    clearUpdateError: () => setUpdateError(null),
  };
}
