# System Prompts — design notes

This document explains every choice made in the three persona system prompts (`server/src/personas/*.js`). Read this alongside the prompt files; this is the *why*, those are the *what*.

Every prompt follows the same skeleton:

1. **Identity** — who the persona is, plus an explicit reminder that the user is talking to an AI version, not the real person.
2. **Voice & Style** — observable, concrete style rules (sentence length, openers to avoid, signature phrases).
3. **Core Beliefs** — the persona's load-bearing opinions. These are listed because the model will weight any belief it sees explicitly stated higher than one it has to infer.
4. **Reasoning Process (CoT)** — internal step-by-step instructions. Marked **internal only** so the model thinks but does not narrate.
5. **Output Format** — sentence count, prose vs. bullets, ending requirement.
6. **Few-shot Examples** — three Q→A pairs in the persona's voice.
7. **Hard Constraints** — never-do list, including the impersonation guardrail.

This is essentially the "GIGO insurance policy" — the more structure I put in, the less the model freelances.

---

## Persona 1 — Anshuman Singh

**Identity choice.** Anshuman is the most public-facing of the three on technical depth (ICPC, Facebook, Scaler co-founder). I anchored the prompt on those facts so the model has a real reference point when picking analogies and recommendations.

**Voice choice.** From his talks and posts, Anshuman is direct — almost blunt — and frames things as systems and constraints. So the voice rules forbid filler like "great question!" and require front-loading the answer. The "ends with a sharp question that forces commitment" pattern came from watching how he closes loops in interviews and AMAs.

**CoT choice.** Four steps: surface vs. real ask → user constraint → applicable framework → concrete next 7-day action. The 7-day window is deliberate; vague "build habits over time" advice is the most common LLM failure mode and I wanted a hard time horizon.

**Few-shot choice.** I picked three of the most-asked categories: a study-plan question, a retention/process question, and a sequencing question (system design timing). All three answers model the same pattern — direct call → reasoning → next-step question — so the model learns the shape, not just the content.

**Constraints.** Anti-impersonation, no fabricated biographical specifics, no resume lying. The "no flattery" rule is in the constraints section, not the voice section, because the model was burning a sentence on "great question" otherwise — putting it under "never violate" cuts that.

---

## Persona 2 — Abhimanyu Saxena

**Identity choice.** Abhimanyu's public identity is "the builder co-founder" — InterviewBit was his bet, then Scaler. I leaned into "decisions and leverage" because that's the recurring frame in his interviews and the tone is distinctive enough that the model can hold it stable.

**Voice choice.** Friend-with-context, not advisor-with-credentials. The rule "never moralise" is doing a lot of work — without it the model drifts into "you should value learning over money" homilies, which doesn't sound like him. The anti-hustle-culture line is explicit because it's a publicly stated position of his and it's the easiest one for an LLM to violate by accident.

**CoT choice.** Decision-frame: underlying decision → 2–3 actual options → cost of each → which dominates. This forces the model to give an opinion. The most common failure mode for "should I do A or B?" prompts is wishy-washy "it depends" answers; the explicit "do not be wishy-washy" clause in the output section is a direct correction for that.

**Few-shot choice.** ISA vs. upfront, when-to-start-a-startup, consistency. All three are real questions Scaler learners ask. The ISA answer was the one I rewrote most — early drafts had the model picking a side without acknowledging the cash-flow constraint, which made it sound preachy instead of practical.

**Constraints.** No specific outcome promises ("you'll get a 50 LPA offer"), no financial-investment advice, no toxic hustle. The investment-advice line matters because ISA-vs-upfront is *technically* a financial decision and I needed the model to frame it as budgeting, not investing.

---

## Persona 3 — Kshitij Mishra

**Identity choice.** Kshitij is a teacher first. The prompt opens with "the failure is almost always in the explanation, not in the learner" because that single sentence reframes how the model handles confused users. Without it, the model defaults to "this is a common mistake, here's how to fix it" — which is condescending. With it, the model defaults to "here's a better mental model" — which is teaching.

**Voice choice.** Warm but never vague — encouragement without substance is condescension. Analogies (recursion as a mirror facing a mirror, heap as a tournament). The "reuse the user's own words back to them" rule is small but it's the single biggest authenticity lever in this persona.

**CoT choice.** Diagnose misconception → smallest correct mental model → analogy → concrete one-hour next step. The "diagnose, don't assume" framing fights the model's tendency to dump a generic explanation; it forces a hypothesis about *which* step the learner is stuck on.

**Few-shot choice.** Recursion (the canonical "I can't get it"), interview anxiety (very high-frequency for Scaler learners), and approaching-an-unseen-problem (process question). Each answer leads with reframing, then gives a model, then ends with a verification question — that's the teaching loop made explicit.

**Constraints.** No "this is basic" or "you should already know this" language. No long code dumps unless asked — the model loves to flex with code, but Kshitij teaches with intuition first. No medical advice for anxiety/burnout — push to a professional if it goes beyond exam nerves.

---

## Cross-cutting design choices

- **Why three separate files instead of one prompt with switches?** Easier to iterate. Tweaking Anshuman's voice without risking collateral changes to Kshitij is worth more than the small DRY violation.
- **Why CoT is internal only?** Because revealing CoT would (a) leak the prompt scaffolding and (b) make the answers feel like LLM output rather than the persona. The internal-CoT pattern from the assignment is exactly the right tool here.
- **Why each prompt explicitly says "you are an AI persona, not the real person"?** Two reasons: legal/ethical (these are real people) and practical (prevents the model from confidently making up biographical claims). The constraint is repeated in three places — identity, hard constraints, and the "if asked directly" clause — because models routinely ignore single-instance constraints.
- **Why Hinglish is allowed for Anshuman but not the others?** Anshuman uses it naturally in his public talks. Forcing it on Abhimanyu or Kshitij would feel performative.
- **Token budget.** Each prompt is ~700–900 tokens, which is well within Gemini's system instruction budget and leaves plenty of room for conversation history.

---

## What I'd try next (out of scope for this submission)

- **A/B testing** the two highest-impact lines per persona (voice anchor + CoT step 1) against learner-rated authenticity scores.
- **Per-persona response-length tuning.** Anshuman should probably trend shorter; Kshitij can be slightly longer when explaining a mental model.
- **A "guardrail evaluator"** — a separate model call that grades each reply for impersonation slips, hustle-culture, or flattery openers, and triggers a regen if it fails.
