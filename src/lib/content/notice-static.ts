// The notice for the static build.
//
// This is deliberately NOT the server notice with the words changed. The server notice
// makes claims that only a server can make true: answers encrypted at rest, a retention
// period, a purge job, facilitators able to see completion counts. In the static build
// there is no server, so every one of those claims would be false, and a workshop whose
// first block is about checking published claims against primary sources cannot ship a
// notice it would fail its own test on.
//
// What is true here is simpler and stronger: nothing leaves the browser.

export const STATIC_NOTICE_VERSION = "static-1.0";

export const STATIC_NOTICE_INTRO = [
  "This workbook collects personal data from you, so it starts with a notice. The workshop spends an hour on what a notice has to contain, and it would be a poor look to run that session behind a privacy policy link.",
  "This version of the workbook has no server. That is not a limitation we are apologising for, it is the whole design: there is nothing for us to hold, because nothing reaches us.",
];

export interface StaticNoticeBlock {
  heading: string;
  satisfies?: string;
  paragraphs: string[];
  items?: string[];
}

export const STATIC_NOTICE_BLOCKS: StaticNoticeBlock[] = [
  {
    heading: "What we collect from you",
    satisfies: "s.5(1)(i), an itemised description of the personal data",
    paragraphs: [
      "Nothing. Not your name, not your email address, not your company, and not a single word you type into the workbook below.",
      "There is no sign-in because there is no account. There is no server to send anything to.",
    ],
  },
  {
    heading: "Where what you type actually goes",
    paragraphs: [
      "Into your own browser, using a feature called local storage, and nowhere else. It stays on this device, in this browser, under this website address.",
      "It survives closing the tab and restarting your computer, which is what makes it safe to answer a question, go and check something, and come back.",
      "It is not sent to us. It is not sent to anyone. You can confirm that yourself: open your browser's developer tools, go to the Network tab, type into any field, and watch nothing happen.",
    ],
  },
  {
    heading: "Who can see it",
    paragraphs: [
      "You, and anyone who can use this device and this browser profile. That is the complete list.",
      "The facilitators cannot see what you have written, cannot see how much you have filled in, and cannot see whether you opened this at all. On a shared or public computer, clear it when you are done using the button at the bottom of the settings panel.",
    ],
  },
  {
    heading: "How long it is kept",
    satisfies: "s.5(1), retention",
    paragraphs: [
      "Until you clear it, or until your browser clears it. We cannot delete it for you, because we cannot reach it.",
      "There is no retention period running in the background and no scheduled job, because there is nothing on our side to run one against.",
    ],
  },
  {
    heading: "Taking it with you",
    paragraphs: [
      "Use the download buttons at the top of the workbook. The spreadsheet is built inside your browser from what is already on your device, so the download involves no request to us either.",
      "Download before you clear, and download before the end of the session if you are on a machine that is not yours.",
    ],
  },
  {
    heading: "Third parties on this page",
    paragraphs: [
      "There are none. No analytics, no fonts loaded from another company's servers, no tag manager, no session recorder, no embedded video.",
      "The typeface, the code and the images are all part of this page. Same test as above: the Network tab should show requests to this site and to nothing else.",
    ],
  },
  {
    heading: "Your rights, and complaining to the Board",
    satisfies: "s.5(1)(ii) and (iii)",
    paragraphs: [
      "A real Section 5 notice tells you how to exercise your rights and how to complain to the Data Protection Board. Here is the honest version, and it is one of the things Block 1 is about.",
      "Rights of access, correction and erasure are exercised against whoever holds your data. Nobody holds this but you, so there is nothing for us to give you, correct, or delete. The clear button is the erasure right, and it is in your hands rather than ours.",
      "On the Board: sections 18 to 26 commenced on 13 November 2025, but as of the date on this notice no Chairperson and no Members have been appointed, and we could not find a published complaints route. Section 13, the right to approach the Board, commences on 13 May 2027. So there is currently no DPDP escalation route: the right is not yet in force, and the Board is not yet operational. That is narrower than saying you have no recourse at all, and nothing here limits whatever rights you have under other law.",
    ],
  },
  {
    heading: "If you would rather not",
    paragraphs: [
      "Download the blank workbook and do the whole day on paper or in your own spreadsheet. That is a supported way to attend and you will not be behind.",
      "Nothing in the session depends on you having typed anything into this page.",
    ],
  },
];

export const STATIC_SHARING_NOTE =
  "There is no sharing option, because there is nowhere to share to. Nothing you type reaches the facilitators.";
