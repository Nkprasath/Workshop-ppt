# DPDP Implementation Workshop, deck and fact base

Cohort 1, 26 September 2026. Webinar, roughly 75 attendees.

## Open the deck

Download **`deck.html`** and double-click it. That is the whole thing: one file, opens in
any browser, works with no internet connection. Nothing to install and nothing to sign in
to.

| Key | Does |
|---|---|
| `space` or `→` | Next step within a slide, then next slide |
| `←` | Back |
| `↑` `↓` | Jump whole slides |
| `O` | Grid of all 18 slides |
| `P` | Presenter view: speaker notes, timer |
| `F` | Fullscreen |

Press **`P`** while reviewing. The speaker notes are where the reasoning and the delivery
decisions live, and several slides make more sense with them open.

## What is in here

| Path | What it is |
|---|---|
| `deck.html` | The built deck. This is the file to open |
| `facts/dpdp-facts.md` | The fact base. Every legal claim in the deck carries an F number that points here |
| `facts/source-gsr-843E-act-commencement.txt` | The commencement notification, verbatim. The whole of Block 2 turns on this one page |
| `facts/source-dpdp-act-2023.txt` | The Act |
| `facts/source-dpdp-rules-2025.md` | The Rules, as notified |
| `facts/source-certin-directions-2022.txt` | CERT-In Directions, for the breach block |
| `src/`, `scripts/` | Deck source, so it can be changed rather than only received |

Every fact ID on a slide (`F123`, `F130` and so on) is searchable in
`facts/dpdp-facts.md`. Nothing on a slide should be un-traceable. If you find something
that is, that is a bug and worth saying so.

## Rebuilding after a change

```
npm install
npm run build
```

Writes `dist/dpdp-deck.html`. Content lives in `src/lib/content/deck.ts` and the board's
states in `src/lib/content/board.ts`.

## What is not here

The attendee workbook. It exists but has no database behind it yet, so there is nothing
usable to share. The run sheet, the chat FAQ and the registration emails are not written
yet either. This repository is the deck and the evidence behind it, not the whole workshop.
