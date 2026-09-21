// Deck content.
//
// Rebuilt around the commencement board: every slide is a rendered object, and the words
// on a slide are labels attached to that object. Motion marks a change of state only.
//
// This is the first vertical slice. Three slides, chosen to prove the spine carries the
// argument: the board at rest, the notification wired to it, and the November tranche
// firing. If the device works these become twenty; if it does not, only three are wasted.

export type Slide =
  | TitleSlide
  | CompanySlide
  | BoardSlide
  | WiringSlide
  | ClaimsSlide
  | BrowserSlide
  | ChainSlide
  | LedgerSlide
  | DiagramSlide
  | CompareSlide
  | ProportionSlide
  | DialsSlide
  | LanesSlide;

interface Base {
  id: string;
  block: string;
  title: string;
  // Presenter view only. Written as things to say, not descriptions of the slide.
  notes: string[];
  seconds: number;
  steps: number;
}

// The board, with a caption and optionally some of it under attention.
export interface BoardSlide extends Base {
  kind: "board";
  caption: string;
  // Per step: which tiles are at full attention. Index 0 is step 1.
  focusByStep?: (string[] | undefined)[];
  // Per step: which tiles render as switched on regardless of their own state.
  litByStep?: (string[] | undefined)[];
  readout: { at: number; text: string }[];
  fact: string;
}

// The opening. States what this is and what you walk away holding, and nothing else.
export interface TitleSlide extends Base {
  kind: "title";
  lead: string;
  outcomes: string[];
  meta: string;
}

// The company every worked example in the day runs on. Introduced properly, once, so
// that every later slide can just say "SkillSetu" and be understood.
export interface CompanySlide extends Base {
  kind: "company";
  company: string;
  what: string;
  figures: { n: string; label: string; note?: string }[];
  why: string;
}

// The notification wired to the board: clauses below, the provisions they energise above.
export interface WiringSlide extends Base {
  kind: "wiring";
  masthead: string[];
  clauses: {
    ref: string;
    when: string;
    // The operative extract, quoted. Trimmed with ellipses, never paraphrased.
    extract: string;
    // Tiles this clause switches on.
    energises: string[];
  }[];
  verdict: string;
  fact: string;
}

// Three claims in circulation, each one pinned to the provision it assumes is in force.
// The board is already on screen showing that provision dark, so the correction is made
// by pointing rather than by asserting.
export interface ClaimsSlide extends Base {
  kind: "claims";
  lead: string;
  claims: {
    quote: string;
    source: string;
    fact: string;
    // The tile this claim assumes is switched on. It is not.
    assumes: string;
  }[];
  verdict: string;
}


// A claim falsified live, staged as the browser doing it.
export interface BrowserSlide extends Base {
  kind: "browser";
  url: string;
  outcome: { headline: string; detail: string };
  verdict: string;
  fact: string;
}

// Linked boxes where the argument is that a link is missing. Used wherever something
// cannot happen because a step in the chain does not exist yet.
export interface ChainSlide extends Base {
  kind: "chain";
  intro?: string;
  nodes: { label: string; sub: string; state: "present" | "absent" }[];
  verdict: string;
  fact: string;
}

// A ruled register. Sometimes the point is what is written in it; sometimes the point is
// that it is empty.
export interface LedgerSlide extends Base {
  kind: "ledger";
  headers: string[];
  rows: string[][];
  // Cells to score through, as "row,col" pairs.
  scored?: string[];
  emptyNote?: string;
  verdict: string;
  fact: string;
}

// A hand-drawn system map. Nodes placed on the 1280x720 canvas, edges between them.
export interface DiagramSlide extends Base {
  kind: "diagram";
  nodes: {
    id: string;
    label: string;
    sub?: string;
    x: number;
    y: number;
    w: number;
    tone?: "plain" | "warn";
  }[];
  edges: { from: string; to: string; bend?: number; at: number }[];
  verdict: string;
  fact: string;
}

// Two panels held against each other, each with its own lamp.
export interface CompareSlide extends Base {
  kind: "compare";
  panels: {
    title: string;
    source: string;
    state: "live" | "not-yet";
    rows: { label: string; value: string }[];
  }[];
  verdict: string;
  fact: string;
}

