// Deck content.
//
// Rebuilt around the commencement board: every slide is a rendered object, and the words
// on a slide are labels attached to that object. Motion marks a change of state only.
//
// This is the first vertical slice. Three slides, chosen to prove the spine carries the
// argument: the board at rest, the notification wired to it, and the November tranche
// firing. If the device works these become twenty; if it does not, only three are wasted.

export type Slide =
  | CoverSlide
  | HostsSlide
  | AgendaSlide
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

// The cover: what the session is, the three dates it turns on, and what people leave with.
export interface CoverSlide extends Base {
  kind: "cover";
  eyebrow: string;
  lead: string;
  dates: { date: string; what: string; main?: boolean }[];
  outcomes: string[];
  meta: string;
}

// Who is running the session, and how each block runs.
export interface HostsSlide extends Base {
  kind: "hosts";
  lead: string;
  hosts: { name: string; role: string; also?: string; photo: "prasath" | "olivia" }[];
  rhythm: string[];
  note: string;
}

// The six blocks as cards, revealed one per step.
export interface AgendaSlide extends Base {
  kind: "agenda";
  blocks: { name: string; covers: string; produce: string }[];
  verdict: string;
}

// The opening. States what this is and what you walk away holding, and nothing else.
export interface TitleSlide extends Base {
  kind: "title";
  lead: string;
  outcomes: string[];
  meta: string;
}

// The company every worked example in the day runs on. Introduced properly, once, so
// that every later slide can name it and be understood.
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
  // A list of requirements rather than a diagnosis: no in-place marks, no strike-throughs.
  neutral?: boolean;
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

// Block labels. One place, so the deck and the agenda cannot disagree.
const B1 = "Block 1 · The timeline";
const B2 = "Block 2 · Your personal data";
const B3 = "Block 3 · Notice and existing data";
const B4 = "Block 4 · Data Principal requests";
const B5 = "Block 5 · Breaches and vendors";
const B6 = "Block 6 · Your action plan";

