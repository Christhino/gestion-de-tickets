import type  { ReactNode } from "react";

interface TicketColumnProps {
  title: string;
  count: number;
  accentClassName: string;
  icon: ReactNode;
  emptyLabel: ReactNode;
  children?: ReactNode;
  headerAction?: ReactNode;
}

export function TicketColumn({
  title,
  count,
  accentClassName,
  icon,
  emptyLabel,
  children,
  headerAction,
}: TicketColumnProps) {
  const hasCards = Boolean(children) && count > 0;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className={"flex h-6 w-6 items-center justify-center rounded-md " + accentClassName}>{icon}</span>
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
          {count}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 p-3 min-h-[220px]">
        {headerAction}
        {hasCards ? (
          children
        ) : (
          <div className="flex flex-1 items-center justify-center py-10 text-center text-sm text-slate-400">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
}
