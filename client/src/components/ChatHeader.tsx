import type { Persona } from "../lib/types";
import { initialsOf } from "../lib/utils";

interface Props {
  persona: Persona;
  onReset: () => void;
}

export function ChatHeader({ persona, onReset }: Props) {
  return (
    <header
      className={`persona-${persona.accent} flex items-center justify-between gap-3 border-b border-ink-800/60 bg-ink-900/40 px-4 py-3 sm:px-6`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl accent-strong-bg font-display text-sm font-bold text-ink-950">
          {initialsOf(persona.name)}
        </div>
        <div>
          <div className="font-display text-sm font-semibold text-ink-50">{persona.name}</div>
          <div className="text-[12px] text-ink-300">{persona.title}</div>
        </div>
      </div>
      <button
        onClick={onReset}
        className="rounded-lg border border-ink-700/60 px-3 py-1.5 text-xs text-ink-200 transition hover:border-ink-500 hover:text-ink-50"
        title="Clear this conversation"
      >
        New chat
      </button>
    </header>
  );
}
