// Deck content.
//
// Rebuilt around the commencement board: every slide is a rendered object, and the words
// on a slide are labels attached to that object. Motion marks a change of state only.
//
// This is the first vertical slice. Three slides, chosen to prove the spine carries the
// argument: the board at rest, the notification wired to it, and the November tranche
// firing. If the device works these become twenty; if it does not, only three are wasted.

export type Slide =
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
    id: "three-claims",
    kind: "claims",
    block: "Block 1",
    title: "Three things published about this Act",
    lead: "Quoted word for word. Each one assumes a provision is in force. Here is the board underneath them.",
    claims: [
      {
        quote:
          "Its chairperson and members were appointed on 6 June 2026, and its grievance portal is live.",
        source: "blog.concur.live",
        fact: "F103",
        assumes: "s11-17",
      },
      {
        quote: "India switched on its Data Protection Board.",
        source: "mickai.co.uk",
        fact: "F105",
        assumes: "s7-10",
      },
      {
        quote: "Penalties become live at the twelve month mark, in November 2026.",
        source: "Repeated across vendor sites and law firm summaries",
        fact: "F108",
        assumes: "s28-34",
      },
    ],
    verdict:
      "Every provision these three claims depend on is in the last two rows, and every one of them is dark until 13 May 2027.",
    steps: 5,
    seconds: 240,
    notes: [
      "Read each claim out verbatim. Do not editorialise about the publisher beyond the URL on the slide.",
      "Claim one is checkable live: type dpdpa-grievance.gov.in and let them watch it fail to resolve (F23).",
      "Do not name-and-shame. Most of the room has repeated at least one of these. That is the point.",
      "The Board does exist under ss.18 to 26, which is lit. What does not exist is an appointed Board and a route to it. Keep that distinction clean.",
    ],
  },

  {
    id: "board-at-rest",
    kind: "board",
    block: "Block 1",
    title: "The Act, as it actually stands today",
    caption:
      "One Act, three commencement dates. Almost every piece of bad advice comes from collapsing them into one.",
    steps: 4,
    focusByStep: [undefined, ["s1", "s2", "s18-26", "s35-44"], ["s6-9", "s27-1-d"], undefined],
    readout: [
      { at: 2, text: "Live since 13 November 2025: definitions, and the Board's own existence." },
      { at: 3, text: "Seven weeks away: Consent Manager registration. Two tiles. That is all." },
      { at: 4, text: "Everything you would recognise as compliance is in the last row, and it is dark." },
    ],
    fact: "F1, F3, F4",
    seconds: 210,
    notes: [
      "Let them read the board before you say anything. The picture does the work.",
      "The Act commenced by G.S.R. 843(E). The Rules are a separate instrument, G.S.R. 846(E), same date. Conflating them is the most common error in circulating summaries (F4).",
      "Some sources say 14 November 2025, which is when the Gazette copy became available. Say 13 November, note the discrepancy exists, move on (F5).",
      "Do not editorialise on the last row yet. Block 2 earns it.",
    ],
  },

  {
    id: "dns-check",
    kind: "browser",
    block: "Block 1",
    title: "The grievance portal that was reported as live",
    url: "dpdpa-grievance.gov.in",
    outcome: { headline: "This site can\u2019t be reached", detail: "DNS_PROBE_FINISHED_NXDOMAIN" },
    verdict: "The domain does not resolve. It never has.",
    fact: "F23",
    steps: 3,
    seconds: 120,
    notes: [
      "Do this live if you can. The slide is the backup, not the plan.",
      "Type it slowly enough that people read the URL before it fails.",
      "Ten seconds, one claim falsified in front of them. Cheapest credibility of the day.",
      "Do not gloat. Move straight on to why the claim was plausible.",
    ],
  },

  {
    id: "sdf-register",
    kind: "ledger",
    block: "Block 1",
    title: "The register of Significant Data Fiduciaries",
    headers: ["Notified SDF", "Date notified", "Category of data specified", "Localisation applies"],
    rows: [],
    emptyNote:
      "No entries. No Data Fiduciary has been notified as significant, and no category of data has been specified under Rule 13(4).",
    verdict:
      "The localisation clock cannot be ticking, because the thing it would tick for does not exist yet.",
    fact: "F87, F105",
    steps: 3,
    seconds: 150,
    notes: [
      "An empty register is a stronger image than a paragraph saying the register is empty.",
      "Rule 13(4) is the only localisation provision in the whole instrument, and it applies to notified SDFs only.",
      "If asked about sectoral rules: RBI and IRDAI localisation is separate law and unaffected by any of this.",
    ],
  },

  {
    id: "gazette-wiring",
    kind: "wiring",
    block: "Block 2",
    title: "The notification is the wiring diagram",
    masthead: [
      "MINISTRY OF ELECTRONICS AND INFORMATION TECHNOLOGY",
      "NOTIFICATION",
      "New Delhi, the 13th November, 2025",
      "G.S.R. 843(E)",
    ],
    clauses: [
      {
        ref: "(a)",
        when: "On publication",
        extract:
          "section 2, sections 18 to 26, sections 35, 38 to 43 ... shall come into force",
        energises: ["s1", "s2", "s18-26", "s35-44"],
      },
      {
        ref: "(b)",
        when: "One year",
        extract:
          "sub-section (9) of section 6 and clause (d) of sub-section (1) of section 27",
        energises: ["s6-9", "s27-1-d"],
      },
      {
        ref: "(c)",
        when: "Eighteen months",
        extract:
          "sections 3 to 5 ... sections 11 to 17, section 27 except clause (d) ... sections 28 to 34",
        energises: ["s3-5", "s6", "s7-10", "s11-17", "s27", "s28-34"],
      },
    ],
    verdict:
      "The same instrument that switches on 27(1)(d) next November holds sections 28 to 34 back to May 2027. Section 33 is the penalty. Section 28 is the inquiry.",
    fact: "F123, F124, F128, F129",
    steps: 5,
    seconds: 300,
    notes: [
      "This is the slide the block exists for. Do not rush it.",
      "Walk the wires one at a time. Clause (a), then (b), then (c). Let each one land before the next.",
      "When the ring closes on sections 28 to 34, stop talking for a beat.",
      "Anyone can check this: F. No. AA-11038/1/2025-CL&ES, signed Ajit Kumar, Jt. Secy.",
      "If challenged: the words 'impose penalty' do appear inside 27(1)(d). That is the trap. Clause (c) of this same notification is the answer.",
    ],
  },

  {
    id: "november-fires",
    kind: "board",
    block: "Block 2",
    title: "13 November 2026, in full",
    caption:
      "This is the whole of what changes on the date everyone is talking about.",
    steps: 3,
    focusByStep: [undefined, ["s6-9", "s27-1-d"], ["s28-34"]],
    litByStep: [undefined, ["s6-9", "s27-1-d"], ["s6-9", "s27-1-d"]],
    readout: [
      { at: 2, text: "Two tiles light. Consent Manager duties, and the Board's power to register them." },
      { at: 3, text: "Inquiry and penalties do not move. They are still six months away." },
    ],
    fact: "F130, from F123 to F129",
    seconds: 180,
    notes: [
      "Use the softened reading unless Olivia has signed off on the strong one.",
      "Softened: the notified text does not support penalties beginning on this date. Others read it differently and it has not been tested.",
      "Strong: no penalty can be imposed on anyone on 13 November 2026, and no Data Fiduciary is within reach of the Board's inquiry power.",
      "Close generously. Treating this date as a planning checkpoint is reasonable. Treating it as the date penalties begin is not supported by the text (F145).",
    ],
  },

  {
    id: "enforcement-chain",
    kind: "chain",
    block: "Block 2",
    title: "What would have to exist for a penalty to be imposed",
    intro: "Three things, in order. Follow the chain and see where it stops.",
    nodes: [
      {
        label: "An appointed Board",
        sub: "ss.18-26 are in force, but there is no Chairperson and no Members as of 1 August 2026",
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
      "Not one of the three exists on 13 November 2026. The chain does not break at the end, it never starts.",
    fact: "F18, F128, F129, F130",
    steps: 5,
    seconds: 240,
    notes: [
      "Walk it left to right. Let each box fail before moving on.",
      "Olivia owns this reading. If she has not signed it off, use the softened wording: the notified text does not support penalties beginning on that date.",
      "Be fair: treating 13 November 2026 as a planning checkpoint is reasonable. Treating it as the date penalties begin is not (F145).",
    ],
  },

  {
    id: "cm-registration",
    kind: "chain",
    block: "Block 2",
    title: "So what is 13 November 2026 actually for",
    intro: "Consent Manager registration. Here is what registering would take.",
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
    id: "skillsetu-estate",
    kind: "diagram",
    block: "Block 3",
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
    block: "Block 3",
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
    block: "Block 3",
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
    block: "Block 4",
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
    block: "Block 5",
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
    block: "Block 6",
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
    block: "Block 7",
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
    block: "Block 7",
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
    block: "Block 7",
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
    block: "Block 7",
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
];

export function slideLabel(slide: Slide): string {
  return slide.title;
}
