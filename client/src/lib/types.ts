export type AccentName = "amber" | "violet" | "emerald";

export interface Persona {
  id: string;
  name: string;
  title: string;
  blurb: string;
  accent: AccentName;
  suggestions: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}
