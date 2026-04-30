import { useCallback, useRef, useState } from "react";
import { sendChat } from "../lib/api";
import type { ChatMessage } from "../lib/types";
import { newId } from "../lib/utils";

interface State {
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
}

const initialState: State = {
  messages: [],
  isSending: false,
  error: null
};

export function usePersonaChat(personaId: string | null) {
  const [state, setState] = useState<State>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(initialState);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !personaId) return;

      const userMsg: ChatMessage = {
        id: newId(),
        role: "user",
        content: trimmed,
        createdAt: Date.now()
      };

      const historyForApi = [...state.messages, userMsg];

      setState((s) => ({
        ...s,
        messages: [...s.messages, userMsg],
        isSending: true,
        error: null
      }));

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await sendChat({
          personaId,
          message: trimmed,
          history: state.messages,
          signal: controller.signal
        });
        const assistantMsg: ChatMessage = {
          id: newId(),
          role: "assistant",
          content: reply,
          createdAt: Date.now()
        };
        setState((s) => ({
          ...s,
          messages: [...historyForApi, assistantMsg],
          isSending: false
        }));
      } catch (err) {
        if (controller.signal.aborted) {
          setState((s) => ({ ...s, isSending: false }));
          return;
        }
        const message =
          err instanceof Error ? err.message : "Something went wrong. Try again.";
        setState((s) => ({ ...s, isSending: false, error: message }));
      }
    },
    [personaId, state.messages]
  );

  return {
    messages: state.messages,
    isSending: state.isSending,
    error: state.error,
    send,
    reset
  };
}
