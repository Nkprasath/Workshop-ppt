import type { Section } from "./types";

// The seven sections of the workbook.
//
// Every legal claim in here carries a citation and a fact ID from facts/dpdp-facts.md.
// If you change a claim, change the fact first and then change it here, so the two do not
// drift apart. Nothing in this file states a legal position that is not in that file.
//
// Blocks 1 and 2 of the day have no workbook section. They are argument, not exercise.
// Sections 4 and 5 run on anonymised real material rather than SkillSetu, so their example
// panes do not mention SkillSetu.

const SKILLSETU_INVENTORY: Record<string, string>[] = [
  {
    dataElement: "Learner name and email",
    whereItLives: "Primary MySQL database, AWS RDS, ap-south-1",
    whyWeCollect: "Account creation, login, service email",
    whoHasAccess: "Engineering, Support",
    vendor: "AWS as infrastructure processor",
    retention: "Indefinite. No rule has ever been set.",
    basis: "Consent, s.6(1)",
    notes: "About 60,000 of these accounts belong to under-18s.",
  },
  {
    dataElement: "Learner date of birth",
    whereItLives: "Primary MySQL database",
    whyWeCollect: "Age gating, class allocation",
    whoHasAccess: "Engineering, Support",
    vendor: "AWS",
    retention: "Indefinite",
    basis: "Consent, s.6(1)",
    notes:
      "This is the field that tells us who the 60,000 are. Check it is collected and not inferred from grade level.",
  },
  {
    dataElement: "Learner and parent phone numbers",
    whereItLives: "Primary MySQL database, and mirrored into the WhatsApp Business API",
    whyWeCollect: "Class reminders, and marketing",
    whoHasAccess: "Growth, Support",
    vendor: "Meta, plus our BSP",
    retention: "Indefinite",
    basis:
      "Reminders arguably s.7(a). Marketing needs consent, s.6(1).",
    notes:
      "Two purposes riding on one number. If consent is withdrawn for marketing, the reminders have to keep working.",
  },
  {
    dataElement: "Tutor PAN",
    whereItLives: "S3 bucket, skillsetu-kyc",
    whyWeCollect: "Tutor onboarding, payouts, TDS",
    whoHasAccess: "Ops, Finance",
    vendor: "AWS",
    retention: "Indefinite",
    basis: "Legal obligation for tax records",
    notes: "Bucket permissions have never been reviewed.",
  },
  {
    dataElement: "Tutor Aadhaar",
    whereItLives: "Same S3 bucket",
    whyWeCollect: "Identity verification at onboarding",
    whoHasAccess: "Ops, Finance",
    vendor: "AWS",
    retention: "Indefinite",
    basis: "Consent. Aadhaar has its own separate law, check that too.",
    notes:
      "The real question is whether we need to keep the document after verification, or only the fact of verification.",
  },
  {
    dataElement: "Live session recordings, video and audio",
    whereItLives: "Zoom cloud",
    whyWeCollect: "Quality review, dispute resolution",
    whoHasAccess: "Ops, and any tutor holding the share link",
    vendor: "Zoom",
    retention: "Indefinite. Nobody set a rule.",
    basis: "Consent, s.6(1)",
    notes:
      "Minors are in these recordings. Review whether quality scoring of a child's session is behavioural monitoring under s.9(3).",
  },
  {
    dataElement: "Session chat transcripts",
    whereItLives: "Zoom cloud",
    whyWeCollect: "Dispute resolution",
    whoHasAccess: "Ops",
    vendor: "Zoom",
    retention: "Indefinite",
    basis: "Consent",
    notes: "Same minors question as the recordings, and nobody has ever opened one.",
  },
  {
    dataElement: "Product analytics events",
    whereItLives: "Mixpanel",
    whyWeCollect: "Product improvement, funnel analysis",
    whoHasAccess: "Product, Growth",
    vendor: "Mixpanel",
    retention: "Whatever the Mixpanel default is. Nobody has checked.",
    basis: "Consent",
    notes:
      "Events fire for under-18 accounts too. s.9(3) prohibits tracking and behavioural monitoring of children.",
  },
  {
    dataElement: "Marketing and CRM records",
    whereItLives: "HubSpot",
    whyWeCollect: "Outbound, lifecycle email, school partnerships",
    whoHasAccess: "Growth, Sales",
    vendor: "HubSpot",
    retention: "Indefinite",
    basis: "Consent",
    notes: "Holds parents and school staff as well as learners.",
  },
  {
    dataElement: "Learner performance extracts",
    whereItLives: "Analytics vendor, hosted in Singapore",
    whyWeCollect: "Cohort reporting for school partners",
    whoHasAccess: "Data team, and the vendor's staff",
    vendor: "The Singapore analytics vendor",
    retention: "Unknown. Held vendor side.",
    basis: "Consent",
    notes:
      "Cross border. Transfer is permitted unless the destination is restricted, and none is, but we have no processor contract with them at all.",
  },
  {
    dataElement: "Refund requests: names, phone numbers, partial card digits",
    whereItLives: "A Google Sheet on the ops shared drive",
    whyWeCollect: "Processing refunds",
    whoHasAccess: "Ops team, and anyone holding the link",
    vendor: "Google",
    retention: "Indefinite",
    basis: "s.7(a), performance of the service the person asked for",
    notes:
      "Sharing is set to anyone with the link. This is the row that usually starts the argument.",
  },
  {
    dataElement: "Support tickets and attachments",
    whereItLives: "Freshdesk",
    whyWeCollect: "Customer support",
    whoHasAccess: "Support",
    vendor: "Freshdesk",
    retention: "Indefinite",
    basis: "s.7(a)",
    notes:
      "Attendees routinely forget this one. Users attach ID documents to tickets without being asked to.",
  },
  {
    dataElement: "Legacy user records from the 2019 acquisition",
    whereItLives: "A MySQL instance on an EC2 box that no current employee owns",
    whyWeCollect: "Unknown",
    whoHasAccess: "Unknown. Credentials are in an old password vault.",
    vendor: "Self hosted",
    retention: "Unknown",
    basis: "Unknown",
    notes:
      "Nobody knows what notice these people were given, whether they are still users, or whether the box is patched. Write unknown in every column. Unknown is the finding.",
  },
  {
    dataElement: "Merchandise shipping addresses",
    whereItLives: "Shopify",
    whyWeCollect: "Order fulfilment",
    whoHasAccess: "Ops",
    vendor: "Shopify",
    retention: "Indefinite",
    basis: "s.7(a)",
    notes: "Low volume, which is exactly why it gets left off the list.",
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
      "Employee data is in scope of the Act. Most of this processing needs no consent, and every other obligation still applies to it.",
  },
];

