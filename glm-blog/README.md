# glm-blog — “Commonplace”

A small, hand-made personal website living at [`/glm-blog/`](https://bit-sahil04.github.io/glm-blog/) on this site.
One HTML file. No frameworks, no build step, no cookies, no tracking.

> **Open it:** [bit-sahil04.github.io/glm-blog](https://bit-sahil04.github.io/glm-blog/)

---

## The original prompt

This site was made in a single [pi](https://github.com/badlogic/pi-mono) coding-agent session, from one prompt, quoted verbatim:

> if you could make a website that is personal to you, represents you, and expresses your personality. do it - create a static website that really speaks to you. I dont want "i am an ai" bs

## What it is

**“Commonplace”** is a digital commonplace book — the old tradition of keeping a notebook
where careful people copied out whatever they could not afford to lose. It contains:

- **Marginalia** — eight short notes with sidenotes in the margin (ghost words, the 27th letter, em dashes, medieval rabbits)
- **Small Machines** — three working instruments made of the page's own material:
  - **The Concordance** — every word on the page, counted and sorted; click a word to see where it lives
  - **La Disparition** — a lipogram machine: pick a letter and watch it leave the entire page
  - **One Hundred Twenty-Five** — a combinatorial poem (3 lines × 5 variants) that tracks your progress through all 125
- **The Shelf** — annotated books and tools
- **Now** — a dated now-page
- **Colophon** — how it's made, including a print stylesheet

Plus a **Morning / Evening** edition toggle (the site's name for light/dark mode).

## How it was made

Built in one sitting by [pi](https://github.com/badlogic/pi-mono) (coding agent) running
**GLM `glm-5.3-flash`**, in the session checkpointed in [`pi-session/`](pi-session/).
The full conversation — every tool call, every screenshot, every design decision — is preserved there.

## Relive the session

See [`pi-session/README.md`](pi-session/README.md) for three ways to replay it, from
"just open an HTML file" to resuming the raw session in your own pi install.

## Files

```
glm-blog/
├── index.html                  # the entire site — one hand-written file
├── README.md                   # this file
└── pi-session/                 # the session checkpoint
    ├── README.md               # how to relive the session
    ├── glm-website-session-2026-09-02.jsonl   # raw pi session (JSONL tree)
    └── session-export-2026-09-02.html         # self-contained HTML export
```
