import type { Persona } from "../lib/types";
import { cn, initialsOf } from "../lib/utils";

interface Props {
  personas: Persona[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function PersonaSelector({ personas, activeId, onSelect }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {personas.map((p) => {
        const isActive = p.id === activeId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            aria-pressed={isActive}
            className={cn(
              `persona-${p.accent}`,
              "group relative w-full rounded-2xl border px-4 py-3 text-left transition-all",
              isActive
                ? "border-transparent accent-bg accent-ring"
                : "border-ink-700/60 bg-ink-900/40 hover:border-ink-600 hover:bg-ink-800/60"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold",
                  isActive ? "accent-strong-bg text-ink-950" : "bg-ink-800 text-ink-200"
                )}
              >
                {initialsOf(p.name)}
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-sm font-semibold text-ink-50">
                  {p.name}
                </div>
                <div className="truncate text-xs text-ink-300">{p.title}</div>
              </div>
            </div>
            {isActive && (
              <span className="absolute -top-1.5 right-3 rounded-full accent-strong-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-950">
                Talking
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
