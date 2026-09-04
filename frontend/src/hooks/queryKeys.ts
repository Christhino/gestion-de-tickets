export const ticketKeys = {
  all: ["tickets"] as const,
  detail: (id: string) => [...ticketKeys.all, id] as const,
};