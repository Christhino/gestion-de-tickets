import type { ReactNode } from "react";

interface TicketColumnProps {
  title: string;
  count: number;
  accentClassName: string;
  icon: ReactNode;
  emptyLabel: ReactNode;
  children?: ReactNode;
  headerAction?: ReactNode;
  testId?: string;
}

export function TicketColumn({
  title,
  count,
  accentClassName,
  icon,
  emptyLabel,
  children,
  headerAction,
  testId,
}: TicketColumnProps) {
  const hasCards = Boolean(children) && count > 0;
  const columnTestId = testId ?? `column-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div data-testid={columnTestId} className="flex flex-col flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
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
          <div className="flex items-center justify-center flex-1 py-10 text-sm text-center text-slate-400">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
}