// Proportion made physical.
export interface ProportionSlide extends Base {
  kind: "proportion";
  total: { n: string; label: string };
  subset: { n: string; label: string; count: number };
  dots: number;
  consequence: string;
  fact: string;
}

// Clock faces, where only some of them are running.
export interface DialsSlide extends Base {
  kind: "dials";
  dials: {
    time: string;
    who: string;
    starts: string;
    running: boolean;
  }[];
  footnote: string;
  fact: string;
}

// The plan, as lanes of work rather than a list of tasks.
export interface LanesSlide extends Base {
  kind: "lanes";
  lanes: { area: string; now: string; day30: string; day90: string }[];
  verdict: string;
  fact: string;
}

export const SLIDES: Slide[] = [

  {
    id: "title",
    kind: "title",
    block: "",
    title: "What the DPDP Act asks of you, and when",
    lead: "Most of this Act is not in force yet. The part that matters to you arrives on 13 May 2027, and the work it implies takes longer than the time left.",
    outcomes: [
      "A written inventory of where personal data actually sits in your business",
      "Your notice measured against what Rule 3 requires",
      "A position on the data you collected before any of this existed",
      "A ninety day plan you can put in front of a board",
    ],
    meta: "Cohort 1 \u00b7 26 September 2026 \u00b7 Prasath and Olivia",
    steps: 3,
    seconds: 180,
    notes: [
      "Do not open with the Act. Open with what they leave holding.",
      "Say the runtime and the shape: seven blocks, you present, they work, questions. Nothing they type reaches us.",
      "Ask them to open the workbook link now and leave it closed. Finding a link cold at block three costs five minutes.",
    ],
  },

  {
    id: "board-at-rest",
    kind: "board",
    block: "Block 1 · When this reaches you",
    title: "One Act, three start dates",
    caption:
      "The government switched this on in three stages. Here is the whole schedule, and where we are in it today.",
    steps: 4,
    focusByStep: [undefined, ["s1", "s2", "s18-26", "s35-44"], ["s6-9", "s27-1-d"], undefined],
    readout: [
      { at: 2, text: "In force since 13 November 2025: the definitions, and the Board existing on paper. Four provisions." },
      { at: 3, text: "Next: 13 November 2026. Two provisions, both about Consent Managers." },
      { at: 4, text: "Then 13 May 2027, when everything you would recognise as compliance arrives at once. That is the date to plan against." },
    ],
    fact: "F1, F3, F4",
    seconds: 210,
    notes: [
      "Let them read the board before you say anything. Left to right is the whole story.",
      "The Act commenced by G.S.R. 843(E). The Rules are a separate instrument, G.S.R. 846(E), same date. Conflating them is the most common error in circulating summaries (F4).",
      "Some sources say 14 November 2025, which is when the Gazette copy became available. Say 13 November, note the discrepancy exists, move on (F5).",
      "Do not rush this. If they leave with only one picture from the day, it should be this one.",
    ],
  },




  {
    id: "november-fires",
    kind: "board",
    block: "Block 1 · When this reaches you",
    title: "What changes on 13 November 2026",
    caption:
      "The next date on the schedule. This is the complete list of what switches on.",
    steps: 3,
    focusByStep: [undefined, ["s6-9", "s27-1-d"], ["s28-34"]],
    litByStep: [undefined, ["s6-9", "s27-1-d"], ["s6-9", "s27-1-d"]],
    readout: [
      { at: 2, text: "Two provisions switch on. Consent Manager duties, and the Board's power to register them." },
      { at: 3, text: "Inquiry and penalties do not move. They are still six months away." },
    ],
    fact: "F130, from F123 to F129",
    seconds: 180,
    notes: [
      "Say it plainly: no penalty can be imposed on anyone on this date, and no Data Fiduciary is within reach of the Board's inquiry power.",
      "The penalty machinery arrives on 13 May 2027 with everything else. That is the date to plan against.",
      "Close generously. Treating 13 November 2026 as a planning checkpoint is reasonable. Treating it as the date penalties begin is not supported by the text (F145).",
    ],
  },


  {
    id: "cm-registration",
    kind: "chain",
    block: "Block 1 · When this reaches you",
    title: "Who that date is for",
    intro: "Consent Managers, and almost nobody else. Here is what becoming one takes.",
    nodes: [
      {
        label: "A registrar",
        sub: "s.27(1)(d), which commences on the date itself",
        state: "present",
      },
      {
        label: "An appointed Board to be that registrar",
        sub: "No Chairperson, no Members",
        state: "absent",
      },
      {
        label: "Published conditions to register against",
        sub: "First Schedule, not yet issued",
        state: "absent",
      },
    ],
    verdict:
      "Registration is voluntary, and on the day it commences there is nobody appointed to register with.",
    fact: "F18, F30",
    steps: 5,
    seconds: 180,
    notes: [
      "Lead with the registrar. It is the simple version and it lands without the certification chain.",
      "Hold the First Schedule detail in reserve for pushback.",
      "Do not predict when appointments will happen. Guessing is the error we are correcting.",
    ],
  },
  {
    id: "enforcement-chain",
    kind: "chain",
    block: "Block 1 · When this reaches you",
    title: "Does anything get enforced on that date?",
    intro: "The question everybody asks about November. Enforcement needs three things, and the schedule tells you when each arrives.",
    nodes: [
      {
        label: "An appointed Board",
        sub: "In force since 2025, but no Chairperson or Members have been appointed yet",
        state: "absent",
      },
      {
        label: "A power to inquire",
        sub: "s.28, commences 13 May 2027",
        state: "absent",
      },
      {
        label: "A power to penalise",
        sub: "s.33 and the Schedule, commence 13 May 2027",
        state: "absent",
      },
    ],
    verdict:
      "All three arrive on 13 May 2027. So the honest answer for November is no, and the date to prepare for is May.",
    fact: "F18, F128, F129, F130",
    steps: 5,
    seconds: 240,
    notes: [
      "Walk it left to right. This answers the question rather than arguing with anyone.",
      "If challenged, the contrary argument is that 27(1)(d) is self-executing without section 28. Even then no money moves, because the amount lives only in section 33 and the Schedule and neither is in force.",
      "Be fair: treating 13 November 2026 as a planning checkpoint is reasonable. Treating it as the date penalties begin is not (F145).",
    ],
  },

  {
    id: "skillsetu",
    kind: "company",
    block: "Block 2 · Where your data is",
    title: "Every example today runs on one company",
    company: "SkillSetu",
    what: "An Indian edtech. Live tutoring, recorded classes, a marketplace of freelance tutors. Roughly the size and shape of a company at Series B.",
    figures: [
      { n: "400,000", label: "learner accounts", note: "across app and web" },
      { n: "60,000", label: "of them under 18", note: "15 percent, and they do not know the number" },
      { n: "12", label: "systems holding personal data", note: "three of which nobody owns" },
      { n: "1", label: "processor outside India", note: "no contract with them at all" },
    ],
    why: "It is invented, but nothing in it is. Every system, every gap and every awkward question comes from real engagements. If it sounds like your company, that is the point.",
    steps: 3,
    seconds: 180,
    notes: [
      "Make the case that this is recognisable. If they do not see themselves in it, the exercises do not land.",
      "The three unowned systems and the vendor with no contract are the two findings that recur all day. Plant them here.",
      "Nobody has to agree it looks like them. Ask instead which of the four numbers they could produce for their own business by Friday.",
    ],
  },

  {
    id: "skillsetu-estate",
    kind: "diagram",
    block: "Block 2 · Where your data is",
    title: "Where personal data actually sits",
    nodes: [
      { id: "app", label: "Learner app", sub: "400,000 accounts", x: 120, y: 250, w: 190 },
      { id: "mysql", label: "Primary MySQL", sub: "name, email, DoB, phone", x: 410, y: 180, w: 205 },
      { id: "legacy", label: "Legacy MySQL box", sub: "no current owner", x: 410, y: 360, w: 205, tone: "warn" },
      { id: "zoom", label: "Zoom cloud", sub: "recorded tutorials", x: 715, y: 150, w: 185 },
      { id: "crm", label: "CRM", sub: "sales notes, free text", x: 715, y: 285, w: 185 },
      { id: "sheet", label: "Ops Google Sheet", sub: "link sharing: anyone", x: 715, y: 420, w: 185, tone: "warn" },
      { id: "vendor", label: "Analytics vendor", sub: "Singapore", x: 1000, y: 285, w: 175, tone: "warn" },
    ],
    edges: [
      { from: "app", to: "mysql", at: 2 },
      { from: "app", to: "legacy", at: 2, bend: 18 },
      { from: "mysql", to: "zoom", at: 3, bend: -20 },
      { from: "mysql", to: "crm", at: 3 },
      { from: "mysql", to: "sheet", at: 3, bend: 22 },
      { from: "crm", to: "vendor", at: 4 },
    ],
    verdict:
      "Three of these seven are the ones nobody lists from memory: the unowned box, the shared sheet, and the vendor outside India.",
    fact: "F60, F62",
    steps: 5,
    seconds: 240,
    notes: [
      "Build it in front of them. App, then stores, then the places data leaks sideways into.",
      "The unowned legacy box is the most important node. Write unknown in every column, because unknown is the finding.",
      "Ask which of their own boxes has no owner. Nobody answers out loud, everybody writes something down.",
    ],
  },

  {
    id: "inventory-row",
    kind: "ledger",
    block: "Block 2 · Where your data is",
    title: "One row, filled honestly",
    headers: ["Data element", "Where it lives", "Lawful basis", "Retention", "Shared with"],
    rows: [
      ["Learner date of birth", "Primary MySQL", "Consent, s.6(1)", "Life of account", "Analytics vendor"],
      ["Tutorial recordings", "Zoom cloud", "Consent, s.6(1)", "No stated period", "Nobody"],
      ["Support tickets", "CRM, free text", "Unknown", "Unknown", "Unknown"],
    ],
    scored: ["2,2", "2,3", "2,4"],
    verdict:
      "The honest row is the third one. Unknown three times is a finding, not a gap in your homework.",
    fact: "F62",
    steps: 4,
    seconds: 180,
    notes: [
      "Do not let people leave cells blank. Blank reads as not started; unknown reads as investigated and not yet answered.",
      "Retention is where almost every row falls over. No stated period is extremely common and worth saying out loud.",
    ],
  },

  {
    id: "children",
    kind: "proportion",
    block: "Block 2 · Where your data is",
    title: "Why the children question is not a footnote",
    total: { n: "400,000", label: "learners" },
    subset: { n: "60,000", label: "under 18", count: 15 },
    dots: 100,
    consequence:
      "Every one of them needs verifiable parental consent under s.9, and behavioural advertising to them is not lawful at all.",
    fact: "F70, F71",
    steps: 3,
    seconds: 150,
    notes: [
      "Let the dots land before you say the number.",
      "Fifteen percent is not an edge case. That is the point of the picture.",
      "Ask how many know their own under-18 count. Almost nobody does.",
    ],
  },

  {
    id: "notice-requirements",
    kind: "ledger",
    block: "Block 3 · What you must tell people",
    title: "What a notice has to contain",
    headers: ["Requirement", "Where it comes from", "Typical state"],
    rows: [
      ["An itemised description of the personal data", "Rule 3(b)", "Usually a category, not an itemisation"],
      ["The specified purpose, itemised against the data", "Rule 3(b)", "Usually one paragraph for everything"],
      ["The goods or services the processing enables", "Rule 3(b)", "Often missing entirely"],
      ["How to withdraw consent, as easily as it was given", "s.6(4), Rule 3(c)", "Often harder than giving it"],
      ["How to exercise rights, and how to complain", "s.5(1), Rule 3(c)", "An email address, if anything"],
    ],
    scored: ["0,2", "1,2", "2,2"],
    verdict:
      "None of this is in force until 13 May 2027, which is exactly why now is when you write it, rather than when you are asked for it.",
    fact: "F31, F33",
    steps: 4,
    seconds: 210,
    notes: [
      "Read our own workbook notice aloud against this list. Invite them to catch us short.",
      "Itemised is the word that does the work in Rule 3(b), and it is the one almost every published notice fails.",
      "Say plainly that s.5 and Rule 3 are not in force yet and we are meeting them voluntarily. Claiming compliance with an obligation that has not commenced is the error Block 1 corrected.",
    ],
  },

  {
    id: "legacy-position",
    kind: "chain",
    block: "Block 3 · What you must tell people",
    title: "Data you collected before any of this commenced",
    intro: "One dataset, three defensible positions. Pick one per dataset and write down why.",
    nodes: [
      {
        label: "Re-consent",
        sub: "Ask again under s.6. Expect a low response rate and plan for it",
        state: "present",
      },
      {
        label: "Rely on a legitimate use",
        sub: "s.7, narrower than people hope. Document the reasoning",
        state: "present",
      },
      {
        label: "Delete",
        sub: "Cheapest to defend, hardest to reverse. Check retention floors first",
        state: "present",
      },
    ],
    verdict:
      "There is no fourth option called leave it and hope. A register with a decision per dataset is the deliverable.",
    fact: "F37, F38",
    steps: 5,
    seconds: 210,
    notes: [
      "The s.5(2) notice for pre-commencement data is the thing most people have never heard of. Flag it.",
      "The register matters more than the decision. A wrong decision you can show reasoning for is defensible; no record is not.",
    ],
  },

  {
    id: "rights-clocks",
    kind: "ledger",
    block: "Block 4 · When someone asks",
    title: "Four requests, and what the clock actually says",
    headers: ["The request", "What it really is", "The deadline"],
    rows: [
      ["I want all my data", "An access request, s.11", "No statutory period exists"],
      ["My son is 15, delete his account", "Erasure by a parent, ss.9 and 12", "No statutory period exists"],
      ["Delete everything, including my invoices", "Erasure with a retention conflict", "Blocked in part by Rule 6(1)(e)"],
      ["This is unacceptable, I want to complain", "A grievance, s.13", "Your own published period, capped at 90 days"],
    ],
    scored: ["0,2", "1,2"],
    verdict:
      "There is no thirty day rule in this Act. The number people repeat comes from somewhere else entirely.",
    fact: "F41, F42, F107",
    steps: 5,
    seconds: 240,
    notes: [
      "The 30 day figure is repeated across vendor sites and it is simply not in the instrument (F107).",
      "Rule 14(3) caps a self-published grievance period at ninety days. That is a ceiling on your own promise, not a deadline the Act sets.",
      "The erasure conflict is worth slowing down on: you can be obliged to keep a record you have been asked to delete.",
    ],
  },

  {
    id: "breach-two-laws",
    kind: "compare",
    block: "Block 5 · When it goes wrong",
    title: "Two laws, one incident, and only one of them applies today",
    panels: [
      {
        title: "CERT-In Directions, 2022",
        source: "In force since 2022",
        state: "live",
        rows: [
          { label: "Initial report", value: "6 hours of noticing" },
          { label: "Who to", value: "CERT-In" },
          { label: "Applies to", value: "Essentially every organisation" },
          { label: "Today", value: "Yes. This is the one that can bite you now" },
        ],
      },
      {
        title: "DPDP Rule 7",
        source: "Commences 13 May 2027",
        state: "not-yet",
        rows: [
          { label: "To data principals", value: "Without delay" },
          { label: "To the Board", value: "Without delay, then detail within 72 hours" },
          { label: "Applies to", value: "Data Fiduciaries" },
          { label: "Today", value: "No. Not in force" },
        ],
      },
    ],
    verdict:
      "The Rules contain no six hour report. That figure is CERT-In, it is a separate law, and it is live right now.",
    fact: "F48, F54, F106",
    steps: 4,
    seconds: 240,
    notes: [
      "Our own documentation page carries the six hour error. Say so out loud. It is being corrected separately, and admitting it buys enormous credibility.",
      "This block leans on CERT-In being live today and on the procurement question, not on a November deadline.",
    ],
  },

  {
    id: "four-clocks",
    kind: "dials",
    block: "Block 5 · When it goes wrong",
    title: "Four clocks, one of them running",
    dials: [
      { time: "6h", who: "CERT-In", starts: "On noticing", running: true },
      { time: "ASAP", who: "Rule 7(1), to principals", starts: "On becoming aware", running: false },
      { time: "ASAP", who: "Rule 7(2)(a), to the Board", starts: "On becoming aware", running: false },
      { time: "72h", who: "Rule 7(2)(b), detail to the Board", starts: "On becoming aware", running: false },
    ],
    footnote:
      "Build the incident log now anyway. The facts you need at hour six are the facts you need at hour seventy two.",
    fact: "F48, F54",
    steps: 5,
    seconds: 180,
    notes: [
      "Reveal one dial at a time. The punchline is which face is moving.",
      "Without delay is not a number and should not be written as one in your runbook.",
    ],
  },

  {
    id: "vendor-clauses",
    kind: "ledger",
    block: "Block 5 · When it goes wrong",
    title: "What has to be in the processor contract",
    headers: ["Clause", "Why it exists", "In your current template"],
    rows: [
      ["Process only on documented instruction", "s.8(2), the whole basis of using a processor", "Usually yes"],
      ["Notify you of an incident, with a stated hour count", "You cannot meet your clock if they miss theirs", "Usually vague"],
      ["Name every subprocessor, and tell you before adding one", "You cannot inventory what you cannot see", "Usually absent"],
      ["Return or delete on termination", "Otherwise your retention position is fiction", "Sometimes"],
      ["Keep logs for a stated period", "The Rule 6(1)(e) floor is one year", "Usually absent"],
    ],
    scored: ["1,2", "2,2", "4,2"],
    verdict:
      "The incident notice hour count is the one to fight for. Everything else you can fix later; that one you cannot fix during an incident.",
    fact: "F55, F58",
    steps: 4,
    seconds: 210,
    notes: [
      "Procurement is the live lever today, because contracts signed now will still be running in May 2027.",
      "If a vendor will not commit to an hour count, that is itself the answer.",
    ],
  },

  {
    id: "ninety-day",
    kind: "lanes",
    block: "Block 6 · What you do next",
    title: "The next ninety days",
    lanes: [
      { area: "Inventory", now: "Today\u2019s rows", day30: "Every system named, owners assigned", day90: "Unknowns closed or escalated" },
      { area: "Notice", now: "Checklist scored", day30: "Draft written against Rule 3", day90: "Reviewed, not yet published" },
      { area: "Legacy data", now: "Register started", day30: "A decision per dataset", day90: "Decisions executed" },
      { area: "Rights process", now: "SOP sketched", day30: "One named owner, one inbox", day90: "Tested with a real request" },
      { area: "Breach", now: "Clocks understood", day30: "CERT-In runbook live", day90: "Rehearsed once" },
      { area: "Vendors", now: "Gaps identified", day30: "New template agreed", day90: "Top five renegotiated" },
    ],
    verdict:
      "Nothing here waits on the Board, and nothing here waits on May 2027. All of it is work you control.",
    fact: "F150",
    steps: 4,
    seconds: 240,
    notes: [
      "This is the slide people photograph. Leave it up while they fill the scorecard.",
      "The last column is deliberately not done. Ninety days does not finish this, and pretending it does is how plans get abandoned.",
    ],
  },

  {
    id: "close",
    kind: "title",
    block: "",
    title: "What you are leaving with",
    lead: "None of this waits on the Board being constituted, and none of it waits on May 2027. It is all work you control today.",
    outcomes: [
      "Download your workbook before you close the tab. It is held in your browser and nowhere else",
      "The inventory is the dependency. Rights, breach and notice all fail without it",
      "Contracts you sign this quarter will still be running in May 2027. Fix the template now",
      "CERT-In is live today. That obligation does not wait for anything",
    ],
    meta: "Questions to privacy@theprivacylabs.com",
    steps: 3,
    seconds: 240,
    notes: [
      "Do not summarise the Act. Summarise what they now hold and what it is for.",
      "Point at the download button before saying anything else. This is the last moment their work is recoverable.",
      "Take the remaining questions here rather than earlier, so the last thing they hear is an answer rather than a slide.",
    ],
  }
];

export function slideLabel(slide: Slide): string {
  return slide.title;
}
