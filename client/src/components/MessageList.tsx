import { useEffect, useRef } from "react";
import type { ChatMessage, Persona } from "../lib/types";
import { MessageBubble } from "./MessageBubble";
import { TypingDots } from "./TypingDots";
import { cn, initialsOf } from "../lib/utils";

interface Props {
  persona: Persona;
  messages: ChatMessage[];
  isTyping: boolean;
}

export function MessageList({ persona, messages, isTyping }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isTyping]);

  return (
    <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-8">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} persona={persona} />
      ))}
      {isTyping && (
        <div className={cn(`persona-${persona.accent} flex items-end gap-3`)}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full accent-strong-bg font-display text-[11px] font-bold text-ink-950">
            {initialsOf(persona.name)}
          </div>
          <div className="rounded-2xl rounded-bl-md accent-bg px-3 py-1 shadow-soft">
            <TypingDots />
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
