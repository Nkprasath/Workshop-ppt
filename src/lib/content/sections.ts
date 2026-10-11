import type { Section } from "./types";

// The seven sections of the workbook.
//
// Every legal claim in here carries a citation and a fact ID from facts/dpdp-facts.md.
// If you change a claim, change the fact first and then change it here, so the two do not
// drift apart. Nothing in this file states a legal position that is not in that file.
//
// Block 1 of the day has no workbook section. Sections 4 and 5 use general examples
// rather than Apex Learning.

// Block labels match the deck, so the room sees the same names on both.
const B2 = "Block 2 · Your personal data";
const B3 = "Block 3 · Notice and existing data";
const B4 = "Block 4 · Data Principal requests";
const B5 = "Block 5 · Breaches and vendors";
const B6 = "Block 6 · Your action plan";

// Plain-language meaning of every provision the workbook cites. Each section opens with a
// collapsed panel listing the ones it uses, so a number is never left unexplained.
const RULES: Record<string, string> = {
  "s.5(1)": "A notice must come with or before every request for consent, saying what data is collected, why, how to exercise rights and how to complain.",
  "s.5(2)": "Where consent was given before the Act comes into force, you must send a notice as soon as reasonably practicable. You may keep processing until consent is withdrawn.",
  "s.5(3)": "People must be able to read the notice in English or any of the 22 Eighth Schedule languages, at their choice.",
  "s.6(1)": "Consent must be free, specific, informed, unconditional and unambiguous, and cover only the data needed for the purpose.",
  "s.6(4)": "People can withdraw consent at any time, as easily as they gave it.",
  "s.6(7)": "People can give, manage and withdraw consent through a registered Consent Manager.",
  "s.6(10)": "If challenged, you must be able to prove that notice was given and consent obtained.",
  "s.7": "Legitimate uses where consent is not needed, such as (a) data a person gave you voluntarily for a purpose, and (i) employment.",
  "s.8(1)": "You are responsible for processing done on your behalf, including by your processors.",
  "s.8(2)": "You may use a Data Processor only under a valid contract.",
  "s.8(7)": "You must erase data once consent is withdrawn or the purpose is served, and make your processors erase it too.",
  "s.9": "Children's data needs verifiable parental consent. Tracking, behavioural monitoring and targeted advertising directed at children are prohibited (s.9(3)).",
  "s.11": "Right of access: a summary of the data held, and who it was shared with (s.11(1)(b)).",
  "s.12": "Right to correction and erasure. Erasure can be refused only where the data is needed for its purpose or by law (s.12(3)).",
  "s.13": "Right to grievance redressal. A person must use your grievance process before going to the DPBI (s.13(3)).",
  "s.15": "Duties of Data Principals, including not filing false or frivolous complaints.",
  "s.16": "Transfers outside India are allowed, except to countries the government restricts.",
  "Rule 3": "What a notice must contain: understandable on its own (3(a)), an itemised list of data and purposes (3(b)), and links to withdraw consent, exercise rights and complain (3(c)).",
  "Rule 6": "Reasonable security safeguards, including keeping logs for one year (6(1)(e)) and security terms in processor contracts (6(1)(f)).",
  "Rule 7": "After a breach: notify affected people and the DPBI without delay, then send the DPBI a detailed report within 72 hours.",
  "Rule 8": "Retention and erasure. Personal data and logs must be kept for at least one year (8(3)).",
  "Rule 9": "Publish the contact details of your DPO, or of a person who can answer questions about your processing.",
  "Rule 10": "How to verify that a parent giving consent for a child is an identifiable adult.",
  "Rule 14": "How requests are made and answered: publish how to make a request and the identifier you need (14(1)), and a grievance response period of at most 90 days (14(3)).",
  "Rule 15": "Conditions for transferring personal data outside India.",
};

function rulesPart(keys: string[]): Section["parts"][number] {
  return {
    id: "rules",
    title: "Rules mentioned in this section",
    collapsed: true,
    body: {
      kind: "reference",
      table: {
        headers: ["Rule", "What it means"],
        rows: keys.map((k) => [k, RULES[k]]),
      },
    },
  };
}

