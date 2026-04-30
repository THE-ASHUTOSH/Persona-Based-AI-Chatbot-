import type { ChatMessage, Persona } from "./types";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export async function fetchPersonas(): Promise<Persona[]> {
  const res = await fetch(`${API_BASE}/personas`);
  if (!res.ok) throw new Error(`Failed to load personas (${res.status})`);
  const data = await res.json();
  return data.personas as Persona[];
}

export async function sendChat(opts: {
  personaId: string;
  message: string;
  history: ChatMessage[];
  signal?: AbortSignal;
}): Promise<string> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personaId: opts.personaId,
      message: opts.message,
      history: opts.history.map(({ role, content }) => ({ role, content }))
    }),
    signal: opts.signal
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  const data = await res.json();
  return data.reply as string;
}
