import { useEffect, useRef, useState, type KeyboardEvent } from "react";

interface Props {
  disabled: boolean;
  onSend: (text: string) => void;
  placeholder: string;
}

export function Composer({ disabled, onSend, placeholder }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-ink-800/60 bg-ink-900/60 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-end gap-2 rounded-2xl border border-ink-700/60 bg-ink-950/60 p-2 focus-within:border-ink-500">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="max-h-[180px] flex-1 resize-none bg-transparent px-3 py-2 text-[15px] text-ink-50 placeholder:text-ink-400 focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || value.trim().length === 0}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-ink-100 px-4 text-sm font-semibold text-ink-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-ink-400"
          aria-label="Send"
        >
          Send
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="mt-1.5 px-1 text-[11px] text-ink-400">
        Enter to send · Shift + Enter for newline
      </div>
    </div>
  );
}
