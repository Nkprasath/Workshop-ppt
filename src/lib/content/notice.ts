// The notice shown on the entry screen, before anyone types anything.
//
// Two constraints that must not be edited away:
//
//  1. Section 5 and Rule 3 come into force on 13 May 2027. The notice says we follow them
//     voluntarily; it must not claim we are already under the obligation.
//
//  2. Every factual statement in here about what we do has to be true of the code. If you
//     change the retention period, the purge job, the encryption, or the sharing default,
//     change this text in the same commit.
//
// Kept short on purpose: attendees read it in under a minute.

export interface NoticeBlock {
  heading: string;
  paragraphs: string[];
  // Requirement this block answers, rendered as a small label beside the heading.
  satisfies?: string;
  // Bulleted items, where a list is clearer than prose.
  items?: string[];
}

export const NOTICE_VERSION = "2026-10-11.1";

export const GRIEVANCE_CONTACT = {
  name: "Nakendraprasath K",
  role: "Founder, Privacy Labs",
  email: process.env.WORKBOOK_GRIEVANCE_EMAIL ?? "founder@theprivacylabs.com",
};

export const RETENTION_DAYS = Number(process.env.WORKBOOK_RETENTION_DAYS ?? 30);

export const NOTICE_INTRO = [
  "Privacy Labs collects a small amount of personal data to run your workbook. The DPDP notice requirements come into force on 13 May 2027; we follow them now.",
];

export const NOTICE_BLOCKS: NoticeBlock[] = [
  {
    heading: "What we collect",
    items: [
      "Your email address, from your registration. It is how you sign in.",
      "Your company name, if you gave it at registration.",
      "The answers you type into the workbook.",
    ],
    paragraphs: [],
  },
  {
    heading: "Why",
    items: [
      "To save your answers so you can return to them and download them.",
      "To show the facilitators how many fields each person has filled, so we know when to move on. They see a count, not your answers.",
    ],
    paragraphs: [],
  },
  {
    heading: "Who can see your answers",
    paragraphs: [
      "Only you. Your answers are encrypted before they are stored. If you want the facilitators to read them, you can switch that on in Settings; it is off by default.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      `${RETENTION_DAYS} days after the workshop, after which it is deleted automatically. You can also delete everything yourself at any time from Settings.`,
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      `Download your data, correct it or delete it from the workbook at any time. For questions or complaints, contact ${GRIEVANCE_CONTACT.name} at ${GRIEVANCE_CONTACT.email}; we will respond within 7 days. The Data Protection Board of India has not yet been constituted and has no published complaints process.`,
    ],
  },
  {
    heading: "Optional",
    paragraphs: [
      "Using the workbook is optional. You can download a blank copy from this page and take notes offline instead.",
    ],
  },
];

// Shown next to the checkbox on the entry screen. Deliberately short, because a consent
// statement nobody reads is not consent. s.6(1) requires free, specific, informed,
// unconditional and unambiguous.
export const ENTRY_CONSENT_LABEL =
  "I have read the notice above. Save my answers to this workbook so I can come back to them and download them.";

export const SHARING_OPT_IN_LABEL =
  "Let the facilitators read my answers, so they can use them in the follow-up review. Off by default. You can turn it off at any time.";
