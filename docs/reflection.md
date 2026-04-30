# Reflection

## What worked

The single biggest win was treating each system prompt like a product spec, not a paragraph. Splitting every persona into the same six sections — Identity, Voice, Beliefs, internal CoT, Output Format, Few-shot, Hard Constraints — made the prompts diff-able and made it obvious which slot was responsible when an answer felt off. When Anshuman's replies were leading with "great question!", I didn't have to rewrite the whole prompt; I added one line under Hard Constraints and the behaviour disappeared in the next call. That kind of localised editing is only possible because the prompts have structure.

The chain-of-thought instruction landed surprisingly well *because* I marked it explicitly internal. My first attempt had the model narrating "Step 1: identify the user's constraint…" in the actual reply, which broke the persona instantly. Adding "NEVER print this. Show the conclusion, not the scaffolding." in big letters at the end of the CoT block fixed it cleanly. Internal reasoning + visible answer is the assignment's exact ask, and structurally separating the two in the prompt is what made it stick.

Few-shot examples were the highest-leverage section per token. Three good Q→A pairs per persona did more for tone than any amount of voice description. The model imitates patterns it sees more reliably than rules it's told to follow, so showing it three answers that all end with a clarifying question taught it to do that better than the rule "end with a question" ever did on its own.

## What GIGO taught me

The lazy version of this assignment writes a prompt like *"You are Anshuman Singh, co-founder of Scaler. Be helpful and direct."* and then complains that the bot sounds generic. That is GIGO in its purest form — vague input, vague output. Every concrete improvement in response quality came from a concrete addition to the input: a specific anchor like "you were an early Facebook engineer", a specific anti-pattern like "no flattery openers", a specific output rule like "4–6 sentences, end with one direct question". The LLM is not creative; it is a remarkably faithful mirror of how much thought you put into the brief. If I wanted Anshuman to sound like Anshuman, I had to actually study what makes Anshuman Anshuman first — his framing, his sentence rhythm, the way he closes loops. There was no shortcut that beat doing the research.

The corollary is that every constraint costs nothing at runtime but pays dividends every reply. "Never claim to be the real person" took ten seconds to write into the prompt and prevented a whole class of bad outputs forever.

## What I'd improve

Three things, in order of impact.

First, persona-specific evaluation. Right now I judge "does this sound like Kshitij?" by reading replies myself, which doesn't scale and is biased by the prompt I just wrote. I'd build a small evaluator — a separate model call that scores replies for authenticity, persona slips, and forbidden patterns (flattery, impersonation, length violations) — and use it to A/B test prompt edits objectively.

Second, conversation memory beyond the current session. Right now switching personas resets state, which is correct, but within a single persona the model only sees the recent message history. A short per-persona scratchpad ("things this user has told me about themselves: 1 YOE, currently at a service company, prepping for FAANG") would make follow-ups feel meaningfully smarter without changing the prompt.

Third, a fallback persona. If Gemini returns an empty or junk response, the user currently sees a generic error. A "graceful degradation" reply in the persona's voice ("connection's flaky on my end — try that again?") would keep the experience cohesive even when the underlying API hiccups. Small touch, big difference in perceived quality.
