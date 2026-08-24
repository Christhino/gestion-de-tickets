// src/components/TicketBoard/BoardSkeleton.tsx

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-3.5">
      <div className="flex items-center justify-between">
        <div className="h-3 w-14 rounded bg-slate-200" />
        <div className="h-4 w-16 rounded-full bg-slate-200" />
      </div>
      <div className="mt-3 h-3.5 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
    </div>
  );
}

function ColumnSkeleton({ cardCount }: { cardCount: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-6 w-6 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-3.5 w-20 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: cardCount }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <ColumnSkeleton cardCount={3} />
      <ColumnSkeleton cardCount={2} />
      <ColumnSkeleton cardCount={2} />
      <ColumnSkeleton cardCount={1} />
    </div>
  );
}