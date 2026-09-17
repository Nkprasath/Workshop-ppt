// The notice shown on the entry screen, before anyone types anything.
//
// This is a worked example that gets read aloud and argued with during Block 4, so it is
// written to survive that. Each block carries the requirement it answers, and those labels
// are rendered on the page rather than hidden in a comment, because the point of showing it
// is to show the mapping.
//
// Two honesty constraints that must not be edited away:
//
//  1. Section 5 and Rule 3 commence on 13 May 2027. We are not under this obligation yet.
//     The notice says so. Claiming to be complying with an obligation that is not in force
//     would be exactly the error the workshop spends Block 1 correcting.
//
//  2. Every factual statement in here about what we do has to be true of the code. If you
//     change the retention period, the purge job, the encryption, or the sharing default,
//     change this text in the same commit.

export interface NoticeBlock {
  heading: string;
  paragraphs: string[];
  // Requirement this block answers, rendered as a small label beside the heading.
  satisfies?: string;
  // Bulleted items, where a list is clearer than prose.
  items?: string[];
}

export const NOTICE_VERSION = "2026-09-26.1";

export const GRIEVANCE_CONTACT = {
  name: "Prasath N",
  role: "Founder, Privacy Labs, and the person answering these for this workshop",
  email: process.env.WORKBOOK_GRIEVANCE_EMAIL ?? "privacy@theprivacylabs.com",
};

export const RETENTION_DAYS = Number(process.env.WORKBOOK_RETENTION_DAYS ?? 30);

export const NOTICE_INTRO = [
  "This page collects personal data from you, so it starts with a notice. The workshop spends an hour on what a notice has to contain, and it would be a poor look to run that session behind a privacy policy link.",
  "Section 5 of the DPDP Act and Rule 3 of the DPDP Rules commence on 13 May 2027. We are not under that obligation today. This notice is written to meet it anyway, because it is the example we are going to pick apart together in Block 4, and because you should be able to hold us to the same standard we are about to describe.",
];

