import { useEffect, useMemo, useState } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { Composer } from "./components/Composer";
import { EmptyState } from "./components/EmptyState";
import { MessageList } from "./components/MessageList";
import { PersonaSelector } from "./components/PersonaSelector";
import { SuggestionChips } from "./components/SuggestionChips";
import { usePersonaChat } from "./hooks/usePersonaChat";
import { fetchPersonas } from "./lib/api";
import type { Persona } from "./lib/types";

export default function App() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPersonas()
      .then((list) => {
        if (cancelled) return;
        setPersonas(list);
        setActiveId(list[0]?.id ?? null);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err?.message || "Failed to load personas.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activePersona = useMemo(
    () => personas.find((p) => p.id === activeId) ?? null,
    [personas, activeId]
  );

  const chat = usePersonaChat(activeId);

  function handleSwitch(id: string) {
    if (id === activeId) return;
    chat.reset();
    setActiveId(id);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <TopBar />

      {loadError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {loadError}
        </div>
      )}

      <PersonaSelector
        personas={personas}
        activeId={activeId}
        onSelect={handleSwitch}
      />

      {activePersona && (
        <main className="flex min-h-[60vh] flex-1 flex-col overflow-hidden rounded-3xl border border-ink-800/60 bg-ink-900/40 shadow-soft">
          <ChatHeader persona={activePersona} onReset={chat.reset} />

          {chat.messages.length === 0 ? (
            <EmptyState persona={activePersona} onPick={chat.send} />
          ) : (
            <MessageList
              persona={activePersona}
              messages={chat.messages}
              isTyping={chat.isSending}
            />
          )}

          {chat.error && (
            <div className="mx-4 mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200 sm:mx-6">
              {chat.error}
            </div>
          )}

          {chat.messages.length > 0 && (
            <div className="border-t border-ink-800/60 bg-ink-900/40 px-4 py-3 sm:px-6">
              <SuggestionChips
                persona={activePersona}
                disabled={chat.isSending}
                onPick={chat.send}
              />
            </div>
          )}

          <Composer
            disabled={chat.isSending || !activeId}
            onSend={chat.send}
            placeholder={`Ask ${activePersona.name.split(" ")[0]} something…`}
          />
        </main>
      )}

      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ink-200 to-ink-500 font-display text-sm font-bold text-ink-950">
          SV
        </div>
        <div>
          <div className="font-display text-base font-semibold text-ink-50">ScalerVoices</div>
          <div className="text-[11px] uppercase tracking-wider text-ink-400">
            Talk to the people who built Scaler
          </div>
        </div>
      </div>
      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer noopener"
        className="hidden rounded-lg border border-ink-700/60 px-3 py-1.5 text-xs text-ink-300 transition hover:border-ink-500 hover:text-ink-100 sm:inline-block"
      >
        Source
      </a>
    </header>
  );
}

function Footer() {
  return (
    <footer className="pb-2 pt-1 text-center text-[11px] text-ink-400">
      Built for the Scaler Prompt Engineering assignment. Personas are AI representations
      based on publicly available material.
    </footer>
  );
}
