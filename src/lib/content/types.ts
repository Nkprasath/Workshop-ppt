// Shapes for the workbook content.
//
// A section is one block of the day. A section has one or more parts, and each part is one
// of four shapes. Keeping the shapes to four means the renderer, the xlsx writer and the
// PDF writer each have four cases to handle rather than a special case per section.

export type ControlType = "text" | "longtext" | "choice";

export interface Column {
  key: string;
  label: string;
  type: ControlType;
  options?: string[];
  hint?: string;
  // Column width in the exported spreadsheet, in characters.
  width: number;
}

// Repeatable rows the attendee adds and removes. Used for the inventory, the legacy
// register, and the incident log format.
export interface TablePart {
  kind: "table";
  columns: Column[];
  starterRows: number;
  // Filled rows shown in the example pane beside the attendee's own blank table.
  example: Record<string, string>[];
  // Rows pre-populated in the attendee's own table rather than in the example pane, for
  // tables with a fixed spine. The scorecard uses this so nobody has to retype the six
  // area names. Ignored once the attendee has saved anything into the table.
  seed?: Record<string, string>[];
}

// A fixed list of requirements, each with a status control and a free text evidence field.
// Used for the notice checklist and the vendor clause list.
export interface ChecklistPart {
  kind: "checklist";
  statusOptions: string[];
  evidenceLabel: string;
  items: {
    key: string;
    requirement: string;
    // The section or rule this requirement comes from. Every item has one.
    citation: string;
    // The fact ID in facts/dpdp-facts.md that this traces to.
    fact: string;
    exampleStatus?: string;
    exampleEvidence?: string;
  }[];
}

// Labelled fields down a page. Used for the rights request SOP and the breach decision tree.
export interface FormPart {
  kind: "form";
  fields: {
    key: string;
    label: string;
    type: ControlType;
    options?: string[];
    hint?: string;
    example?: string;
  }[];
}

// Content the attendee reads and does not fill in: the worked scenario tickets, the four
// notification clocks, the guidance on the legacy question.
export interface ReferencePart {
  kind: "reference";
  // Either prose paragraphs or a table, or both.
  paragraphs?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  // Worked examples rendered as labelled cards.
  cards?: {
    title: string;
    lines: { label: string; value: string }[];
  }[];
}

export type Part = {
  id: string;
  title: string;
  guidance?: string;
  body: TablePart | ChecklistPart | FormPart | ReferencePart;
};

export interface Section {
  id: string;
  // Shown in the navigation.
  title: string;
  // Which block of the day this belongs to, shown under the title.
  block: string;
  // One or two sentences at the top of the section.
  intro: string;
  parts: Part[];
}