export const SLIDES: Slide[] = [

  {
    id: "title",
    kind: "cover",
    block: "",
    eyebrow: "DPDP Implementation Workshop",
    title: "DPDP Act:\nwhat it requires of your business, and when",
    lead: "Most of the Act is not yet in force. The obligations that affect most businesses come into force on 13 May 2027, and preparing for them takes longer than the time that remains.",
    dates: [
      { date: "13 Nov 2025", what: "Definitions and the DPBI: in force" },
      { date: "13 Nov 2026", what: "Consent Manager provisions" },
      { date: "13 May 2027", what: "Notice, consent, rights, breaches and penalties", main: true },
    ],
    outcomes: [
      "A recorded inventory of where personal data is collected and stored",
      "Your privacy notice checked against Rule 3",
      "A decision on data collected before the Act comes into force",
      "An action plan you can present to your leadership",
    ],
    meta: "Nakendraprasath K and Olivia Daniel · Privacy Labs",
    steps: 3,
    seconds: 150,
    notes: [
      "Open with what they will leave with, not with the Act.",
      "The three dates on the right are the spine of Block 1. Do not explain them yet.",
      "Ask them to open the workbook link now and keep the tab ready. Finding it later costs time.",
    ],
  },

  {
    id: "facilitators",
    kind: "hosts",
    block: "",
    title: "Your facilitators",
    lead: "This session is run by Privacy Labs, which builds DPDP compliance software for Indian businesses.",
    hosts: [
      {
        name: "Nakendraprasath K",
        role: "Founder",
        photo: "prasath",
      },
      {
        name: "Olivia Daniel",
        role: "Head of Legal",
        also: "Founder, Mosae Legal Tech Solutions",
        photo: "olivia",
      },
    ],
    rhythm: ["We explain the requirement", "You apply it to your business in the workbook", "We take your questions"],
    note: "Nothing you enter in the workbook reaches us. It stays in your browser until you download it.",
    steps: 2,
    seconds: 150,
    notes: [
      "Introduce each other briefly. Olivia covers the legal questions; Prasath covers the operational ones.",
      "Explain the rhythm once here, so later blocks can start without repeating it.",
    ],
  },

  {
    id: "agenda",
    kind: "ledger",
    block: "",
    title: "Agenda",
    headers: ["Block", "What it covers", "What you produce"],
    rows: [
      ["1. The timeline", "Which parts of the Act are in force, and when the rest comes into force", "The dates that apply to your business"],
      ["2. Your personal data", "What personal data you hold, where it is collected and where it is stored", "The first rows of your data inventory"],
      ["3. Notice and existing data", "What your privacy notice must state, and what to do with data collected earlier", "A scored notice and a decision per dataset"],
      ["4. Data Principal requests", "Requests to access, correct or erase data, and complaints", "An outline of your request process"],
      ["5. Breaches and vendors", "What to report after a breach, and what processor contracts must contain", "Your breach steps and contract gaps"],
      ["6. Your action plan", "What to do over the next ninety days", "A plan you can present to your leadership"],
    ],
    verdict:
      "The blocks build on each other: first when the law applies, then what data you hold, then what you owe the people that data belongs to, and finally your plan.",
    fact: "",
    steps: 6,
    seconds: 180,
    notes: [
      "Walk through the six blocks in one or two sentences each. This is the story of the session.",
      "The order matters: you cannot write a notice or answer a request until you know what data you hold.",
    ],
  },

  {
    id: "board-at-rest",
    kind: "board",
    block: B1,
    title: "One Act, three commencement dates",
    caption:
      "The Act comes into force in three stages, set by the government's notification of 13 November 2025. This is the full schedule and the status of each part today.",
    steps: 4,
    focusByStep: [undefined, ["s1", "s2", "s18-26", "s35-44"], ["s6-9", "s27-1-d"], undefined],
    readout: [
      { at: 2, text: "In force since 13 November 2025: the definitions, the establishment of the Data Protection Board of India (DPBI), and the power to make Rules." },
      { at: 3, text: "Comes into force on 13 November 2026: two provisions, both concerning Consent Managers.* *If your organisation intends to register as a Consent Manager, this date applies to you." },
      { at: 4, text: "Comes into force on 13 May 2027: the obligations most businesses must comply with, including notice, consent, rights and penalties. This is the date to plan for." },
    ],
    fact: "F1, F3, F4",
    seconds: 210,
    notes: [
      "Let them read the schedule before you speak. Left to right is the whole timeline.",
      "The Act was brought into force by G.S.R. 843(E). The Rules are a separate instrument, G.S.R. 846(E), of the same date. Summaries often confuse the two.",
      "Some sources give 14 November 2025, the date the Gazette copy became available. Say 13 November and note the discrepancy.",
      "Abbreviate the Data Protection Board of India as the DPBI from here on, so it is not confused with a company's own board.",
    ],
  },

  {
    id: "november-fires",
    kind: "board",
    block: B1,
    title: "What comes into force on 13 November 2026",
    caption:
      "The next commencement date. These are the only provisions that come into force on that date.",
    steps: 3,
    focusByStep: [undefined, ["s6-9", "s27-1-d"], ["s28-34"]],
    litByStep: [undefined, ["s6-9", "s27-1-d"], ["s6-9", "s27-1-d"]],
    readout: [
      { at: 2, text: "Two provisions come into force: the duties of Consent Managers, and the DPBI's power to register them." },
      { at: 3, text: "Inquiries and penalties do not come into force on this date. They come into force on 13 May 2027." },
    ],
    fact: "F130, from F123 to F129",
    seconds: 180,
    notes: [
      "State it plainly: no penalty can be imposed on this date, and the DPBI's power of inquiry is not yet in force.",
      "Treating 13 November 2026 as an internal checkpoint is reasonable. Treating it as the date penalties begin is not supported by the text.",
    ],
  },

  {
    id: "cm-registration",
    kind: "chain",
    block: B1,
    title: "Who 13 November 2026 applies to",
    intro: "Organisations that intend to register as Consent Managers. If you plan to become one, this date applies to you. Registration requires all three of the following.",
    nodes: [
      {
        label: "A power to register",
        sub: "s.27(1)(d), which comes into force on 13 November 2026",
        state: "present",
      },
      {
        label: "An appointed DPBI to exercise it",
        sub: "No Chairperson or Members have been appointed",
        state: "absent",
      },
      {
        label: "Published conditions for registration",
        sub: "The First Schedule conditions have not been issued",
        state: "absent",
      },
    ],
    verdict:
      "Registration is voluntary. The power to register comes into force on 13 November 2026, but no DPBI has yet been appointed to exercise it.",
    fact: "F18, F30",
    steps: 4,
    seconds: 180,
    notes: [
      "Start with the power to register, then show the two missing pieces.",
      "Keep the First Schedule detail for questions.",
      "Do not predict when appointments will be made.",
    ],
  },

  {
    id: "enforcement-chain",
    kind: "chain",
    block: B1,
    title: "What enforcement requires",
    intro: "Three things must be in place before the Act can be enforced against a business.",
    neutral: true,
    nodes: [
      {
        label: "An appointed DPBI",
        sub: "A Chairperson and Members appointed to the Data Protection Board of India",
        state: "absent",
      },
      {
        label: "A power to inquire",
        sub: "s.28, comes into force on 13 May 2027",
        state: "absent",
      },
      {
        label: "A power to impose penalties",
        sub: "s.33 and the Schedule, come into force on 13 May 2027",
        state: "absent",
      },
    ],
    verdict:
      "The powers to inquire and to impose penalties both come into force on 13 May 2027. That is the date to prepare for.",
    fact: "F18, F128, F129, F130",
    steps: 4,
    seconds: 240,
    notes: [
      "Walk it left to right. It answers the question rather than arguing with anyone.",
      "If challenged: some argue s.27(1)(d) operates without s.28. Even then no penalty can be imposed, because the amounts are set only in s.33 and the Schedule, and neither is in force.",
      "Close with the transition: since nothing is enforceable yet, the time is best spent on your own data, which is Block 2.",
    ],
  },

  {
    id: "example-company",
    kind: "company",
    block: B2,
    title: "The example company used in this session",
    company: "Apex Learning",
    what: "An Indian edtech company offering live tutoring, recorded classes and a marketplace of freelance tutors. It collects personal data from learners, parents and tutors, including children's data.",
    figures: [
      { n: "400,000", label: "learner accounts", note: "across the app and the website" },
      { n: "60,000", label: "of them under 18", note: "15 percent, a figure the company has never counted" },
      { n: "12", label: "systems holding personal data", note: "three with no assigned owner" },
      { n: "1", label: "processor outside India", note: "no contract in place" },
    ],
    why: "Apex Learning is an example company created for this session, based on situations we commonly see in Indian businesses. Apply each example to your own business as we go.",
    steps: 2,
    seconds: 180,
    notes: [
      "The type and volume of data matter more than the size of the company. Point that out.",
      "The systems with no owner and the processor with no contract come up again in later blocks.",
      "Ask which of these four numbers they could produce for their own business this week.",
    ],
  },

  {
    id: "example-estate",
    kind: "diagram",
    block: B2,
    title: "Where Apex Learning's personal data is stored",
    nodes: [
      { id: "app", label: "Learner app", sub: "400,000 accounts", x: 120, y: 250, w: 190 },
      { id: "mysql", label: "Primary database", sub: "name, email, DOB, phone", x: 410, y: 180, w: 205 },
      { id: "legacy", label: "Legacy database server", sub: "no assigned owner", x: 410, y: 360, w: 205, tone: "warn" },
      { id: "zoom", label: "Zoom cloud", sub: "recorded tutorials", x: 715, y: 150, w: 185 },
      { id: "crm", label: "CRM", sub: "sales notes, free text", x: 715, y: 285, w: 185 },
      { id: "sheet", label: "Ops spreadsheet", sub: "anyone with the link", x: 715, y: 420, w: 185, tone: "warn" },
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
      "Three of these seven are commonly missed: the server with no owner, the shared spreadsheet, and the vendor outside India.",
    fact: "F60, F62",
    steps: 4,
    seconds: 240,
    notes: [
      "Build it in front of them: the app, then the stores, then the places data is copied to.",
      "The legacy server with no owner is the most important item. Record unknown in every column, because unknown is the finding.",
      "Ask them to note which of their own systems has no owner.",
    ],
  },

  {
    id: "inventory-row",
    kind: "ledger",
    block: B2,
    title: "Recording your data inventory: three example rows",
    headers: ["Data element", "Where it is stored", "Lawful basis", "Retention period", "Shared with"],
    rows: [
      ["Learner date of birth", "Primary database", "Consent, s.6(1)", "Until the account is closed", "Analytics vendor"],
      ["Tutorial recordings", "Zoom cloud", "Consent, s.6(1)", "No period defined", "Nobody"],
      ["Support tickets", "CRM, free text", "Unknown", "Unknown", "Unknown"],
    ],
    scored: ["2,2", "2,3", "2,4"],
    verdict:
      "The third row is the most useful. Recording “Unknown” identifies a gap to investigate; a blank cell hides it.",
    fact: "F62",
    steps: 3,
    seconds: 180,
    notes: [
      "Do not leave cells blank. A blank reads as not started; unknown reads as investigated and not yet answered.",
      "The retention period is where most rows fail. No defined period is very common and worth saying out loud.",
    ],
  },

  {
    id: "children",
    kind: "proportion",
    block: B2,
    title: "Children's data needs separate attention",
    total: { n: "400,000", label: "learners" },
    subset: { n: "60,000", label: "under 18", count: 15 },
    dots: 100,
    consequence:
      "Processing their data requires verifiable parental consent under s.9, and tracking, behavioural monitoring and targeted advertising directed at children are prohibited.",
    fact: "F70, F71",
    steps: 2,
    seconds: 150,
    notes: [
      "Let the dots show before you say the number.",
      "Fifteen percent is not an edge case.",
      "Ask how many know their own count of users under 18. Very few do.",
    ],
  },

  {
    id: "notice-requirements",
    kind: "ledger",
    block: B3,
    title: "What a privacy notice must contain",
    headers: ["Requirement", "Source", "Common gap"],
    rows: [
      ["An itemised description of the personal data collected", "Rule 3(b)", "Usually a category, not an itemised list"],
      ["The specified purpose, itemised against the data", "Rule 3(b)", "Usually one paragraph covering everything"],
      ["The goods or services the processing enables", "Rule 3(b)", "Often missing"],
      ["How to withdraw consent, as easily as it was given", "s.6(4), Rule 3(c)", "Often harder than giving consent"],
      ["How to exercise rights, and how to complain to the DPBI", "s.5(1), Rule 3(c)", "Usually only an email address"],
    ],
    scored: ["0,2", "1,2", "2,2", "3,2", "4,2"],
    verdict:
      "These requirements come into force on 13 May 2027. Draft your notice now, so it is reviewed and ready before that date.",
    fact: "F31, F33",
    steps: 5,
    seconds: 210,
    notes: [
      "Read our own workbook notice against this list and invite them to find gaps.",
      "Itemised is the key word in Rule 3(b), and most published notices do not meet it.",
      "Say plainly that s.5 and Rule 3 are not yet in force and we follow them voluntarily. Claiming compliance with an obligation that has not come into force is the error Block 1 corrected.",
    ],
  },

  {
    id: "legacy-position",
    kind: "ledger",
    block: B3,
    title: "Personal data collected before the Act comes into force",
    headers: ["Approach", "What it means", "What to check"],
    rows: [
      ["Ask for consent again", "Request fresh consent under s.6", "Expect a low response rate and plan for it"],
      ["Rely on a legitimate use", "Process under one of the uses listed in s.7", "Narrower than most businesses assume. Record your reasoning"],
      ["Delete", "Erase the dataset", "Cannot be undone. Check minimum retention periods first"],
    ],
    verdict:
      "Choose one approach for each dataset and record the reason. Keeping the data without a decision is not an option; the deliverable is a register of those decisions.",
    fact: "F37, F38",
    steps: 3,
    seconds: 210,
    notes: [
      "These are alternatives, not steps. Each dataset gets one of them.",
      "The s.5(2) notice for data collected before commencement is unfamiliar to most people. Point it out.",
      "The register matters more than any single decision. A decision with recorded reasoning can be defended; no record cannot.",
    ],
  },

  {
    id: "rights-clocks",
    kind: "ledger",
    block: B4,
    title: "Four requests and their deadlines",
    headers: ["The request", "Type of request", "Deadline"],
    rows: [
      ["“Send me all my data”", "Access request, s.11", "No period set in the Act or Rules"],
      ["“My son is 15. Delete his account.”", "Erasure request by a parent, ss.9 and 12", "No period set in the Act or Rules"],
      ["“Delete everything, including my invoices”", "Erasure that conflicts with a retention duty", "Restricted in part by retention duties, including Rule 6(1)(e)"],
      ["“This is unacceptable. I want to complain.”", "Grievance, s.13", "The period you publish, up to 90 days"],
    ],
    scored: ["0,2", "1,2"],
    verdict:
      "The Act and Rules set no 30 day deadline for these requests. That figure comes from the GDPR.",
    fact: "F41, F42, F107",
    steps: 4,
    seconds: 240,
    notes: [
      "The 30 day figure appears on many vendor websites. It is not in the Act or the Rules.",
      "Rule 14(3) caps the grievance period you publish at ninety days. It limits your own commitment; it is not a deadline the Act sets for every request.",
      "Slow down on the erasure conflict: you may be required to keep a record you have been asked to delete.",
    ],
  },

  {
    id: "breach-rule-7",
    kind: "ledger",
    block: B5,
    title: "What Rule 7 requires after a personal data breach",
    headers: ["Who to notify", "When", "What to include"],
    rows: [
      ["Each affected Data Principal", "Without delay", "What happened, the likely consequences, what you have done, what they can do, and a contact person"],
      ["The DPBI: initial intimation", "Without delay", "A description of the breach, including its nature, extent, timing, location and likely impact"],
      ["The DPBI: detailed report", "Within 72 hours of becoming aware, or a longer period the DPBI allows", "Updated facts, the cause, the measures taken, and the notifications sent"],
    ],
    verdict:
      "Rule 7 comes into force on 13 May 2027. Set up your incident log now: the facts needed for the 72 hour report must be recorded from the first hour.",
    fact: "F48, F54",
    steps: 3,
    seconds: 240,
    notes: [
      "All three notifications run from the moment you become aware of the breach.",
      "Without delay is not a fixed number of hours. Do not convert it into one in your incident procedure.",
    ],
  },

  {
    id: "vendor-clauses",
    kind: "ledger",
    block: B5,
    title: "What your processor contracts must contain",
    headers: ["Clause", "Why it is needed", "Typical contract"],
    rows: [
      ["Process personal data only on your documented instructions", "s.8(2) requires a valid contract with every processor", "Usually present"],
      ["Notify you of a breach within a stated number of hours", "You cannot meet your own deadline if your processor misses theirs", "Usually vague"],
      ["List all sub-processors, and obtain your approval before adding a new one", "You cannot record data you cannot see", "Usually absent"],
      ["Return or delete all personal data when the contract ends", "Without it, you cannot show that your retention periods are followed", "Sometimes present"],
      ["Keep logs for a stated period", "Rule 6(1)(e) sets a minimum period of one year", "Usually absent"],
    ],
    scored: ["1,2", "2,2", "3,2", "4,2"],
    verdict:
      "Prioritise the breach notification period. Other clauses can be negotiated later; a missing notification period cannot be fixed during an incident.",
    fact: "F55, F58",
    steps: 5,
    seconds: 210,
    notes: [
      "Contracts signed now will still be in force in May 2027, which is why this is worth doing today.",
      "If a vendor will not commit to a notification period, that is itself the answer.",
    ],
  },

  {
    id: "ninety-day",
    kind: "lanes",
    block: B6,
    title: "The next ninety days",
    lanes: [
      { area: "Inventory", now: "Rows started today", day30: "Every system listed, owners assigned", day90: "Unknowns resolved or escalated" },
      { area: "Notice", now: "Checklist scored", day30: "Draft written in compliance with Rule 3", day90: "Reviewed and ready to publish" },
      { area: "Existing data", now: "Register started", day30: "A decision recorded per dataset", day90: "Decisions carried out" },
      { area: "Requests", now: "Process outlined", day30: "One named owner, one inbox", day90: "Tested with a real request" },
      { area: "Breach", now: "Rule 7 steps understood", day30: "Incident procedure written", day90: "Rehearsed once" },
      { area: "Vendors", now: "Gaps identified", day30: "New contract template agreed", day90: "Top five contracts renegotiated" },
    ],
    verdict:
      "None of this depends on the DPBI being appointed or on May 2027. All of it is within your control.",
    fact: "F150",
    steps: 2,
    seconds: 240,
    notes: [
      "Leave this slide up while they complete the scorecard.",
      "The last column is deliberately not complete. Ninety days does not finish this work, and a plan that pretends otherwise gets abandoned.",
    ],
  },

  {
    id: "close",
    kind: "cover",
    block: "",
    eyebrow: "Before you go",
    title: "What you are leaving with",
    lead: "Organisations that start now will be ready when most obligations come into force on 13 May 2027. None of this work depends on the DPBI being appointed.",
    dates: [
      { date: "Today", what: "Download your workbook before closing this tab" },
      { date: "Next 90 days", what: "Carry out your action plan" },
      { date: "13 May 2027", what: "Most obligations come into force", main: true },
    ],
    outcomes: [
      "Complete your data inventory first. Notices, requests and breach response all depend on it",
      "Review your processor contract template now. Contracts signed this quarter will still apply in May 2027",
      "Organisations intending to register as Consent Managers should prepare for 13 November 2026",
      "For questions after the session, contact founder@theprivacylabs.com",
    ],
    meta: "Nakendraprasath K and Olivia Daniel · Privacy Labs",
    steps: 3,
    seconds: 240,
    notes: [
      "Point to the download button first. This is the last moment their work can be saved.",
      "Summarise what they now hold and what it is for, not the Act.",
      "Take the remaining questions here, so the session ends on an answer rather than a slide.",
    ],
  }
];

export function slideLabel(slide: Slide): string {
  return slide.title;
}
