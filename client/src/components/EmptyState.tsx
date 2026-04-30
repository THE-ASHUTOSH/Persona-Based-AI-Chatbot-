import type { Persona } from "../lib/types";
import { initialsOf } from "../lib/utils";

interface Props {
  persona: Persona;
  onPick: (text: string) => void;
}

export function EmptyState({ persona, onPick }: Props) {
  return (
    <div className={`persona-${persona.accent} flex flex-1 items-center justify-center px-6 py-10`}>
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl accent-strong-bg font-display text-2xl font-bold text-ink-950">
          {initialsOf(persona.name)}
        </div>
        <h2 className="font-display text-xl font-semibold text-ink-50">
          You're chatting with {persona.name}
        </h2>
        <p className="mt-1 text-sm text-ink-300">{persona.blurb}</p>
        <div className="mt-6 grid gap-2 text-left">
          {persona.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onPick(s)}
              className="rounded-xl border border-ink-700/60 bg-ink-900/40 px-4 py-3 text-sm text-ink-100 transition hover:border-transparent hover:accent-bg hover:accent-text"
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-6 text-[11px] text-ink-400">
          AI persona based on publicly available material. Not the real {persona.name.split(" ")[0]}.
        </p>
      </div>
    </div>
  );
}
