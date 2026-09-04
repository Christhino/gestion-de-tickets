import type { Ticket } from "../types/ticket";

const STATUS_STYLES: Record<Ticket["status"], { pill: string; dot: string; label: string }> = {
  pending: { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500", label: "En attente" },
  open: { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500", label: "Ouvert" },
  closed: { pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200", dot: "bg-slate-400", label: "Fermé" },
};

export function StatusPill({ status }: { status: Ticket["status"] }) {
  const { pill, dot, label } = STATUS_STYLES[status];
  return (
    <span
      className={"inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase " + pill}
    >
      <span className={"h-1.5 w-1.5 rounded-full " + dot} />
      {label}
    </span>
  );
}