const APEX_INVENTORY: Record<string, string>[] = [
  {
    dataElement: "Learner name and email",
    whereItLives: "Primary MySQL database, AWS RDS, ap-south-1",
    whyWeCollect: "Account creation, login, service email",
    whoHasAccess: "Engineering, Support",
    vendor: "AWS as infrastructure processor",
    retention: "No retention period has been set",
    basis: "Consent, s.6(1)",
    notes: "About 60,000 of these accounts belong to users under 18.",
  },
  {
    dataElement: "Learner date of birth",
    whereItLives: "Primary MySQL database",
    whyWeCollect: "Age verification, class allocation",
    whoHasAccess: "Engineering, Support",
    vendor: "AWS",
    retention: "No retention period has been set",
    basis: "Consent, s.6(1)",
    notes:
      "This field identifies the 60,000 users under 18. Check that it is collected, not inferred from grade level.",
  },
  {
    dataElement: "Learner and parent phone numbers",
    whereItLives: "Primary MySQL database, also copied into the WhatsApp Business API",
    whyWeCollect: "Class reminders, and marketing",
    whoHasAccess: "Growth, Support",
    vendor: "Meta, plus our WhatsApp service provider",
    retention: "No retention period has been set",
    basis:
      "Reminders may fall under s.7(a). Marketing needs consent, s.6(1).",
    notes:
      "Two purposes for one number. If consent for marketing is withdrawn, the reminders must keep working.",
  },
  {
    dataElement: "Tutor PAN",
    whereItLives: "S3 bucket, apex-kyc",
    whyWeCollect: "Tutor onboarding, payouts, TDS",
    whoHasAccess: "Ops, Finance",
    vendor: "AWS",
    retention: "No retention period has been set",
    basis: "Legal obligation for tax records",
    notes: "Bucket permissions have never been reviewed.",
  },
  {
    dataElement: "Tutor Aadhaar",
    whereItLives: "Same S3 bucket",
    whyWeCollect: "Identity verification at onboarding",
    whoHasAccess: "Ops, Finance",
    vendor: "AWS",
    retention: "No retention period has been set",
    basis: "Consent. Aadhaar is also governed by its own law.",
    notes:
      "Decide whether the document must be kept after verification, or only a record that verification was done.",
  },
  {
    dataElement: "Live session recordings, video and audio",
    whereItLives: "Zoom cloud",
    whyWeCollect: "Quality review, dispute resolution",
    whoHasAccess: "Ops, and any tutor with the share link",
    vendor: "Zoom",
    retention: "No retention period has been set",
    basis: "Consent, s.6(1)",
    notes:
      "Children appear in these recordings. Check whether quality scoring of a child's session is behavioural monitoring under s.9(3).",
  },
  {
    dataElement: "Session chat transcripts",
    whereItLives: "Zoom cloud",
    whyWeCollect: "Dispute resolution",
    whoHasAccess: "Ops",
    vendor: "Zoom",
    retention: "No retention period has been set",
    basis: "Consent",
    notes: "The same question about children applies as for the recordings.",
  },
  {
    dataElement: "Product analytics events",
    whereItLives: "Mixpanel",
    whyWeCollect: "Product improvement, funnel analysis",
    whoHasAccess: "Product, Growth",
    vendor: "Mixpanel",
    retention: "The Mixpanel default, which has not been checked",
    basis: "Consent",
    notes:
      "Events are recorded for accounts of users under 18 as well. s.9(3) prohibits tracking and behavioural monitoring of children.",
  },
  {
    dataElement: "Marketing and CRM records",
    whereItLives: "HubSpot",
    whyWeCollect: "Outbound, lifecycle email, school partnerships",
    whoHasAccess: "Growth, Sales",
    vendor: "HubSpot",
    retention: "No retention period has been set",
    basis: "Consent",
    notes: "Includes parents and school staff as well as learners.",
  },
  {
    dataElement: "Learner performance extracts",
    whereItLives: "Analytics vendor, hosted in Singapore",
    whyWeCollect: "Cohort reporting for school partners",
    whoHasAccess: "Data team, and the vendor's staff",
    vendor: "The Singapore analytics vendor",
    retention: "Unknown. Held by the vendor.",
    basis: "Consent",
    notes:
      "Cross-border transfer. It is permitted unless the destination is restricted, and none is, but there is no processor contract with this vendor.",
  },
  {
    dataElement: "Refund requests: names, phone numbers, partial card digits",
    whereItLives: "A Google Sheet on the ops shared drive",
    whyWeCollect: "Processing refunds",
    whoHasAccess: "Ops team, and anyone with the link",
    vendor: "Google",
    retention: "No retention period has been set",
    basis: "s.7(a), the service the person asked for",
    notes: "Sharing is set to anyone with the link.",
  },
  {
    dataElement: "Support tickets and attachments",
    whereItLives: "Freshdesk",
    whyWeCollect: "Customer support",
    whoHasAccess: "Support",
    vendor: "Freshdesk",
    retention: "No retention period has been set",
    basis: "s.7(a)",
    notes:
      "Often left off the list. Users attach ID documents to tickets without being asked.",
  },
  {
    dataElement: "User records from the 2019 acquisition",
    whereItLives: "A MySQL instance on an EC2 server with no current owner",
    whyWeCollect: "Unknown",
    whoHasAccess: "Unknown. Credentials are in an old password vault.",
    vendor: "Self hosted",
    retention: "Unknown",
    basis: "Unknown",
    notes:
      "It is not known what notice these people were given, whether they are still users, or whether the server is patched. Record Unknown in every column; that is the finding.",
  },
  {
    dataElement: "Merchandise shipping addresses",
    whereItLives: "Shopify",
    whyWeCollect: "Order fulfilment",
    whoHasAccess: "Ops",
    vendor: "Shopify",
    retention: "No retention period has been set",
    basis: "s.7(a)",
    notes: "Low volume, which is why it is often left off the list.",
  },
  {
    dataElement: "Employee and contractor records",
    whereItLives: "Payroll provider, plus an HR folder on Google Drive",
    whyWeCollect: "Employment, payroll, statutory filings",
    whoHasAccess: "HR, Finance",
    vendor: "Payroll provider",
    retention: "As required by tax and labour law",
    basis: "s.7(i), employment purposes",
    notes:
      "Employee data is covered by the Act. Most of this processing needs no consent, but every other obligation still applies.",
  },
];

