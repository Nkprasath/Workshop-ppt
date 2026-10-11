// The notice for the static build.
//
// This is deliberately NOT the server notice with the words changed. The server notice
// makes claims that only a server can make true: answers encrypted at rest, a retention
// period, a purge job, facilitators able to see completion counts. In the static build
// there is no server, so every one of those claims would be false.
//
// What is true here is simpler: nothing leaves the browser. Kept short on purpose.

export const STATIC_NOTICE_VERSION = "static-1.1";

export const STATIC_NOTICE_INTRO = [
  "This workbook has no account and no server, so we do not collect anything from you.",
];

export interface StaticNoticeBlock {
  heading: string;
  satisfies?: string;
  paragraphs: string[];
  items?: string[];
}

export const STATIC_NOTICE_BLOCKS: StaticNoticeBlock[] = [
  {
    heading: "Where your answers are saved",
    paragraphs: [
      "Only in this browser, on this device. They are not sent to us or to anyone else, and the download is created in your browser.",
    ],
  },
  {
    heading: "How long they are kept",
    paragraphs: [
      "Until you clear them, using Settings, then Clear everything from this browser. On a shared computer, download your workbook and then clear it.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "We hold none of your data, so there is nothing for us to access, correct or erase. Clearing the workbook erases it. Questions: founder@theprivacylabs.com.",
    ],
  },
];

export const STATIC_SHARING_NOTE =
  "There is no sharing option. Nothing you type reaches the facilitators.";
