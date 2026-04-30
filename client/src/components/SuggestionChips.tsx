import type { Persona } from "../lib/types";

interface Props {
  persona: Persona;
  disabled: boolean;
  onPick: (text: string) => void;
}

export function SuggestionChips({ persona, disabled, onPick }: Props) {
  return (
    <div className={`persona-${persona.accent} flex flex-wrap gap-2`}>
      {persona.suggestions.map((s) => (
        <button
          key={s}
          disabled={disabled}
          onClick={() => onPick(s)}
          className="rounded-full border border-ink-700/60 bg-ink-900/40 px-3 py-1.5 text-xs text-ink-200 transition hover:border-transparent hover:accent-bg hover:accent-text disabled:cursor-not-allowed disabled:opacity-50"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