export const SECTIONS: Section[] = [
  // ----------------------------------------------------------------------------- 1
  {
    id: "inventory",
    title: "Data inventory",
    block: B2,
    intro:
      "Record every place your business stores personal data. Every other section depends on this one.",
    parts: [
      rulesPart(["s.6(1)", "s.7", "s.9", "s.16"]),
      {
        id: "rows",
        title: "Your inventory",
        guidance:
          "One row per place personal data is stored, including spreadsheets, inboxes and old servers. Write Unknown if you are not sure.",
        body: {
          kind: "table",
          starterRows: 8,
          columns: [
            { key: "dataElement", label: "Data element", type: "text", width: 30 },
            { key: "whereItLives", label: "Where it is stored", type: "text", width: 30 },
            { key: "whyWeCollect", label: "Why we collect it", type: "text", width: 26 },
            { key: "whoHasAccess", label: "Who has access", type: "text", width: 22 },
            { key: "vendor", label: "Vendor or processor", type: "text", width: 22 },
            { key: "retention", label: "Retention period", type: "text", width: 22 },
            {
              key: "basis",
              label: "Lawful basis",
              type: "choice",
              options: [
                "",
                "Consent, s.6(1)",
                "Voluntarily provided, s.7(a)",
                "Employment, s.7(i)",
                "Other legitimate use, s.7",
                "Legal obligation",
                "Unknown",
              ],
              width: 24,
            },
            { key: "notes", label: "Notes", type: "longtext", width: 40 },
          ],
          example: APEX_INVENTORY,
        },
      },
      {
        id: "prompts",
        title: "Places that are often missed",
        collapsed: true,
        body: {
          kind: "reference",
          paragraphs: [
            "Check this list before you consider your inventory complete.",
          ],
          table: {
            headers: ["Where", "What it often contains"],
            rows: [
              ["Shared drives and team spreadsheets", "Refunds, escalations, candidate lists and other working files"],
              ["Support tools", "ID documents that users attached without being asked"],
              ["Call and meeting recordings", "Everything said, kept by default and rarely reviewed"],
              ["Analytics and product tools", "Event data that does not separate adult and child accounts"],
              ["Marketing tools", "Lists imported years ago from unrecorded sources"],
              ["Systems from an acquisition", "Records collected under a notice you have not seen"],
              ["Personal inboxes and devices", "CVs, invoices and ID copies forwarded once and never deleted"],
              ["Backups and snapshots", "All of the above, with a separate retention period"],
            ],
          },
        },
      },
    ],
  },

  // ----------------------------------------------------------------------------- 2
  {
    id: "notice",
    title: "Notice checklist",
    block: B3,
    intro:
      "Check your current privacy notice against each requirement below.",
    parts: [
      rulesPart(["s.5(1)", "s.5(3)", "s.6(1)", "s.6(4)", "s.6(10)", "Rule 3", "Rule 9", "Rule 14"]),
      {
        id: "checklist",
        title: "Against our current notice",
        guidance:
          "For each item, paste the sentence from your notice that meets it, or note what is missing.",
        body: {
          kind: "checklist",
          statusOptions: ["", "Yes", "Partial", "No", "Unknown"],
          evidenceLabel: "Evidence, or what is missing",
          items: [
            {
              key: "accompanies",
              requirement:
                "A notice accompanies or precedes every request for consent",
              citation: "s.5(1)",
              fact: "F25",
            },
            {
              key: "itemised",
              requirement:
                "The notice gives an itemised description of the personal data. A category label such as usage data does not meet this",
              citation: "Rule 3(b)(i)",
              fact: "F28",
            },
            {
              key: "purpose",
              requirement:
                "The notice states the specified purpose, with a specific description of the goods or services provided or the uses enabled",
              citation: "Rule 3(b)(ii)",
              fact: "F28",
            },
            {
              key: "rightsManner",
              requirement:
                "The notice explains how to withdraw consent under s.6(4) and how to raise a grievance under s.13",
              citation: "s.5(1)(ii)",
              fact: "F25",
            },
            {
              key: "complaintManner",
              requirement:
                "The notice explains how to make a complaint to the DPBI",
              citation: "s.5(1)(iii)",
              fact: "F25",
            },
            {
              key: "standalone",
              requirement:
                "The notice can be understood on its own, independently of any other document. A notice inside the terms of service does not meet this",
              citation: "Rule 3(a)",
              fact: "F27",
            },
            {
              key: "linkWithdraw",
              requirement:
                "The notice gives the specific link for withdrawing consent",
              citation: "Rule 3(c)(i)",
              fact: "F29",
            },
            {
              key: "withdrawEase",
              requirement:
                "Withdrawing consent is as easy as giving it",
              citation: "Rule 3(c)(i)",
              fact: "F29",
            },
            {
              key: "linkRights",
              requirement:
                "The notice gives the specific link for exercising rights",
              citation: "Rule 3(c)(ii)",
              fact: "F29",
            },
            {
              key: "linkComplaint",
              requirement:
                "The notice gives the specific link for complaining to the DPBI",
              citation: "Rule 3(c)(iii)",
              fact: "F29",
            },
            {
              key: "language",
              requirement:
                "The person can choose to read the notice in English or in any language in the Eighth Schedule. This is an option offered, not 22 translations published",
              citation: "s.5(3)",
              fact: "F26",
            },
            {
              key: "contactPublished",
              requirement:
                "Contact details of the DPO, or of a person who can answer questions about the processing, are prominently published on the website or app",
              citation: "Rule 9",
              fact: "F31",
            },
            {
              key: "contactInResponses",
              requirement:
                "The same contact details appear in every response to a request from a Data Principal",
              citation: "Rule 9",
              fact: "F31",
            },
            {
              key: "requestMeans",
              requirement:
                "How to make a request is prominently published",
              citation: "Rule 14(1)(a)",
              fact: "F32",
            },
            {
              key: "identifier",
              requirement:
                "The identifier you will require to identify a requester is published in advance",
              citation: "Rule 14(1)(b), and 14(5) for what counts",
              fact: "F44",
            },
            {
              key: "grievancePeriod",
              requirement:
                "The period within which you will respond to grievances is published, and it is not more than 90 days",
              citation: "Rule 14(3)",
              fact: "F41",
            },
            {
              key: "necessary",
              requirement:
                "Consent is sought only for personal data that is necessary for the specified purpose",
              citation: "s.6(1)",
              fact: "F33",
            },
            {
              key: "provable",
              requirement:
                "If asked, you can prove that notice was given and that consent was given. This is a record-keeping requirement, and it is the one most often not met",
              citation: "s.6(10)",
              fact: "F30",
            },
          ],
        },
      },
      {
        id: "timing",
        title: "When this applies",
        body: {
          kind: "reference",
          points: [
            "These requirements come into force on **13 May 2027**. Nothing here is overdue today.",
            "Start now: from that date you must be able to **prove consent** for the data you hold (s.6(10)), and that proof cannot be created later.",
            "Quick win: publish a **contact for privacy questions** on your website (Rule 9).",
          ],
        },
      },
    ],
  },

  // ----------------------------------------------------------------------------- 3
  {
    id: "legacy",
    title: "Data collected before the Act",
    block: B3,
    intro:
      "Record a decision for each dataset you collected before the Act comes into force.",
    parts: [
      {
        id: "unsettled",
        title: "Before you start",
        body: {
          kind: "reference",
          points: [
            "**Section 5(2):** if people gave consent before the Act comes into force, you can keep using their data, as long as you send them a notice as soon as reasonably practicable.",
            "The Act does not say whether weaker consent counts, such as pre-ticked boxes, bundled terms or purchased lists.",
            "For each dataset below, record your decision and the reason for it.",
            "This comes into force on 13 May 2027.",
          ],
        },
      },
      {
        id: "register",
        title: "Our existing datasets",
        guidance:
          "One row per dataset collected before your current notice.",
        body: {
          kind: "table",
          starterRows: 5,
          columns: [
            { key: "dataset", label: "Dataset", type: "text", width: 28 },
            { key: "collected", label: "When it was collected", type: "text", width: 20 },
            {
              key: "underWhat",
              label: "Notice it was collected under",
              type: "longtext",
              width: 34,
            },
            {
              key: "evidence",
              label: "Evidence of consent we hold",
              type: "longtext",
              width: 30,
            },
            {
              key: "toKeepUsing",
              label: "What continued use would require",
              type: "longtext",
              width: 34,
            },
            {
              key: "decision",
              label: "Our decision",
              type: "choice",
              options: [
                "",
                "Send these people a notice and keep using the data",
                "Ask for consent again before further use",
                "Stop using it, and delete or isolate it",
                "Not decided yet",
              ],
              width: 40,
            },
            { key: "owner", label: "Owner", type: "text", width: 18 },
          ],
          example: [
            {
              dataset: "User records from the 2019 acquisition, on the server with no owner",
              collected: "Before 2019, exact dates unknown",
              underWhat:
                "Unknown. The acquired company's privacy policy has not been found.",
              evidence:
                "None. No consent log, no timestamps, no record of what was shown at signup.",
              toKeepUsing:
                "Establish whether these people are still users. If they are, sending them a notice needs a working email address for each of them.",
              decision: "Not decided yet",
              owner: "CTO, with Legal",
            },
            {
              dataset: "HubSpot marketing list, imported 2021",
              collected: "2021, from several sources",
              underWhat:
                "Partly signup consent, partly a purchased list, partly event badge scans, combined in one list with no source field.",
              evidence: "The source field is empty for about 40 percent of records.",
              toKeepUsing:
                "Separate the records by source first. The signup records can be kept with a notice. The purchased records were never collected with consent, so a notice does not cover them.",
              decision: "Stop using it, and delete or isolate it",
              owner: "Head of Growth",
            },
          ],
        },
      },
    ],
  },

  // ----------------------------------------------------------------------------- 4
  {
    id: "rights",
    title: "Request handling process",
    block: B4,
    intro:
      "A one-page process your support team can follow for every request.",
    parts: [
      rulesPart(["s.9", "s.11", "s.12", "s.13", "s.15", "Rule 6", "Rule 8", "Rule 10", "Rule 14"]),
      {
        id: "sop",
        title: "Our process",
        body: {
          kind: "form",
          fields: [
            {
              key: "channels",
              label: "Where a request can arrive",
              type: "longtext",
              hint: "List every channel, including ones you do not intend to support. People will not always use the channel you publish.",
              example:
                "Published form, the DPO email address, any support ticket, a reply to a marketing email, a WhatsApp message to the ops number, a legal notice by post.",
            },
            {
              key: "ask",
              label: "What we ask for when a request comes in",
              type: "longtext",
              hint: "Publish in advance the identifier you will ask for, such as a username, customer ID, email or mobile number (Rule 14).",
              example:
                "The registered email or mobile number on the account, and which right they are exercising. Nothing else at this stage.",
            },
            {
              key: "verification",
              label: "How we verify identity",
              type: "longtext",
              hint: "Verify enough to avoid disclosing data to the wrong person, without collecting new identity documents that you would then have to protect.",
              example:
                "A confirmation code sent to the registered contact on file. We do not ask for ID documents, because holding copies of them creates more risk than it removes.",
            },
            {
              key: "owner",
              label: "Who owns it, by name and role",
              type: "text",
              example: "Named DPO, with Support as first line and Engineering responsible for data extracts.",
            },
            {
              key: "sla",
              label: "The response period we publish",
              type: "text",
              hint: "Your published grievance period can be at most 90 days (Rule 14). The Act sets no period for other requests. Publish only what you can meet.",
              example: "30 days for requests, as our own policy. 30 days published for grievances, within the 90 day limit.",
            },
            {
              key: "log",
              label: "Where the request and our response are recorded",
              type: "longtext",
              hint: "Without a record of the request and your response, you cannot show that you complied.",
              example: "A ticket in the helpdesk, tagged dpdp-request, with the response attached.",
            },
            {
              key: "refusal",
              label: "What a refusal looks like, and who approves it",
              type: "longtext",
              hint: "You may refuse erasure only if you must keep the data for its purpose or by law (s.12). State the reason.",
              example:
                "In writing, stating which ground is relied on and the law or purpose involved, with the contact point for challenge, approved by the DPO.",
            },
            {
              key: "escalation",
              label: "When a request is escalated beyond support",
              type: "longtext",
              example:
                "Anything involving a child, anything from a lawyer, anything alleging a breach, and anything we intend to refuse.",
            },
          ],
        },
      },
      {
        id: "tickets",
        title: "Four example requests. Apply your process to each",
        guidance:
          "For each request, note what your process above would do.",
        body: {
          kind: "reference",
          cards: [
            {
              title: "Request 1. An unclear request",
              lines: [
                { label: "Arrives as", value: "Email to support, no account details" },
                {
                  label: "Text",
                  value:
                    "\"Under the new data law please send me all my data and delete everything you have on me. I have used your service since 2021.\"",
                },
                {
                  label: "Sender",
                  value: "An email address that does not match any account",
                },
                {
                  label: "The issue",
                  value:
                    "Two rights in one request, access under s.11 and erasure under s.12, and they conflict. Identity is not verified: the address may be mistyped, a work address, a closed account or someone else.",
                },
                {
                  label: "A good response",
                  value:
                    "One reply that asks for the identifier you published under Rule 14(1)(b), treats the two requests separately, and commits to no timeline you cannot meet. Do not ask for ID documents.",
                },
              ],
            },
            {
              title: "Request 2. A parent",
              lines: [
                { label: "Arrives as", value: "Phone call to support, followed by email" },
                {
                  label: "Text",
                  value:
                    "\"My daughter is 15 and has an account with you. I want to see everything you hold on her and I want the video recordings deleted.\"",
                },
                {
                  label: "The issue",
                  value:
                    "Before disclosing anything, you must verify that the caller is the parent and that the account holder is a child. An error in either direction causes harm: disclosing a child's records to someone who is not the parent, or refusing a genuine parent.",
                },
                {
                  label: "What the law provides",
                  value:
                    "s.9(1) requires verifiable parental consent before processing a child's data, and Rule 10 describes verifying that the parent is an identifiable adult using details you already hold or details voluntarily provided. The same method applies here.",
                },
                {
                  label: "What it reveals",
                  value:
                    "If verifiable parental consent was not collected at signup, there is no parent on record to verify against. That gap is the main finding.",
                },
              ],
            },
            {
              title: "Request 3. Erasure with an unpaid invoice",
              lines: [
                { label: "Arrives as", value: "Web form, identity verified" },
                {
                  label: "Text",
                  value:
                    "\"Delete my account and all my data immediately.\" The account has an unpaid invoice of Rs 14,000 and an open dispute.",
                },
                {
                  label: "The conflict",
                  value:
                    "s.12(3) requires erasure on request unless retention is necessary for the specified purpose or for compliance with any law in force. The unpaid invoice engages both: the transaction is not complete, and tax records have their own statutory retention periods.",
                },
                {
                  label: "A second conflict, often missed",
                  value:
                    "Rule 6(1)(e) and Rule 8(3) each require retaining personal data and logs for a minimum of one year. The illustration under Rule 8 says an e-book platform keeps order details for a year from the transaction, even if the customer deletes her account. So full immediate erasure is not possible even without the invoice.",
                },
                {
                  label: "A good response",
                  value:
                    "Erase now everything not covered by those grounds, stop marketing immediately, and explain in writing what is retained, why and for how long, with a date for the remaining deletion.",
                },
              ],
            },
            {
              title: "Request 4. A grievance within a request",
              lines: [
                { label: "Arrives as", value: "Long email to the DPO address" },
                {
                  label: "Text",
                  value:
                    "\"I asked you three times to stop texting me and you have not. I want to know what data you hold and I want to complain about how I have been treated.\"",
                },
                {
                  label: "The issue",
                  value:
                    "This contains two things: an access request under s.11, and a grievance under s.13 about failing to act on a withdrawal of consent. They have different owners and different published response periods. If the whole email is treated as an access request, the grievance is never recorded.",
                },
                {
                  label: "Why it matters",
                  value:
                    "s.13(3) requires a person to use your grievance process before approaching the DPBI. A grievance that was never recorded is a grievance that was never resolved, which allows the person to go to the DPBI.",
                },
                {
                  label: "A good response",
                  value:
                    "Separate the two on arrival. Acknowledge both, record the grievance against your published response period, and first stop the messages, because that is what the person asked for.",
                },
              ],
            },
          ],
        },
      },
      {
        id: "clocks",
        title: "What the law sets on timing",
        body: {
          kind: "reference",
          table: {
            headers: ["Question", "What the law says", "Source"],
            rows: [
              [
                "Deadline to respond to an access request",
                "None. The Act and Rules set no number of days",
                "ss.11 to 14",
              ],
              [
                "Deadline to respond to a grievance",
                "The period you publish, which may not exceed 90 days",
                "Rule 14(3)",
              ],
              [
                "The often-quoted 30 day deadline",
                "Not in the Act or Rules. It comes from the GDPR. If you use 30 days, describe it as your own policy",
                "Not in the Act or Rules",
              ],
              [
                "Whether you must meet your published period",
                "Yes. Rule 14(3) requires technical and organisational measures to make it effective",
                "Rule 14(3)",
              ],
              [
                "Frivolous or false complaints",
                "Data Principals have duties, and breaching them carries a penalty of up to Rs 10,000",
                "s.15, Schedule entry 5",
              ],
            ],
          },
        },
      },
    ],
  },

  // ----------------------------------------------------------------------------- 5
  {
    id: "breach",
    title: "Breach response",
    block: B5,
    intro:
      "Decide now who does what after a breach, so it is not decided during an incident.",
    parts: [
      rulesPart(["Rule 7"]),
      {
        id: "clocks",
        title: "The three notifications",
        body: {
          kind: "reference",
          table: {
            headers: ["Deadline", "Who to notify", "Starts from", "Comes into force"],
            rows: [
              [
                "Without delay",
                "Each affected Data Principal",
                "Becoming aware of the breach",
                "13 May 2027",
              ],
              [
                "Without delay",
                "The DPBI, initial intimation",
                "Becoming aware of the breach",
                "13 May 2027",
              ],
              [
                "72 hours",
                "The DPBI, detailed report",
                "Becoming aware of the breach",
                "13 May 2027",
              ],
            ],
          },
          points: [
            "All three run from when you **become aware** of the breach, not from when it happened.",
            "Notify the DPBI and affected people in parallel. Neither has to wait for the other.",
            "The 72 hour report must say what you told affected people.",
            "Regulated entities (RBI, SEBI, IRDAI) may have extra reporting duties. Check with your compliance team.",
          ],
        },
      },
      {
        id: "tree",
        title: "Decisions to make now, in writing",
        guidance:
          "Answer each question now, in writing.",
        body: {
          kind: "form",
          fields: [
            {
              key: "aware",
              label: "What counts as becoming aware, for us",
              type: "longtext",
              hint: "All three notifications run from this moment, so it needs a definition the person on duty can apply.",
              example:
                "The moment a named on-call engineer confirms unauthorised access, data theft or loss. Not when an alert fires, and not when the incident review ends.",
            },
            {
              key: "whoDecides",
              label: "Who decides it must be notified, and who covers for them",
              type: "text",
              example: "CTO, then the DPO, then the CEO. One of the three is always reachable.",
            },
            {
              key: "notifyOwner",
              label: "Who sends the notifications to the DPBI, and where the template is kept",
              type: "longtext",
              hint: "Without delay means the template must be written in advance and the person must know where it is.",
              example:
                "The DPO sends them, using the template in the incident procedure. A named deputy sends them if the DPO cannot be reached within 30 minutes.",
            },
            {
              key: "scope",
              label: "How we identify who is affected",
              type: "longtext",
              hint: "This depends on your data inventory. If you cannot answer it quickly, the 72 hour report will not be accurate.",
              example:
                "Match the affected systems against the data inventory to list the data types and users involved. Each system owner confirms the list within two hours.",
            },
            {
              key: "comms",
              label: "Who writes the notification to affected people, and who approves it",
              type: "text",
              example: "The DPO drafts it from the template, and the CEO approves it.",
            },
            {
              key: "vendorPath",
              label: "How we find out when a vendor has a breach",
              type: "longtext",
              hint: "Many breaches start at a processor. Your deadlines still apply, and they run from when you become aware.",
              example:
                "Each processor contract names our security contact and requires notice within 24 hours. We monitor the status pages of our top five processors.",
            },
            {
              key: "holding",
              label: "What our initial statement says before all the facts are known",
              type: "longtext",
              hint: "The notice to affected people must be clear and plain, and cover what happened, the likely consequences, what you have done, what they can do, and a contact (Rule 7). You do not need every answer first.",
              example:
                "We are investigating a security incident that may affect your account details. We have contained it and will update you by [date and time]. Until then, please change your password. Contact: [name, email].",
            },
          ],
        },
      },
      {
        id: "log",
        title: "Incident log format",
        guidance:
          "Set up these columns in a tool you already use, so the 72 hour report can be written from the log.",
        body: {
          kind: "table",
          starterRows: 4,
          columns: [
            { key: "time", label: "Time, with timezone", type: "text", width: 20 },
            { key: "who", label: "Who", type: "text", width: 18 },
            { key: "what", label: "What was observed or done", type: "longtext", width: 44 },
            { key: "decision", label: "Decision taken", type: "longtext", width: 34 },
            { key: "evidence", label: "Evidence reference", type: "text", width: 24 },
          ],
          example: [
            {
              time: "02:14 IST",
              who: "On-call engineer",
              what: "Alert on unusual read volume from the reporting database",
              decision: "Escalated to the CTO. Cause unknown, not yet treated as a breach",
              evidence: "Alert ID 88213",
            },
            {
              time: "02:41 IST",
              who: "CTO",
              what: "Confirmed a reused service account password, with reads from an external IP address",
              decision:
                "Became aware, as defined. Notifications to the DPBI and to affected people start now",
              evidence: "Access log export, saved to the incident folder",
            },
            {
              time: "03:05 IST",
              who: "DPO",
              what: "Drafted the initial intimation to the DPBI from the template",
              decision: "Sent at 03:20. Detailed report due within 72 hours",
              evidence: "Sent email and acknowledgement reference",
            },
          ],
        },
      },
    ],
  },

  // ----------------------------------------------------------------------------- 6
  {
    id: "vendor",
    title: "Vendor contracts",
    block: B5,
    intro:
      "Check whether your processor contracts let you meet your own obligations.",
    parts: [
      rulesPart(["s.8(1)", "s.8(2)", "s.8(7)", "s.11", "s.12", "s.16", "Rule 6", "Rule 7", "Rule 8", "Rule 15"]),
      {
        id: "whatTheLawRequires",
        title: "What the law requires in a processor contract",
        body: {
          kind: "reference",
          points: [
            "**The law requires only two things:** a valid contract with every processor (s.8(2)), and security safeguards written into it (Rule 6).",
            "The other clauses below are commercial terms you need to meet your own obligations.",
            "When negotiating, explain why you need a clause. Do not claim the law requires it.",
          ],
        },
      },
      {
        id: "clauses",
        title: "Against our current contracts",
        guidance:
          "Check each clause for your three most important processors.",
        body: {
          kind: "checklist",
          statusOptions: ["", "In the contract", "Partial", "Not in the contract", "No contract exists"],
          evidenceLabel: "Which vendor, and what the clause says",
          items: [
            {
              key: "securityMeasures",
              requirement:
                "The processor must take reasonable security safeguards. This is the clause the Rules require",
              citation: "Required: security terms in processor contracts (s.8(2), Rule 6)",
              fact: "F90",
            },
            {
              key: "incidentNotice",
              requirement:
                "The processor must notify you of an incident within a fixed number of hours, short enough for you to notify without delay",
              citation: "Commercial. Needed for your breach notifications (Rule 7)",
              fact: "F54",
            },
            {
              key: "incidentDetail",
              requirement:
                "The processor must give you the information Rule 7 requires you to report, including nature, extent, timing, location and likely impact",
              citation: "Commercial. Needed for what you must report to the DPBI (Rule 7)",
              fact: "F48",
            },
            {
              key: "affectedList",
              requirement:
                "The processor must tell you which of your users are affected, in a form you can act on",
              citation: "Commercial. Needed to notify affected people (Rule 7)",
              fact: "F47",
            },
            {
              key: "cooperation",
              requirement:
                "The processor must support your 72 hour report, including after the initial notification",
              citation: "Commercial. Needed for your 72 hour report (Rule 7)",
              fact: "F49",
            },
            {
              key: "rightsAssist",
              requirement:
                "The processor must help you answer access requests, including what they hold and who they shared it with",
              citation: "Commercial. Needed to tell people who their data was shared with (s.11)",
              fact: "F39",
            },
            {
              key: "erasure",
              requirement:
                "The processor must erase data on your instruction and confirm that it has done so",
              citation: "Commercial. Needed to erase data on request or when no longer needed (s.12, s.8(7))",
              fact: "F59",
            },
            {
              key: "retentionFloor",
              requirement:
                "The processor keeps data and logs for at least the one year minimum period where you need them, and does not delete them earlier",
              citation: "Needed for the one year minimum retention (Rule 8)",
              fact: "F62",
            },
            {
              key: "subprocessors",
              requirement:
                "You know who their sub-processors are, and your approval is needed before a new one is added",
              citation: "Commercial. You remain responsible for what your processors do (s.8(1), s.11)",
              fact: "F88",
            },
            {
              key: "location",
              requirement:
                "You know which country the data is stored in, and you are told before that changes",
              citation: "Commercial. Relevant to transfers outside India (s.16, Rule 15)",
              fact: "F83",
            },
            {
              key: "exit",
              requirement:
                "When the contract ends, the processor returns the personal data in a usable form and deletes its copies by a stated date",
              citation: "Commercial",
              fact: "F89",
            },
          ],
        },
      },
      {
        id: "reality",
        title: "Common vendor responses, and what to do",
        body: {
          kind: "reference",
          table: {
            headers: ["What the vendor says", "What it usually means", "What to do"],
            rows: [
              [
                "We are ISO 27001 certified",
                "Certification covers their security controls, not how quickly they will notify you",
                "Ask for the notification period in writing. Certification does not include one",
              ],
              [
                "Our standard DPA covers this",
                "Their DPA was written for the GDPR, with a 72 hour notification to you. That may not leave you enough time to notify without delay",
                "Ask for an India addendum with a shorter notification period. Smaller vendors often agree",
              ],
              [
                "We cannot change our standard terms",
                "Usually true for large platforms, and often negotiable for others",
                "Record it as an accepted risk with a named owner, and shorten your own detection time to compensate",
              ],
            ],
          },
        },
      },
    ],
  },

  // ----------------------------------------------------------------------------- 7
  {
    id: "plan",
    title: "90 day plan and readiness scorecard",
    block: B6,
    intro:
      "Three to five actions for the next 90 days, each with a named owner.",
    parts: [
      rulesPart(["s.5(3)", "s.6(7)", "s.6(10)", "Rule 9"]),
      {
        id: "ninety",
        title: "The 90 day plan",
        guidance:
          "Three to five actions, each with a named owner. If you do only one, finish the inventory.",
        body: {
          kind: "form",
          fields: [
            {
              key: "days30",
              label: "By day 30",
              type: "longtext",
              example:
                "Inventory complete, with every system named and an owner for each. A contact for privacy questions published on the website (Rule 9). The server with no owner has an owner or a decommission date.",
            },
            {
              key: "days60",
              label: "By day 60",
              type: "longtext",
              example:
                "Retention periods recorded for the five largest data stores. Incident procedure written, with notification templates and one named person. Top three processors asked in writing for their incident notification period.",
            },
            {
              key: "days90",
              label: "By day 90",
              type: "longtext",
              example:
                "Existing datasets separated by source, with a decision recorded for each. Request handling process written and tested once with an internal request. Notice gaps listed against the eighteen-point checklist, with drafting scheduled.",
            },
            {
              key: "notDoing",
              label: "What we are deliberately not doing this quarter",
              type: "longtext",
              hint: "Stating what is out of scope keeps the rest of the plan achievable.",
              example:
                "Not appointing a formal DPO, because we are not a Significant Data Fiduciary and none has been notified. Not building Consent Manager integration, because the Consent Manager provisions (s.6(7)) come into force in May 2027 and none is registered yet. Not translating the notice into 22 languages, because the law only requires offering a choice of language (s.5(3)).",
            },
            {
              key: "reviewDate",
              label: "When we will review this, and who arranges it",
              type: "text",
              example: "First week of January 2027. The DPO sends the invitation.",
            },
          ],
        },
      },
      {
        id: "scorecard",
        title: "Readiness scorecard",
        guidance:
          "Rate the current state of each area honestly.",
        body: {
          kind: "table",
          starterRows: 0,
          // The six areas are the spine of the scorecard, so they arrive pre-filled and
          // the attendee spends the ten minutes on the columns that matter.
          seed: [
            { area: "Notice" },
            { area: "Consent records" },
            { area: "Existing data" },
            { area: "Request handling" },
            { area: "Breach readiness" },
            { area: "Vendor contracts" },
          ],
          columns: [
            { key: "area", label: "Area", type: "text", width: 26 },
            {
              key: "current",
              label: "Current state",
              type: "choice",
              options: ["", "Nothing in place", "Started", "Mostly in place", "Done"],
              width: 20,
            },
            { key: "target", label: "Target by day 90", type: "longtext", width: 34 },
            { key: "owner", label: "Owner", type: "text", width: 20 },
            { key: "date", label: "Date", type: "text", width: 16 },
          ],
          example: [
            {
              area: "Notice",
              current: "Started",
              target: "Gaps listed against the eighteen-point checklist, drafting scheduled",
              owner: "Legal, with Product",
              date: "Day 90",
            },
            {
              area: "Consent records",
              current: "Nothing in place",
              target:
                "For any user, we can show what notice was displayed and when consent was given. The law requires us to prove consent (s.6(10))",
              owner: "Engineering",
              date: "Day 90",
            },
            {
              area: "Existing data",
              current: "Nothing in place",
              target: "Datasets separated by source, with a decision recorded for each",
              owner: "Growth and CTO",
              date: "Day 90",
            },
            {
              area: "Request handling",
              current: "Started",
              target: "One-page process, tested once with an internal request",
              owner: "Head of Support",
              date: "Day 60",
            },
            {
              area: "Breach readiness",
              current: "Nothing in place",
              target:
                "Incident procedure with notification templates, becoming aware defined, one named person and two backups",
              owner: "CTO",
              date: "Day 60",
            },
            {
              area: "Vendor contracts",
              current: "Nothing in place",
              target:
                "Top three processors asked in writing for their incident notification periods, answers on file",
              owner: "Ops",
              date: "Day 60",
            },
          ],
        },
      },
      {
        id: "seed",
        title: "Rows to start from",
        body: {
          kind: "reference",
          paragraphs: [
            "Keep all six areas, and add rows for anything specific to your business.",
          ],
        },
      },
    ],
  },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}

// Total number of fillable inputs a section can hold, used for the progress indicator.
// A table part counts its starter rows, because that is what the attendee is shown.
export function fillableCount(sectionId: string): number {
  const section = getSection(sectionId);
  if (!section) return 0;
  let total = 0;
  for (const part of section.parts) {
    const body = part.body;
    if (body.kind === "table") {
      const rows = body.starterRows > 0 ? body.starterRows : body.example.length;
      total += rows * body.columns.length;
    } else if (body.kind === "checklist") {
      total += body.items.length * 2;
    } else if (body.kind === "form") {
      total += body.fields.length;
    }
  }
  return total;
}
