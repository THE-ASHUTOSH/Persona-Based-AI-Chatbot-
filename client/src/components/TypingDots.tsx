export function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1.5 px-1 py-2" aria-label="Typing">
      <span className="h-2 w-2 rounded-full bg-ink-300 animate-bounce-dot [animation-delay:-0.32s]" />
      <span className="h-2 w-2 rounded-full bg-ink-300 animate-bounce-dot [animation-delay:-0.16s]" />
      <span className="h-2 w-2 rounded-full bg-ink-300 animate-bounce-dot" />
    </div>
  );
}
