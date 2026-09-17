"use client";

import { useState } from "react";
import WorkbookView from "@/app/workbook/Workbook";
import {
  STATIC_NOTICE_BLOCKS,
  STATIC_NOTICE_INTRO,
  STATIC_NOTICE_VERSION,
} from "@/lib/content/notice-static";
import { progress, countAll } from "@/lib/progress";

// The workbook as it runs with no server: the notice first, then the workbook itself.
//
// There is no sign-in step because there is no account, so the entry screen is a notice
// and a single button rather than an email form.

export default function StaticWorkbook() {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <WorkbookView
        preview
        initialWorkbook={{}}
        initialProgress={progress(countAll({}))}
        settings={{
          email: "",
          shareWithFacilitators: false,
          purgeAfter: new Date().toISOString(),
        }}
      />
    );
  }

  return (
    <main>
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <h1 className="text-3xl font-black leading-tight tracking-tight text-gray-900 md:text-4xl">
            DPDP Implementation Workshop
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-gray-600">
            Cohort 1. Saturday 26 September 2026. This is your workbook for the
            day, and it is yours to take away.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-lg border border-green-200 bg-green-50 p-5">
          <p className="text-[15px] font-semibold text-green-900">
            Nothing you type here leaves your browser.
          </p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-green-800">
            There is no account and no server. Your answers are saved on this
            device only, and the download is built in your browser from what is
            already on it.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary mt-6 w-full sm:w-auto"
          onClick={() => setStarted(true)}
        >
          Open the workbook
        </button>

        <section className="mt-14">
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3">
            <h2 className="text-xl font-bold text-gray-900">Notice</h2>
            <span className="cite">Version {STATIC_NOTICE_VERSION}</span>
          </div>

          {STATIC_NOTICE_INTRO.map((p, i) => (
            <p key={i} className="mb-3 text-[15px] leading-relaxed text-gray-700">
              {p}
            </p>
          ))}

          <div className="mt-8 space-y-4">
            {STATIC_NOTICE_BLOCKS.map((block) => (
              <div key={block.heading} className="card p-5">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-gray-900">
                    {block.heading}
                  </h3>
                  {block.satisfies && (
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-500">
                      {block.satisfies}
                    </span>
                  )}
                </div>
                {block.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="mb-2.5 text-[14px] leading-relaxed text-gray-600 last:mb-0"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
