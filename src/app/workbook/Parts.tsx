"use client";

import type {
  ChecklistPart,
  FormPart,
  Part,
  ReferencePart,
  TablePart,
} from "@/lib/content/types";

type Row = Record<string, string>;
type Answers = Record<string, unknown>;

// The worked example, shown beside every fillable part. The SkillSetu answers are the
// teaching, so they get a real panel rather than a footnote.
function Example({ rows }: { rows: { label: string; value: string }[] }) {
  if (rows.length === 0) return null;
  return (
    <aside className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
          i
        </span>
        <h4 className="text-xs font-bold uppercase tracking-wide text-blue-900">
          Worked example
        </h4>
      </div>
      <dl className="space-y-2">
        {rows.map((r, i) => (
          <div key={i}>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-blue-700/70">
              {r.label}
            </dt>
            <dd className="text-[13px] leading-snug text-gray-700">{r.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

// ------------------------------------------------------------------- table

function TableBody({
  body,
  value,
  onChange,
}: {
  body: TablePart;
  value: Row[];
  onChange: (next: Row[]) => void;
}) {
  const rows: Row[] =
    value.length > 0
      ? value
      : body.seed && body.seed.length > 0
        ? body.seed.map((r) => ({ ...r }))
        : Array.from({ length: Math.max(body.starterRows, 1) }, (): Row => ({}));

  function setCell(index: number, key: string, next: string) {
    const copy = rows.map((r) => ({ ...r }));
    copy[index] = { ...copy[index], [key]: next };
    onChange(copy);
  }

  function addRow() {
    onChange([...rows.map((r) => ({ ...r })), {}]);
  }

  function removeRow(index: number) {
    const copy = rows.filter((_, i) => i !== index);
    onChange(copy.length > 0 ? copy : [{}]);
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-gray-50">
              {body.columns.map((c) => (
                <th
                  key={c.key}
                  style={{ minWidth: Math.max(120, c.width * 6) }}
                  className="border-b border-gray-200 px-2 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-gray-500"
                >
                  {c.label}
                </th>
              ))}
              <th className="w-9 border-b border-gray-200" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="group even:bg-gray-50/40">
                {body.columns.map((c) => (
                  <td key={c.key} className="border-b border-gray-100 p-1">
                    {c.type === "choice" ? (
                      <select
                        value={row[c.key] ?? ""}
                        onChange={(e) => setCell(index, c.key, e.target.value)}
                        aria-label={`${c.label}, row ${index + 1}`}
                        className="border-transparent bg-transparent hover:border-gray-300"
                      >
                        {(c.options ?? [""]).map((option) => (
                          <option key={option} value={option}>
                            {option || "Choose"}
                          </option>
                        ))}
                      </select>
                    ) : c.type === "longtext" ? (
                      <textarea
                        value={row[c.key] ?? ""}
                        onChange={(e) => setCell(index, c.key, e.target.value)}
                        aria-label={`${c.label}, row ${index + 1}`}
                        rows={2}
                        className="border-transparent bg-transparent hover:border-gray-300"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[c.key] ?? ""}
                        onChange={(e) => setCell(index, c.key, e.target.value)}
                        aria-label={`${c.label}, row ${index + 1}`}
                        className="border-transparent bg-transparent hover:border-gray-300"
                      />
                    )}
                  </td>
                ))}
                <td className="border-b border-gray-100 px-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    aria-label={`Remove row ${index + 1}`}
                    title="Remove this row"
                    className="rounded p-1 text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={addRow}>
        + Add a row
      </button>

      {body.example.length > 0 && (
        <div className="mt-5 space-y-3">
          {body.example.map((row, i) => (
            <Example
              key={i}
              rows={body.columns
                .filter((c) => row[c.key])
                .map((c) => ({ label: c.label, value: row[c.key] }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------- checklist

function ChecklistBody({
  body,
  value,
  onChange,
}: {
  body: ChecklistPart;
  value: Answers;
  onChange: (next: Answers) => void;
}) {
  function set(key: string, field: "status" | "evidence", next: string) {
    const current = (value[key] ?? {}) as Record<string, string>;
    onChange({ ...value, [key]: { ...current, [field]: next } });
  }

  return (
    <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
      {body.items.map((item, i) => {
        const saved = (value[item.key] ?? {}) as {
          status?: string;
          evidence?: string;
        };
        const done = Boolean(saved.status);
        return (
          <div key={item.key} className="p-4">
            <div className="mb-2.5 flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] leading-snug text-gray-800">
                  {item.requirement}
                </p>
                <span className="cite">{item.citation}</span>
              </div>
            </div>
            <div className="grid gap-2 pl-8 sm:grid-cols-[170px_1fr]">
              <select
                value={saved.status ?? ""}
                onChange={(e) => set(item.key, "status", e.target.value)}
                aria-label={`Status: ${item.requirement.slice(0, 60)}`}
              >
                {body.statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option || "Not answered"}
                  </option>
                ))}
              </select>
              <textarea
                value={saved.evidence ?? ""}
                onChange={(e) => set(item.key, "evidence", e.target.value)}
                placeholder={body.evidenceLabel}
                aria-label={`${body.evidenceLabel}: ${item.requirement.slice(0, 60)}`}
                rows={2}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------------------------- form

function FormBody({
  body,
  value,
  onChange,
}: {
  body: FormPart;
  value: Answers;
  onChange: (next: Answers) => void;
}) {
  const examples = body.fields
    .filter((f) => f.example)
    .map((f) => ({ label: f.label, value: f.example as string }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        {body.fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="mb-1.5 block text-[13px] font-semibold text-gray-800"
            >
              {field.label}
            </label>
            {field.type === "choice" ? (
              <select
                id={field.key}
                value={String(value[field.key] ?? "")}
                onChange={(e) =>
                  onChange({ ...value, [field.key]: e.target.value })
                }
              >
                {(field.options ?? [""]).map((option) => (
                  <option key={option} value={option}>
                    {option || "Choose"}
                  </option>
                ))}
              </select>
            ) : field.type === "longtext" ? (
              <textarea
                id={field.key}
                rows={3}
                value={String(value[field.key] ?? "")}
                onChange={(e) =>
                  onChange({ ...value, [field.key]: e.target.value })
                }
              />
            ) : (
              <input
                id={field.key}
                type="text"
                value={String(value[field.key] ?? "")}
                onChange={(e) =>
                  onChange({ ...value, [field.key]: e.target.value })
                }
              />
            )}
            {field.hint && (
              <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
                {field.hint}
              </p>
            )}
          </div>
        ))}
      </div>

      <Example rows={examples} />
    </div>
  );
}

// --------------------------------------------------------------- reference

function ReferenceBody({ body }: { body: ReferencePart }) {
  return (
    <div className="space-y-4">
      {body.paragraphs?.map((p, i) => (
        <p key={i} className="text-[14px] leading-relaxed text-gray-600">
          {p}
        </p>
      ))}

      {body.table && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="bg-gray-50">
                {body.table.headers.map((h) => (
                  <th
                    key={h}
                    className="border-b border-gray-200 px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.table.rows.map((row, i) => (
                <tr key={i} className="even:bg-gray-50/40">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`border-b border-gray-100 px-3 py-2 align-top text-[13px] leading-snug ${
                        j === 0 ? "font-semibold text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {body.cards && body.cards.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {body.cards.map((card) => (
            <div key={card.title} className="card p-4">
              <h4 className="mb-3 text-[14px] font-bold text-gray-900">
                {card.title}
              </h4>
              <dl className="space-y-2">
                {card.lines.map((line, i) => (
                  <div key={i}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {line.label}
                    </dt>
                    <dd className="text-[13px] leading-snug text-gray-700">
                      {line.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ router

export function PartView({
  part,
  value,
  onChange,
}: {
  part: Part;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const body = part.body;
  return (
    <section className="card p-5">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">{part.title}</h3>
        {part.guidance && (
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-gray-500">
            {part.guidance}
          </p>
        )}
      </div>

      {body.kind === "table" && (
        <TableBody
          body={body}
          value={Array.isArray(value) ? (value as Row[]) : []}
          onChange={(next) => onChange(next)}
        />
      )}
      {body.kind === "checklist" && (
        <ChecklistBody
          body={body}
          value={(value && typeof value === "object" ? value : {}) as Answers}
          onChange={(next) => onChange(next)}
        />
      )}
      {body.kind === "form" && (
        <FormBody
          body={body}
          value={(value && typeof value === "object" ? value : {}) as Answers}
          onChange={(next) => onChange(next)}
        />
      )}
      {body.kind === "reference" && <ReferenceBody body={body} />}
    </section>
  );
}