export const NOTICE_BLOCKS: NoticeBlock[] = [
  {
    heading: "Who is collecting this",
    satisfies: "Rule 9, published contact point",
    paragraphs: [
      `Privacy Labs, for the DPDP Implementation Workshop on 26 September 2026. The person responsible for answering questions about this processing, and the person you complain to if we get it wrong, is ${GRIEVANCE_CONTACT.name}, at ${GRIEVANCE_CONTACT.email}. That is a monitored address and a real person, not a shared inbox that routes to nobody.`,
    ],
  },
  {
    heading: "What we collect, itemised",
    satisfies: "Rule 3(b)(i), itemised description",
    paragraphs: [
      "Three things, and nothing else:",
    ],
    items: [
      "Your email address, which you gave us at registration. It is the only way into your workbook, because there is no password.",
      "Your company name, if you gave us one at registration. It is optional and the workbook works without it.",
      "Whatever you type into the workbook fields during the day. That is the only content we hold.",
    ],
  },
  {
    heading: "What we do not collect",
    paragraphs: [
      "There is no analytics on this page. No Google Analytics, no Mixpanel, no Meta pixel, no session recorder, no heatmap tool, no third party script of any kind. Your browser makes requests to this app and to nothing else. You can confirm that in your network tab, and during Block 4 we will.",
      "We do not log your IP address against your answers, and we do not track which sections you looked at.",
    ],
  },
  {
    heading: "Why we collect it, and what each purpose enables",
    satisfies: "Rule 3(b)(ii), specified purpose with a specific description",
    paragraphs: ["Two purposes. They are separate and they are treated differently."],
    items: [
      "To give you a workbook that saves as you type and that you can download at the end, on any device, including after you close your laptop at lunch. This needs your email address and your answers.",
      "To let the two facilitators see how far the room has got, so that we end a ten minute fill period when people are done rather than when a timer says so. This needs a count of how many fields you have filled, and it does not need to know what you wrote.",
    ],
  },
  {
    heading: "Who can see what you type",
    satisfies: "The distinction between a count and content",
    paragraphs: [
      "By default, only you. Your answers are encrypted before they are stored, and the facilitators cannot read them.",
      "What the facilitators can see by default is a number: how many fields you have filled in each section. That is a count and not content, and it is what the completion percentage on our screen is built from. We think that distinction is defensible and we would rather state it plainly than bury it.",
      "If you want us to see your actual answers, so that we can use them in the follow up review or answer a question about your specific situation, there is a checkbox in your workbook settings. It is off. Nothing in this app turns it on except you clicking it, and you can turn it back off at any time.",
    ],
  },
  {
    heading: "How long we keep it",
    satisfies: "Retention period, stated and implemented",
    paragraphs: [
      `${RETENTION_DAYS} days after the workshop. On that date a scheduled job deletes your row, including your email address, your answers and your completion counts. This is not a promise in a policy. It is a job that runs against a purge_after column, and you can ask us to show you the code.`,
      "We keep one thing longer, and you should know about it: an entry in a handling log recording that an account existed and was deleted, with no email address and no answer content in it. That is how we can tell you, later, that your deletion actually happened.",
    ],
  },
  {
    heading: "Where it is stored, and how",
    paragraphs: [
      "In a Postgres database, in a single region. Your answers are encrypted with AES-256-GCM before they are written, and the key is held in the application environment rather than in the database, so a database dump on its own does not yield your content.",
      "The link that gets you in is single use and short lived, and we store only a hash of it, so somebody reading our database cannot log in as you.",
    ],
  },
  {
    heading: "Your rights, and how to use them",
    satisfies: "s.5(1)(ii), the manner of exercising rights",
    paragraphs: [
      "You do not have to email anyone to exercise most of these. They are buttons.",
    ],
    items: [
      "See what we hold: the Download button in your workbook gives you everything we have on you, as a spreadsheet or a PDF, at any time, including before you have filled anything in.",
      "Correct it: every field is editable until the data is purged.",
      "Delete it: the Delete everything button in your workbook settings removes your row immediately and shows you a confirmation. It is not a request that goes into a queue.",
      `Complain: ${GRIEVANCE_CONTACT.email}. We will respond within 7 days. That is our own commitment. Rule 14(3) caps a published grievance period at ninety days and we are not going to use ninety days for a one day workshop.`,
      "Withdraw: deleting your data is how you withdraw here, and it is one click, which is the same number of clicks it took to get in.",
    ],
  },
  {
    heading: "Complaining to the Data Protection Board",
    satisfies: "s.5(1)(iii), the manner of complaining to the Board",
    paragraphs: [
      "A real Section 5 notice has to tell you how to complain to the Board. Here is the honest version, and it is one of the things Block 1 is about.",
      "The Board is established in law under sections 18 to 26, which commenced on 13 November 2025. As of the date on this notice it has no appointed Chairperson and no appointed Members, and we could not find a published complaints route. Section 13, which is the provision requiring you to exhaust our own grievance process before approaching the Board, commences on 13 May 2027.",
      "So there is currently no DPDP escalation route: the right to go to the Board is not yet in force, and the Board is not yet operational. That is narrower than saying you have no recourse at all. Other law that applies to us today is unaffected by any of this, and nothing here limits whatever rights you have under it. When the Board is constituted and publishes a route, this notice will say what it is.",
    ],
  },
  {
    heading: "If you would rather not",
    paragraphs: [
      "The workbook is genuinely optional. You can attend the whole day, take notes on paper, and download the blank workbook as a spreadsheet from the entry screen without giving us anything. The Download button works before you log in and before you have filled in a single field.",
      "Nothing about the session is gated on using this app.",
    ],
  },
];

// Shown next to the checkbox on the entry screen. Deliberately short, because a consent
// statement nobody reads is not consent. s.6(1) requires free, specific, informed,
// unconditional and unambiguous.
export const ENTRY_CONSENT_LABEL =
  "I have read the notice above. Save my answers to this workbook so I can come back to them and download them.";

export const SHARING_OPT_IN_LABEL =
  "Let the two facilitators read what I have written, so they can use it in the follow up review. Off by default. You can change this at any time, and turning it off stops future access.";
