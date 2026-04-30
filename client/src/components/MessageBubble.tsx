import type { ChatMessage, Persona } from "../lib/types";
import { cn, formatTime, initialsOf } from "../lib/utils";

interface Props {
  message: ChatMessage;
  persona: Persona;
}

export function MessageBubble({ message, persona }: Props) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        `persona-${persona.accent} flex animate-fade-in items-end gap-3`,
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-bold",
          isUser ? "bg-ink-700 text-ink-100" : "accent-strong-bg text-ink-950"
        )}
        aria-hidden
      >
        {isUser ? "You" : initialsOf(persona.name)}
      </div>
      <div className={cn("max-w-[85%] sm:max-w-[75%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-soft",
            isUser
              ? "rounded-br-md bg-ink-700/80 text-ink-50"
              : "rounded-bl-md accent-bg text-ink-50"
          )}
        >
          {message.content}
        </div>
        <div
          className={cn(
            "mt-1 px-1 text-[11px] text-ink-400",
            isUser ? "text-right" : "text-left"
          )}
        >
          {isUser ? "You" : persona.name} · {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}
