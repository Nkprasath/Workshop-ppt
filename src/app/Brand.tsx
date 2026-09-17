// Shared page furniture, so the workbook, the entry screen and the facilitator view all
// read as the same product rather than three prototypes.

export function Header({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 844.53 1000"
            className="h-8 w-auto shrink-0"
            aria-label="Privacy Labs"
            role="img"
          >
            <path d="M95.26,846.13c-43.3-53.33-80.46-129.64-88.83-197.26C3.51,625.28,0,602.61,0,578.07l.08-259.63.38-166.32,70.8-1.79c67.31-1.7,143.48-18.15,206.66-41.34,52.18-19.15,115.57-57.53,144.6-108.99,9.32,14.93,18.03,27.88,30.25,38.91,33.92,30.59,70.47,53.79,113.96,69.61,59.25,21.56,120.39,38.01,183.78,40.48l94.02,3.67-.11,423.12c-.02,80.08-22.15,154.81-62.92,222.37-90.43,149.84-266.16,227.27-439.19,194.35-96.6-18.38-185.15-70.12-247.06-146.38ZM401.05,331.73c73.87-12.18,145.75,36.53,161.57,108.7,6.98,31.83,2.04,105.09,7.76,108.4,9.52,5.51,34.96-3.27,54.42,15.83,11.37,11.16,16.16,25.95,16.16,43.26l.02,205.37c0,2.44,2.41,7.7,4.07,7,1.25-.53,4.36-2.09,5.38-3.08,38.54-36.98,68.19-81.61,84.28-132.37,9.87-31.13,16.55-58.1,16.56-90.99l.09-333.62c0-6.52.87-12.42-1.54-18.39l-51.35-6.93c-94.21-12.71-190.98-40.16-267.97-96.1-2.83-2.06-6.82-5.14-9.25-5.45-2.43-.31-6.12,3.73-8.8,5.64-73.49,52.26-169.46,83.08-258.79,94.71l-62.45,8.13-.07,333.94c0,34.88,5.87,65.15,15.54,98.23,17.22,58.93,49.7,108.15,95.23,148.77,2.14-6.58,1.5-9.65,1.51-15.35l.16-207.05c.02-26.94,21.05-47.17,46.45-48.57l26.34-1.45c2.97-33.42-3.18-65.3,2.2-97.67,10.49-63.08,58.31-110.37,122.49-120.95ZM330.81,550.92l190.13-.44.56-76.02c.25-33.72-14.03-61.32-41.72-80.39-15.06-10.37-33.41-18.61-53.03-19.45-52.84-2.25-103.25,37.24-103.77,95l-.66,73c-.02,2.57,4.51,8.32,8.49,8.31ZM396.37,798.03c.29,11.75,14.42,19.78,23.12,21.28,8.68,1.49,23.91-2.76,26.18-13.3,7.37-34.24-4.22-59.69,9.56-72.4,24.32-22.43,22.65-58.02-2.65-78.35-22.76-18.29-61.1-12.37-74.82,15.62-8.76,17.88-7.57,38.79,4.3,53.79,3.39,4.29,12.78,11.03,12.92,16.51l1.39,56.85Z" fill="#2563eb" />
          </svg>
          <div className="h-7 w-px bg-gray-200" />
          <div>
            <h1 className="text-[15px] font-bold leading-tight text-gray-900">
              {title}
            </h1>
            {sub && <div className="text-xs text-gray-500">{sub}</div>}
          </div>
        </div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    </header>
  );
}

export function Banner({
  tone = "info",
  children,
}: {
  tone?: "info" | "warn" | "error" | "good";
  children: React.ReactNode;
}) {
  const tones = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-900",
    good: "border-green-200 bg-green-50 text-green-900",
  };
  return (
    <div
      className={`animate-fade-in rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}
    >
      {children}
    </div>
  );
}
