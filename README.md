# ScalerVoices

A persona-based AI chatbot — converse with AI representations of three Scaler / InterviewBit personalities:

- **Anshuman Singh** — co-founder, ex-Facebook engineer, ICPC World Finalist
- **Abhimanyu Saxena** — co-founder, builder of Scaler & InterviewBit
- **Kshitij Mishra** — instructor at Scaler, known for clarity in DSA teaching

Each persona has its own system prompt with persona description, few-shot examples, internal chain-of-thought instructions, output format rules, and hard constraints. Switching persona resets the conversation.

> Built for the Scaler Prompt Engineering assignment.

---

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express (ES modules)
- **LLM:** Google Gemini via `@google/generative-ai`
- **Deployment:** single Render Web Service (Express serves the built client)

```
ScalerVoices/
├── client/          # Vite + React + Tailwind frontend
│   └── src/
│       ├── components/    # PersonaSelector, ChatHeader, MessageList, Composer, …
│       ├── hooks/         # usePersonaChat
│       └── lib/           # api, types, utils
├── server/          # Express API + static file server
│   └── src/
│       ├── personas/      # one file per persona system prompt
│       ├── routes/        # /api/personas, /api/chat
│       └── services/      # Gemini client wrapper
├── docs/            # prompts.md, reflection.md
└── render.yaml      # one-click Render deploy
```

---

## Local development

### Prerequisites
- Node 18+
- A Google AI Studio API key (free tier works): https://aistudio.google.com/app/apikey

### Setup

```bash
# 1. Install everything
npm run install:all

# 2. Configure env
cp server/.env.example server/.env
# then edit server/.env and paste your GEMINI_API_KEY

# 3. Run backend (port 5174) and frontend (port 5173) in two terminals
npm run dev:server
npm run dev:client
```

Open http://localhost:5173. The Vite dev server proxies `/api/*` to the Express server.

### Production build (single-server mode)

```bash
npm run build      # builds client/dist
npm start          # serves API + built client on $PORT (default 5174)
```

---

## Deploy to Render

This repo includes `render.yaml`. From a fresh Render account:

1. Push this folder to a public GitHub repo.
2. In Render → **New → Blueprint**, point at the repo.
3. Render will detect `render.yaml` and create a single Web Service.
4. Add the env var `GEMINI_API_KEY` (marked `sync: false`, so Render will prompt you).
5. Deploy. The service builds the client, then runs the Express server which serves both the API and the built frontend on the same origin.

The first request after a free-tier idle may take ~30s to wake the dyno.

### Manual Render setup (without blueprint)

- **Type:** Web Service
- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Env vars:** `GEMINI_API_KEY=<your-key>`, optionally `GEMINI_MODEL=gemini-2.0-flash`
- **Health check path:** `/api/health`

---

## API

| Method | Path             | Body                                                            | Returns                          |
|--------|------------------|-----------------------------------------------------------------|----------------------------------|
| GET    | `/api/health`    | —                                                               | `{ ok, model }`                  |
| GET    | `/api/personas`  | —                                                               | `{ personas: [...] }`            |
| POST   | `/api/chat`      | `{ personaId, message, history: [{role, content}, …] }`         | `{ reply, personaId }`           |

The API key never leaves the server. The frontend only sees public persona metadata (id, name, title, blurb, accent, suggestions) — never system prompts.

---

## What's required vs. what's done

Per the assignment:

- [x] Three personas with distinct system prompts
- [x] System prompts contain: persona description, ≥3 few-shot examples, CoT instruction, output format, constraints
- [x] Persona switcher (resets conversation on switch)
- [x] Active persona always visible
- [x] Suggestion chips per persona
- [x] Typing indicator
- [x] Mobile responsive
- [x] API key in env var, never committed
- [x] Graceful API error handling
- [x] `prompts.md` and `reflection.md` in `docs/`
- [x] `.env.example` present
- [ ] Live deployed link — **needs your GEMINI_API_KEY + Render account** (see "What I need from you" below)

---

## What I need from you to deploy

To get a live URL on Render, please provide / do:

1. **Google AI Studio API key** — free at https://aistudio.google.com/app/apikey. You will paste this into Render as the `GEMINI_API_KEY` env var (do **not** paste it in chat or commit it).
2. **A GitHub account** — push this folder to a new public repo so Render can pull from it.
3. **A Render account** — free tier at https://render.com. Connect it to your GitHub.
4. **(Optional)** A custom domain if you want one — otherwise Render gives you a `*.onrender.com` URL automatically.

If you'd like, I can:
- walk you through the GitHub push commands once you've created the repo,
- swap Gemini for OpenAI / Anthropic instead (just say which key you want to use),
- add screenshots to this README once you've run it locally and shared one.

---

## License

MIT — built for educational use.
