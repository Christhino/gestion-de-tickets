import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AlertTriangle, X } from "lucide-react";

interface CreateTicketModalProps {
  onClose: () => void;
  onCreate: (title: string) => Promise<boolean>;
  creating: boolean;
  error: string | null;
  onClearError: () => void;
}

export function CreateTicketModal({ onClose, onCreate, creating, error, onClearError }: CreateTicketModalProps) {
  const [title, setTitle] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setLocalError("Le titre est requis.");
      return;
    }
    setLocalError(null);

    const success = await onCreate(trimmed);
    if (success) {
      setTitle("");
      onClose();
    }
  };

  const displayedError = localError ?? error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Créer un ticket</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={submit} className="px-5 py-4">
          <label className="block text-xs font-medium text-slate-500 mb-1.5" htmlFor="ticket-title">
            Titre
          </label>
          <input
            id="ticket-title"
            ref={inputRef}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (localError) setLocalError(null);
              if (error) onClearError();
            }}
            placeholder="ex. Corriger l'authentification"
            className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={creating}
          />
          {displayedError && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
              <AlertTriangle className="h-3.5 w-3.5" /> {displayedError}
            </p>
          )}
          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={creating}
              data-testid="submit-create-ticket"
              className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed min-w-[110px] text-center"
            >
              {creating ? "Création…" : "Créer un ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}