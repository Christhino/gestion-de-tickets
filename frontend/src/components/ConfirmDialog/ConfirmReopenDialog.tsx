import type { Ticket } from "../../types/ticket";

interface ConfirmReopenDialogProps {
  ticket: Ticket | null;
  onCancel: () => void;
  onConfirm: () => void;
  confirming: boolean;
}

export function ConfirmReopenDialog({ ticket, onCancel, onConfirm, confirming }: ConfirmReopenDialogProps) {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">Réouvrir le ticket ?</h3>
        <p className="mt-2 text-sm text-slate-500">
          <span className="font-mono text-xs text-slate-400">{ticket.id}</span> est actuellement fermé. Voulez-vous le
          réouvrir ?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 min-w-[90px]"
          >
            {confirming ? "…" : "Réouvrir"}
          </button>
        </div>
      </div>
    </div>
  );
}
