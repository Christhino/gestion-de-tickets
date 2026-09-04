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
    queryFn: () => ticketService.list(),
  });

  const loadError = loadErrorRaw instanceof Error ? loadErrorRaw.message : null;

  const createMutation = useMutation({
    mutationFn: (title: string) => ticketService.create({ title }),

    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: ticketKeys.all });
      const previousTickets = queryClient.getQueryData<Ticket[]>(ticketKeys.all);

      const optimisticTicket: Ticket = {
        id: `temp-${crypto.randomUUID()}`,
        title,
        status: "pending",
        createdAt: new Date().toISOString(),
        openedAt: null,
        closedAt: null,
      };

      queryClient.setQueryData<Ticket[]>(ticketKeys.all, (prev = []) => [
        optimisticTicket,
        ...prev,
      ]);

      return { previousTickets, optimisticId: optimisticTicket.id };
    },

    onSuccess: (newTicket, _title, context) => {
      queryClient.setQueryData<Ticket[]>(ticketKeys.all, (prev = []) =>
        prev.map((t) => (t.id === context?.optimisticId ? newTicket : t))
      );
    },

    onError: (_err, _title, context) => {
      if (context?.previousTickets) {
        queryClient.setQueryData(ticketKeys.all, context.previousTickets);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      ticketService.updateStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ticketKeys.all });
      const previousTickets = queryClient.getQueryData<Ticket[]>(ticketKeys.all);

      queryClient.setQueryData<Ticket[]>(ticketKeys.all, (prev = []) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                openedAt: status === "open" ? new Date().toISOString() : t.openedAt,
                closedAt: status === "closed" ? new Date().toISOString() : t.closedAt,
              }
            : t
        )
      );

      return { previousTickets };
    },

    onSuccess: (updated) => {
      queryClient.setQueryData<Ticket[]>(ticketKeys.all, (prev = []) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTickets) {
        queryClient.setQueryData(ticketKeys.all, context.previousTickets);
      }
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

    updatingId: updateMutation.isPending ? (updateMutation.variables?.id ?? null) : null,
    updateError: updateMutation.error instanceof Error ? updateMutation.error.message : null,
    updateStatus,
    clearUpdateError: () => updateMutation.reset(),
  };
}