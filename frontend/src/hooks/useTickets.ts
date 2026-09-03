import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService } from "../services/ticketService";
import type { Ticket, TicketStatus } from "../types/ticket";
import { ticketKeys } from "./queryKeys";

export function useTickets() {
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading: loading,
    error: loadErrorRaw,
    refetch,
  } = useQuery({
    queryKey: ticketKeys.all,
    // queryFn: ticketService.list,
    queryFn: () => ticketService.list(),
  });

  const loadError = loadErrorRaw instanceof Error ? loadErrorRaw.message : null;

  const createMutation = useMutation({
    mutationFn: (title: string) => ticketService.create({ title }),
    onSuccess: (newTicket) => {
      queryClient.setQueryData<Ticket[]>(ticketKeys.all, (prev = []) => [newTicket, ...prev]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      ticketService.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData<Ticket[]>(ticketKeys.all, (prev = []) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    },
  });

  const createTicket = async (title: string): Promise<boolean> => {
    try {
      await createMutation.mutateAsync(title);
      return true;
    } catch {
      return false;
    }
  };

  const updateStatus = async (id: string, status: TicketStatus): Promise<Ticket | null> => {
    try {
      return await updateMutation.mutateAsync({ id, status });
    } catch {
      return null;
    }
  };

  return {
    tickets,
    loading,
    loadError,
    reload: refetch,

    creating: createMutation.isPending,
    createError: createMutation.error instanceof Error ? createMutation.error.message : null,
    createTicket,
    clearCreateError: () => createMutation.reset(),

    // updatingId: updateMutation.variables?.id ?? null,
    updatingId: updateMutation.isPending ? (updateMutation.variables?.id ?? null) : null,
    updateError: updateMutation.error instanceof Error ? updateMutation.error.message : null,
    updateStatus,
    clearUpdateError: () => updateMutation.reset(),
  };
}