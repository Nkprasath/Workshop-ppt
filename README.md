# DPDP Implementation Workshop, deck and fact base

Cohort 1, 26 September 2026. Webinar, roughly 75 attendees.

## The live site

**https://nkprasath.github.io/Workshop-ppt/**

Two pages, both static. No sign-in, because there is no account, and no server behind
either of them.

| Page | What it is |
|---|---|
| `/workbook.html` | What attendees open on the day and fill in as we go |
| `/deck.html` | The slides |

### The workbook and personal data

The workbook asks attendees for real details about their own systems, so it matters that
this is exact: **nothing typed into it leaves the browser.** There is no server to receive
it. Answers are held in the browser's local storage, the download is generated in the
browser from what is already there, and the facilitators cannot see any of it, including
whether anyone opened the page at all.

That is why the workbook carries its own notice rather than the server one. The server
version promises encryption at rest, a retention period and a purge job, and none of those
things can be true without a server. A workshop whose first block is about checking claims
against primary sources cannot ship a notice that fails its own test.

## Opening the deck offline

Download **`deck.html`** and double-click it. One file, any browser, no internet needed.

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
| `docs/` | The published site. GitHub Pages serves this folder |
| `src/`, `scripts/` | Source for both pages, so they can be changed rather than only received |

Every fact ID on a slide (`F123`, `F130` and so on) is searchable in
`facts/dpdp-facts.md`. Nothing on a slide should be un-traceable. If you find something
that is, that is a bug and worth saying so.

## Rebuilding after a change

```
npm install
npm run build
```

Writes `docs/`, which is what Pages serves. Slide content lives in
`src/lib/content/deck.ts`, the board's states in `src/lib/content/board.ts`, the workbook
sections in `src/lib/content/sections.ts`, and the workbook notice in
`src/lib/content/notice-static.ts`.

## What is not here

The run sheet, the chat FAQ and the registration emails are not written yet.

The server version of the workbook is also not here. It would add accounts, a facilitator
view of live completion, and a scheduled deletion job, and it needs a database that does
not exist yet. The static version in `docs/` is complete and usable as it stands, and it
is the one an attendee should be pointed at.
