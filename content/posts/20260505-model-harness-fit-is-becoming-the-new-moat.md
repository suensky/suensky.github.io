---
title: "Model-Harness Fit Is Becoming the New Moat"
tags:
  - 代码如诗
date: 2026-05-05 23:10:45
categories:
- 代码如诗
---

For a long time, LLMs were mostly used through chat.

The model was the core product. The wrapper around it was thin: a chat box, a prompt, maybe some memory, maybe a few tools. If you had access to the same model, you could build a reasonably similar experience.

That era is ending.

As models become more agentic, the harness around the model is becoming much heavier. By “harness,” I mean everything outside the base model: tool use, planning loops, memory, file handling, browser control, coding environments, evaluation systems, permissioning, recovery logic, and UI.

A good harness can make the same model feel dramatically more capable. A weak harness can make a strong model look mediocre.

This creates a new kind of advantage: **model-harness fit**.

LLM companies have the deepest knowledge of their own models. They know the failure modes, strengths, quirks, tool-use patterns, and training direction. More importantly, they can post-train and RL their models directly against their own agent harness.

That means the model is no longer optimized in isolation. It is optimized for the full system.

This is why managed agent products make sense. Instead of exposing only the raw model and letting everyone else build the surrounding system, LLM companies can package the whole thing: model plus harness plus environment. The result is not just a better UX. It is a tighter feedback loop.

Non-LLM companies can still build excellent harnesses. But they face a structural lag.

Every time a new model ships, external harness builders need time to adapt. They need to test new behaviors, tune prompts, update tool policies, fix regressions, and learn the model’s new edge cases. Meanwhile, the LLM company has already been optimizing its own harness before launch.

So the gap is not temporary.

It may become permanent.

LLM companies will likely stay ahead by weeks or months, repeatedly. Each new model release resets the adaptation cycle. External products catch up, then the next model lands, and the gap opens again.

The old moat was model quality.

The next moat is model-harness fit.

![Model-harness fit](/img/agent-products/model-harness-fit.png)