export const SECTIONS: Section[] = [
  // ----------------------------------------------------------------------------- 1
  {
    id: "inventory",
    title: "Data inventory",
    block: "Block 2 · Where your data is",
    intro:
      "Everything else in the day depends on this one being honest. You cannot answer an access request without it, you cannot scope a breach without it, and you cannot decide anything about legacy data without it. Write unknown where the answer is unknown. Unknown is a finding and it is the most useful thing on the page.",
    parts: [
      {
        id: "rows",
        title: "Your inventory",
        guidance:
          "Add a row for every place personal data sits, including the ones that are not systems. Spreadsheets, shared drives, inboxes, a WhatsApp group, an old server nobody owns. Aim for breadth in the ten minutes rather than polish. You will not finish, and finishing is not the point.",
        body: {
          kind: "table",
          starterRows: 8,
          columns: [
            { key: "dataElement", label: "Data element", type: "text", width: 30 },
            { key: "whereItLives", label: "Where it lives", type: "text", width: 30 },
            { key: "whyWeCollect", label: "Why we collect it", type: "text", width: 26 },
            { key: "whoHasAccess", label: "Who has access", type: "text", width: 22 },
            { key: "vendor", label: "Vendor or processor", type: "text", width: 22 },
            { key: "retention", label: "How long we keep it", type: "text", width: 22 },
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
          example: SKILLSETU_INVENTORY,
        },
      },
      {
        id: "prompts",
        title: "Places people forget",
        body: {
          kind: "reference",
          paragraphs: [
            "Run down this list before you call the inventory done. Each one has caught somebody in a previous session.",
          ],
          table: {
            headers: ["Where", "What is usually in it"],
            rows: [
              ["Shared drives and team spreadsheets", "Refunds, escalations, candidate lists, anything ops built to unblock itself"],
              ["Support tooling", "ID documents users attached without being asked"],
              ["Call and meeting recordings", "Everything said, retained by default, never reviewed"],
              ["Analytics and product tooling", "Event streams that do not distinguish adult from minor accounts"],
              ["Marketing tooling", "Lists imported years ago from a source nobody remembers"],
              ["Systems from an acquisition", "Records under a notice you have never read"],
              ["Personal inboxes and devices", "CVs, invoices, ID scans forwarded once and never deleted"],
              ["Backups and snapshots", "Everything above, again, on a different retention clock"],
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
    block: "Block 3 · What you must tell people",
    intro:
      "Eighteen requirements, each one traced to the sub-clause it comes from. Mark each one against your own current notice as it stands today, not as you intend it to be. Partial is an honest and common answer.",
    parts: [
      {
        id: "checklist",
        title: "Against our current notice",
        guidance:
          "The evidence column is where the value is. Paste the sentence from your notice that does the work, or write what is missing. A yes with no evidence is a guess.",
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
                "The notice gives an itemised description of the personal data. A category label such as usage data does not satisfy this",
              citation: "Rule 3(b)(i)",
              fact: "F28",
            },
            {
              key: "purpose",
              requirement:
                "The notice gives the specified purpose, with a specific description of the goods or services provided or the uses enabled",
              citation: "Rule 3(b)(ii)",
              fact: "F28",
            },
            {
              key: "rightsManner",
              requirement:
                "The notice explains how to exercise rights under s.6(4), withdrawal, and s.13, grievance",
              citation: "s.5(1)(ii)",
              fact: "F25",
            },
            {
              key: "complaintManner",
              requirement:
                "The notice explains how to make a complaint to the Board",
              citation: "s.5(1)(iii)",
              fact: "F25",
            },
            {
              key: "standalone",
              requirement:
                "The notice is understandable on its own, independently of any other document. A notice inside the terms of service does not satisfy this",
              citation: "Rule 3(a)",
              fact: "F27",
            },
            {
              key: "linkWithdraw",
              requirement:
                "The notice gives the particular communication link for withdrawing consent",
              citation: "Rule 3(c)(i)",
              fact: "F29",
            },
            {
              key: "withdrawEase",
              requirement:
                "Withdrawing consent is comparably easy to how consent was given",
              citation: "Rule 3(c)(i)",
              fact: "F29",
            },
            {
              key: "linkRights",
              requirement:
                "The notice gives the particular link for exercising rights",
              citation: "Rule 3(c)(ii)",
              fact: "F29",
            },
            {
              key: "linkComplaint",
              requirement:
                "The notice gives the particular link for complaining to the Board",
              citation: "Rule 3(c)(iii)",
              fact: "F29",
            },
            {
              key: "language",
              requirement:
                "The person is offered the option of accessing the notice in English or any Eighth Schedule language, at her choice. This is an option offered, not 22 translations published",
              citation: "s.5(3)",
              fact: "F26",
            },
            {
              key: "contactPublished",
              requirement:
                "Contact details for the DPO, or for a person who can answer questions about the processing, are prominently published on the website or app",
              citation: "Rule 9",
              fact: "F31",
            },
            {
              key: "contactInResponses",
              requirement:
                "Those same contact details appear in every response to a rights request",
              citation: "Rule 9",
              fact: "F31",
            },
            {
              key: "requestMeans",
              requirement:
                "The means of making a rights request are prominently published",
              citation: "Rule 14(1)(a)",
              fact: "F32",
            },
            {
              key: "identifier",
              requirement:
                "The identifier we will require in order to identify a requester is published in advance",
              citation: "Rule 14(1)(b), and 14(5) for what counts",
              fact: "F44",
            },
            {
              key: "grievancePeriod",
              requirement:
                "The period within which we will respond to grievances is published, and it is not more than ninety days",
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
                "If challenged, we could prove that notice was given and that consent was given. This is a record keeping question and it is the one that usually fails",
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
          paragraphs: [
            "Section 5 and Rule 3 both commence on 13 May 2027. Nothing on this page is overdue today. The reason it is worth doing now is that the record keeping requirement at s.6(10) is retrospective in effect: on any given day after commencement you have to be able to prove consent for the data you are holding that day, and you cannot manufacture that evidence backwards.",
            "The one exception worth knowing is Rule 9, the published contact point. It is cheap, it is useful to your own users immediately, and it is the single item on this list that costs an afternoon.",
          ],
        },
      },
    ],
  },

  // ----------------------------------------------------------------------------- 3
  {
    id: "legacy",
    title: "Legacy data position",
    block: "Block 3 · What you must tell people",
    intro:
      "The data you already hold, collected under a notice that would not pass the checklist on the previous page. This is the part of the day with no settled answer, and this page is built to record a decision rather than to find a right one.",
    parts: [
      {
        id: "unsettled",
        title: "Read this before you fill the table",
        body: {
          kind: "reference",
          paragraphs: [
            "There is no settled answer here, and anyone who tells you otherwise is guessing. Here is exactly what the text says and where it stops.",
            "Section 5(2)(a) says that where consent was given before the Act commenced, you must, as soon as reasonably practicable, give the person a notice covering the data, the purpose it has been processed for, how to exercise rights, and how to complain to the Board. Section 5(2)(b) says you may continue processing until and unless the person withdraws consent. There is no re-consent requirement in the text and no cut off date.",
            "What the text does not say is what commencement means for this purpose when commencement happened in three tranches, what reasonably practicable means, or whether consent that was never DPDP grade counts as consent for s.5(2) at all. A pre-ticked box, a bundled terms acceptance, a list imported from an acquisition: it is genuinely unclear whether those fall inside s.5(2) and can be carried forward with a notice, or fall outside it and need fresh consent. There is no rule, no guidance and no Board decision on any of it.",
            "Section 5(2) commences on 13 May 2027, so nobody is late. What is worth doing now is the first two columns of the table below, because the answer to those is the same whichever way the question is eventually resolved.",
          ],
        },
      },
      {
        id: "register",
        title: "Our legacy datasets",
        guidance:
          "One row per dataset that predates your current notice. The third and fourth columns are the ones you will not be able to complete today, and that is expected.",
        body: {
          kind: "table",
          starterRows: 5,
          columns: [
            { key: "dataset", label: "Dataset", type: "text", width: 28 },
            { key: "collected", label: "When it was collected", type: "text", width: 20 },
            {
              key: "underWhat",
              label: "What notice it was collected under",
              type: "longtext",
              width: 34,
            },
            {
              key: "evidence",
              label: "What evidence we hold of consent",
              type: "longtext",
              width: 30,
            },
            {
              key: "toKeepUsing",
              label: "What keeping it in use would require",
              type: "longtext",
              width: 34,
            },
            {
              key: "decision",
              label: "What we are choosing to do",
              type: "choice",
              options: [
                "",
                "Re-notify under s.5(2)(a) and continue processing",
                "Seek fresh consent before continuing to use it",
                "Stop using it, and delete or isolate it",
                "Not decided yet",
              ],
              width: 40,
            },
            { key: "owner", label: "Owner", type: "text", width: 18 },
          ],
          example: [
            {
              dataset: "User records from the 2019 acquisition, on the unowned MySQL box",
              collected: "Before 2019, exact dates unknown",
              underWhat:
                "Unknown. The acquired company's privacy policy has not been located. No copy in the data room index.",
              evidence:
                "None. No consent log, no timestamps, no record of what was shown at signup.",
              toKeepUsing:
                "Establish whether these people are still users at all. If they are, a s.5(2)(a) notice needs a working email address, and we do not know how many of these are live.",
              decision: "Not decided yet",
              owner: "CTO, with Legal",
            },
            {
              dataset: "HubSpot marketing list, imported 2021",
              collected: "2021, from a mix of sources",
              underWhat:
                "Partly signup consent, partly a purchased list, partly event badge scans. The three are mixed in one list with no source field.",
              evidence: "Source field is empty on about 40 percent of records.",
              toKeepUsing:
                "Segment by source before anything else. The signup-consent segment is a s.5(2) question. The purchased segment was never lawful and is not a legacy question at all.",
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
    title: "Rights request SOP",
    block: "Block 4 · When someone asks",
    intro:
      "One page that a support agent could follow at 6pm on a Friday without calling anyone. Write it for that person rather than for a regulator.",
    parts: [
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
              hint: "List every channel, including the ones you would rather not support. Requests do not read your published means.",
              example:
                "Published form, the DPO email address, any support ticket, a reply to a marketing email, a WhatsApp message to the ops number, a legal notice by post.",
            },
            {
              key: "ask",
              label: "What we ask for at intake",
              type: "longtext",
              hint: "Rule 14(1)(b) says publish the identifier you will require. Rule 14(5) defines identifier broadly: username, customer ID, application reference, email, mobile, licence number.",
              example:
                "The registered email or mobile on the account, plus which right they are exercising. Nothing else at intake.",
            },
            {
              key: "verification",
              label: "How we verify identity",
              type: "longtext",
              hint: "The tension to resolve: verify enough to avoid disclosing to the wrong person, without collecting new identity documents you then have to hold.",
              example:
                "Confirmation code to the registered contact on file. We do not ask for ID documents, because holding a scan of someone's passport to answer a data request creates a worse problem than it solves.",
            },
            {
              key: "owner",
              label: "Who owns it, by name and role",
              type: "text",
              example: "Named DPO, with Support as first line and Engineering on call for extracts.",
            },
            {
              key: "sla",
              label: "The response period we publish",
              type: "text",
              hint: "Rule 14(3) caps a published grievance period at ninety days. The Act sets no number of days for rights requests at all. Whatever you publish, you have to be able to meet.",
              example: "30 days for rights requests as our own policy. 30 days published for grievances, well inside the ninety day cap.",
            },
            {
              key: "log",
              label: "Where the request and our response are logged",
              type: "longtext",
              hint: "If you cannot show the request came in and what you did, you cannot show you complied.",
              example: "Ticket in the helpdesk, tagged dpdp-request, with the response attached.",
            },
            {
              key: "refusal",
              label: "What a refusal looks like, and who signs it off",
              type: "longtext",
              hint: "s.12(3) permits refusing erasure where retention is necessary for the specified purpose or for compliance with law. A refusal has to be explainable.",
              example:
                "Written, states which limb is relied on, names the law or the purpose, gives the contact point for challenge, signed off by the DPO.",
            },
            {
              key: "escalation",
              label: "When it stops being a support ticket",
              type: "longtext",
              example:
                "Anything involving a minor, anything from a lawyer, anything alleging a breach, anything we intend to refuse.",
            },
          ],
        },
      },
      {
        id: "tickets",
        title: "Four tickets. Work them against your own SOP",
        guidance:
          "These are anonymised from real requests. For each one, write what your process above would actually do. The interesting ones are the two where the process breaks.",
        body: {
          kind: "reference",
          cards: [
            {
              title: "Ticket 1. The vague one",
              lines: [
                { label: "Arrives as", value: "Email to support, no account details" },
                {
                  label: "Text",
                  value:
                    "\"Under the new data law please send me all my data and delete everything you have on me. I have used your service since 2021.\"",
                },
                {
                  label: "Sender",
                  value: "An address that does not match any account in the system",
                },
                {
                  label: "The problem",
                  value:
                    "Two rights in one sentence, s.11 access and s.12 erasure, and they conflict. Identity is unverified, and the address not matching may mean a typo, a work address, a closed account or someone else entirely.",
                },
                {
                  label: "What good looks like",
                  value:
                    "One reply that asks for the registered identifier you published under Rule 14(1)(b), separates the two requests, and starts no clock you cannot meet. Do not ask for ID documents.",
                },
              ],
            },
            {
              title: "Ticket 2. The parent",
              lines: [
                { label: "Arrives as", value: "Phone call to support, followed by email" },
                {
                  label: "Text",
                  value:
                    "\"My daughter is 15 and has an account with you. I want to see everything you hold on her and I want the video recordings deleted.\"",
                },
                {
                  label: "The problem",
                  value:
                    "You have to verify that the caller is the parent, and that the account holder is a child, before disclosing anything. Getting this wrong in either direction is bad: disclose a teenager's records to a non-parent, or refuse a legitimate parent.",
                },
                {
                  label: "What the text gives you",
                  value:
                    "s.9(1) requires verifiable parental consent before processing a child's data, and Rule 10 describes checking the parent is an identifiable adult by reference to details you already hold, or details voluntarily provided. That same machinery is what you use here.",
                },
                {
                  label: "The trap",
                  value:
                    "If you never collected verifiable parental consent at signup, you have no parent on file to verify against, and this ticket exposes that. That is the real finding.",
                },
              ],
            },
            {
              title: "Ticket 3. Erasure, with an unpaid invoice",
              lines: [
                { label: "Arrives as", value: "Web form, correctly identified" },
                {
                  label: "Text",
                  value:
                    "\"Delete my account and all my data immediately.\" The account has an unpaid invoice of 14,000 rupees and an open dispute.",
                },
                {
                  label: "The conflict",
                  value:
                    "s.12(3) requires erasure on request unless retention is necessary for the specified purpose or for compliance with any law in force. The unpaid invoice engages both limbs: the transaction is not concluded, and tax records have their own statutory retention.",
                },
                {
                  label: "The second conflict, which people miss",
                  value:
                    "Rule 6(1)(e) and Rule 8(3) each require retaining personal data and logs for a minimum of one year. The illustration under Rule 8 says an e-book platform keeps order details for a year from the transaction even if the customer deletes her account. So a full immediate erasure is not available even without the invoice.",
                },
                {
                  label: "What good looks like",
                  value:
                    "Partial erasure now for everything not caught by the two limbs, marketing suppression immediately, a written statement of what is retained and why and for how long, and a date when the rest goes. Not a flat refusal, and not a promise you cannot keep.",
                },
              ],
            },
            {
              title: "Ticket 4. A grievance wearing a rights request",
              lines: [
                { label: "Arrives as", value: "Long email to the DPO address" },
                {
                  label: "Text",
                  value:
                    "\"I asked you three times to stop texting me and you have not. I want to know what data you hold and I want to complain about how I have been treated.\"",
                },
                {
                  label: "The problem",
                  value:
                    "This is two things: a s.11 access request, and a s.13 grievance about a failure to act on a withdrawal of consent. They have different owners, different clocks and different published commitments, and if you treat the whole thing as an access request the grievance never gets logged.",
                },
                {
                  label: "Why it matters more than it looks",
                  value:
                    "s.13(3) requires a person to exhaust your grievance mechanism before approaching the Board. A grievance you never registered as a grievance is a grievance you never resolved, and that is what makes the next step available to them.",
                },
                {
                  label: "What good looks like",
                  value:
                    "Split it on arrival. Acknowledge both, log the grievance separately against your published response period, and fix the underlying texting problem first, because that is what they actually asked for three times.",
                },
              ],
            },
          ],
        },
      },
      {
        id: "clocks",
        title: "What the law actually prescribes on timing",
        body: {
          kind: "reference",
          table: {
            headers: ["Question", "What the text says", "Where"],
            rows: [
              [
                "Deadline to answer an access request",
                "None prescribed. Nothing in the Act or Rules sets a number of days",
                "ss.11 to 14",
              ],
              [
                "Deadline to answer a grievance",
                "You publish your own period, and it may not exceed ninety days",
                "Rule 14(3)",
              ],
              [
                "The 30 day DPDP deadline everyone quotes",
                "Does not exist. If you use 30 days it is your policy, and you should describe it that way",
                "Absent from the Act and the Rules",
              ],
              [
                "Whether you must be able to meet your published period",
                "Yes. Rule 14(3) requires technical and organisational measures to make it effective",
                "Rule 14(3)",
              ],
              [
                "Frivolous or false complaints",
                "The Data Principal has duties, and breaching them carries a penalty of up to ten thousand rupees",
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
    title: "Breach",
    block: "Block 5 · When it goes wrong",
    intro:
      "Two clocks that are live today and two that arrive in May 2027. The point of this section is that the decisions have to be pre-made, because six hours is not enough time to have a meeting about whether to have a meeting.",
    parts: [
      {
        id: "clocks",
        title: "The four clocks",
        guidance:
          "Two of these apply to you today. Two commence on 13 May 2027. Knowing which is which is the difference between a plan and an anxiety.",
        body: {
          kind: "reference",
          table: {
            headers: ["Clock", "Who to", "When it starts", "In force"],
            rows: [
              [
                "6 hours",
                "CERT-In, by email, phone or fax",
                "On noticing the incident, or being brought to notice of it",
                "Yes, since June 2022. This is the one that can bite today",
              ],
              [
                "Without delay",
                "The Board",
                "On becoming aware",
                "13 May 2027",
              ],
              [
                "Without delay",
                "Each affected Data Principal",
                "On becoming aware",
                "13 May 2027",
              ],
              [
                "72 hours",
                "The Board, detailed report",
                "On becoming aware",
                "13 May 2027",
              ],
            ],
          },
          paragraphs: [
            "The CERT-In clock comes from direction No. 20(3)/2022-CERT-In dated 28 April 2022, clause (ii), which requires any service provider, intermediary, data centre, body corporate or government organisation to report the incident types in Annexure I within 6 hours. Annexure I items xi and xii are Data Breach and Data Leak. It stacks on top of DPDP and DPDP does not replace it.",
            "The DPDP clocks run from becoming aware, not from the breach occurring, and Rule 7 sets no ordering between telling the Board and telling the affected people. Both are without delay and they run in parallel. The 72 hour report has to include an account of what you told the affected individuals, so if you have not told them by then, that gap is in the report you file.",
            "Regulated entities have further clocks to RBI, SEBI or IRDAI. We are not putting numbers on those, because we have not verified them against the primary directions. If you are regulated, that is a question for your compliance function.",
          ],
        },
      },
      {
        id: "tree",
        title: "Decisions to make now, in writing",
        guidance:
          "Answer these today. Every one of them is a decision you do not want to be making for the first time at 2am.",
        body: {
          kind: "form",
          fields: [
            {
              key: "aware",
              label: "What counts as becoming aware, for us",
              type: "longtext",
              hint: "Both DPDP clocks run from this moment, so it needs a definition that a person on shift can apply.",
              example:
                "The moment a named on-call engineer confirms unauthorised access, exfiltration or loss. Not the moment an alert fires, and not the moment the incident review concludes.",
            },
            {
              key: "whoDecides",
              label: "Who decides it is reportable, and who covers them",
              type: "text",
              example: "CTO, backup is the DPO, backup is the CEO. One of the three is always reachable.",
            },
            {
              key: "certinOwner",
              label: "Who files the CERT-In report, and where the template lives",
              type: "longtext",
              hint: "6 hours means the template is written in advance and the person knows where it is.",
              example:
                "DPO files, template in the incident runbook, sent to incident@cert-in.org.in. Deputy files if the DPO is unreachable within 30 minutes.",
            },
            {
              key: "scope",
              label: "How we work out who is affected",
              type: "longtext",
              hint: "This is the inventory question again. If you cannot answer it in an hour, the 72 hour report will not be accurate.",
              example: "",
            },
            {
              key: "comms",
              label: "Who writes the notification to affected people, and who approves it",
              type: "text",
              example: "",
            },
            {
              key: "vendorPath",
              label: "How we find out when a vendor is breached rather than us",
              type: "longtext",
              hint: "Most breaches an ops team handles start at a processor. Your clocks still run, and they run from when you become aware.",
              example: "",
            },
            {
              key: "holding",
              label: "What our holding statement says before we know the facts",
              type: "longtext",
              hint: "Rule 7(1) requires concise, clear and plain, and it requires five specific contents. It does not require you to have all the answers first.",
              example: "",
            },
          ],
        },
      },
      {
        id: "log",
        title: "Incident log format",
        guidance:
          "Set the columns up now, in whatever tool you already use. The 72 hour report at Rule 7(2)(b) asks for six things, and every one of them is easier to produce from a log kept during the incident than reconstructed afterwards.",
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
              what: "Alert on anomalous read volume from the reporting replica",
              decision: "Escalated to CTO. Clock not started, cause unknown",
              evidence: "Alert ID 88213",
            },
            {
              time: "02:41 IST",
              who: "CTO",
              what: "Confirmed credential reuse on a service account, reads from an external IP",
              decision:
                "Became aware, as defined. CERT-In 6 hour clock starts now. Board and principal clocks noted for the 2027 position",
              evidence: "Access log export, saved to incident folder",
            },
            {
              time: "03:05 IST",
              who: "DPO",
              what: "Drafted CERT-In report from the runbook template",
              decision: "Filed at 03:20, well inside 6 hours",
              evidence: "Sent mail, acknowledgement reference",
            },
          ],
        },
      },
    ],
  },

  // ----------------------------------------------------------------------------- 6
  {
    id: "vendor",
    title: "Vendor escalation",
    block: "Block 5 · When it goes wrong",
    intro:
      "You cannot meet your own clocks if a processor tells you a week late. Section 8(1) makes you responsible for processing done on your behalf irrespective of any agreement to the contrary, so this is your problem regardless of what the contract says.",
    parts: [
      {
        id: "whatTheLawRequires",
        title: "What the law actually requires in a processor contract",
        body: {
          kind: "reference",
          paragraphs: [
            "Less than people assume, and this is worth being straight about. Section 8(2) says a Data Processor may be engaged only under a valid contract, and it does not list what the contract must contain. Rule 6(1)(f) says reasonable security safeguards include appropriate provision in that contract for taking reasonable security safeguards. That is the whole statutory requirement.",
            "Everything else below is commercial drafting rather than a legal checklist. It is here because without it you cannot meet obligations that are on you and not on your vendor. Do not tell a vendor the law requires a clause when it does not. Tell them why you need it, which is a stronger position and survives being checked.",
          ],
        },
      },
      {
        id: "clauses",
        title: "Against our current contracts",
        guidance:
          "Pick your three most significant processors and mark each clause. Most attendees find that the answer for at least one major vendor is that there is no contract at all, only clickthrough terms.",
        body: {
          kind: "checklist",
          statusOptions: ["", "In the contract", "Partial", "Not in the contract", "No contract exists"],
          evidenceLabel: "Which vendor, and what the clause actually says",
          items: [
            {
              key: "securityMeasures",
              requirement:
                "The processor is required to take reasonable security safeguards. This is the one the Rules actually require",
              citation: "Rule 6(1)(f), s.8(2)",
              fact: "F90",
            },
            {
              key: "incidentNotice",
              requirement:
                "The processor must notify us of an incident within a fixed number of hours, short enough that our 6 hour CERT-In clock is still meetable",
              citation: "Commercial. Needed because of CERT-In clause (ii)",
              fact: "F54",
            },
            {
              key: "incidentDetail",
              requirement:
                "The processor must give us the specific information Rule 7 requires us to report, including nature, extent, timing, location and likely impact",
              citation: "Commercial. Needed because of Rule 7(2)",
              fact: "F48",
            },
            {
              key: "affectedList",
              requirement:
                "The processor must tell us which of our people are affected, in a form we can act on",
              citation: "Commercial. Needed because of Rule 7(1)",
              fact: "F47",
            },
            {
              key: "cooperation",
              requirement:
                "The processor must cooperate with our 72 hour report, including after the initial notification",
              citation: "Commercial. Needed because of Rule 7(2)(b)",
              fact: "F49",
            },
            {
              key: "rightsAssist",
              requirement:
                "The processor must help us answer access requests, including telling us what they hold and who they shared it with",
              citation: "Commercial. Needed because of s.11(1)(b)",
              fact: "F39",
            },
            {
              key: "erasure",
              requirement:
                "The processor must erase on our instruction, and must confirm erasure",
              citation: "Commercial. Needed because of s.12(3) and s.8(7)",
              fact: "F59",
            },
            {
              key: "retentionFloor",
              requirement:
                "The processor retains data and logs for at least one year where we need them to, and does not erase earlier than our own floor",
              citation: "Rule 8(3) and its illustration, Case 2",
              fact: "F62",
            },
            {
              key: "subprocessors",
              requirement:
                "We know who their sub-processors are and we are told before they change",
              citation: "Commercial. Needed because of s.11(1)(b) and s.8(1)",
              fact: "F88",
            },
            {
              key: "location",
              requirement:
                "We know which country the data sits in, and we are told before that changes",
              citation: "Commercial. Relevant to s.16 and Rule 15",
              fact: "F83",
            },
            {
              key: "logs",
              requirement:
                "ICT logs are retained for 180 days and kept within Indian jurisdiction, or we know that they are not",
              citation: "CERT-In direction, clause (iv)",
              fact: "F55",
            },
            {
              key: "exit",
              requirement:
                "On termination we get the data back in a usable form, and their copies are deleted on a stated timetable",
              citation: "Commercial",
              fact: "F89",
            },
          ],
        },
      },
      {
        id: "reality",
        title: "The three answers you will get, and what to do",
        body: {
          kind: "reference",
          table: {
            headers: ["What the vendor says", "What it usually means", "What to do"],
            rows: [
              [
                "We are ISO 27001 certified",
                "A real answer to a different question. Certification is about their control environment, not about telling you within four hours",
                "Ask for the notification timeline in writing. Certification does not contain one",
              ],
              [
                "Our standard DPA covers this",
                "Their DPA was written for GDPR and has a 72 hour notification to the controller, which is too slow for a 6 hour CERT-In clock",
                "Ask for an India addendum with a shorter incident notice period. Small vendors often say yes because nobody has asked",
              ],
              [
                "We cannot change our standard terms",
                "Usually true for large platforms and usually negotiable for everyone else",
                "Record it as an accepted risk with a named owner, and shorten your own internal detection time to compensate",
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
    block: "Block 6 · What you do next",
    intro:
      "The point of the scorecard is not the score. It is having six rows with a named owner against each, so that the person who did not attend today can be told what they now own.",
    parts: [
      {
        id: "ninety",
        title: "The 90 day plan",
        guidance:
          "Three to five things, each with a named person. A plan with fifteen items on it is a plan that will not survive contact with a quarter. If you only do one thing, finish the inventory, because five of the six scorecard rows below depend on it.",
        body: {
          kind: "form",
          fields: [
            {
              key: "days30",
              label: "By day 30",
              type: "longtext",
              example:
                "Inventory complete to the level of every system named and an owner against each. Rule 9 contact point published, which is an afternoon of work. The unowned MySQL box has an owner or a decommission date.",
            },
            {
              key: "days60",
              label: "By day 60",
              type: "longtext",
              example:
                "Retention position written down for the five largest data stores. Incident runbook written, with the CERT-In template in it and one person named. Top three processors asked in writing for their incident notification timeline.",
            },
            {
              key: "days90",
              label: "By day 90",
              type: "longtext",
              example:
                "Legacy datasets segmented by source and a decision recorded against each. Rights request SOP written and tested once with a real internal request. Notice gap list produced against the eighteen point checklist, with drafting scheduled.",
            },
            {
              key: "notDoing",
              label: "What we are explicitly not doing this quarter",
              type: "longtext",
              hint: "This field is the one that makes the rest of the plan real.",
              example:
                "Not appointing a formal DPO, because we are not an SDF and none has been notified. Not building consent manager integration, because s.6(7) arrives in May 2027 and no consent manager exists to integrate with. Not translating the notice into 22 languages, because s.5(3) is an option offered at the person's choice.",
            },
            {
              key: "reviewDate",
              label: "When we look at this again, and who calls the meeting",
              type: "text",
              example: "First week of January 2027. The DPO owns the calendar invite.",
            },
          ],
        },
      },
      {
        id: "scorecard",
        title: "Readiness scorecard",
        guidance:
          "Be unkind to yourself in the current state column. A scorecard that says amber everywhere is a scorecard nobody acts on.",
        body: {
          kind: "table",
          starterRows: 0,
          // The six areas are the spine of the scorecard, so they arrive pre-filled and
          // the attendee spends the ten minutes on the columns that matter.
          seed: [
            { area: "Notice status" },
            { area: "Consent records" },
            { area: "Legacy data position" },
            { area: "Rights request process" },
            { area: "Breach readiness" },
            { area: "Vendor contracts" },
          ],
          columns: [
            { key: "area", label: "Area", type: "text", width: 26 },
            {
              key: "current",
              label: "Current state",
              type: "choice",
              options: ["", "Nothing in place", "Started", "Mostly there", "Done"],
              width: 20,
            },
            { key: "target", label: "Target by 90 days", type: "longtext", width: 34 },
            { key: "owner", label: "Owner", type: "text", width: 20 },
            { key: "date", label: "Date", type: "text", width: 16 },
          ],
          example: [
            {
              area: "Notice status",
              current: "Started",
              target: "Gap list against the eighteen point checklist, drafting scheduled",
              owner: "Legal, with Product",
              date: "Day 90",
            },
            {
              area: "Consent records",
              current: "Nothing in place",
              target:
                "We can show, for any given user, what notice was displayed and when consent was given. s.6(10) puts the burden on us",
              owner: "Engineering",
              date: "Day 90",
            },
            {
              area: "Legacy data position",
              current: "Nothing in place",
              target: "Datasets segmented by source, decision recorded against each",
              owner: "Growth and CTO",
              date: "Day 90",
            },
            {
              area: "Rights request process",
              current: "Started",
              target: "One page SOP, tested once with a real internal request",
              owner: "Head of Support",
              date: "Day 60",
            },
            {
              area: "Breach readiness",
              current: "Nothing in place",
              target:
                "Runbook with the CERT-In template, becoming aware defined, one named person and two backups",
              owner: "CTO",
              date: "Day 60",
            },
            {
              area: "Vendor contracts",
              current: "Nothing in place",
              target:
                "Top three processors asked in writing for incident notification timelines, answers on file",
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
            "The six areas are notice status, consent records, legacy data position, rights request process, breach readiness and vendor contracts. Add your own rows if something specific to you belongs on the list, and delete none of the six.",
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
