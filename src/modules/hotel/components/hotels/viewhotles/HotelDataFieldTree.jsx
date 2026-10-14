"use client";

const formatLabel = (value) =>
  String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());

const formatText = (value) =>
  value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

export default function HotelDataFieldTree({ data, depth = 0 }) {
  if (data === null || data === undefined || data === "") {
    return <span className="text-sm text-gray-400">Not provided</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-sm text-gray-400">None provided</span>;
    }

    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-100 bg-white p-3"
          >
            <HotelDataFieldTree data={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data);
    if (entries.length === 0) {
      return <span className="text-sm text-gray-400">No details provided</span>;
    }

    return (
      <dl className="grid gap-2 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className={`min-w-0 rounded-lg bg-white p-3 ${
              depth > 0 ? "border border-gray-100" : ""
            }`}
          >
            <dt className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              {formatLabel(key)}
            </dt>
            <dd className="m-0 break-words text-sm leading-6 text-gray-800">
              <HotelDataFieldTree data={value} depth={depth + 1} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  if (typeof data === "string") {
    const text = formatText(data);
    if (/^https?:\/\/\S+$/i.test(text)) {
      return (
        <a
          href={text}
          target="_blank"
          rel="noreferrer"
          className="break-all text-[var(--theme-primary)] underline"
        >
          {text}
        </a>
      );
    }

    return <span className="whitespace-pre-wrap">{text || "—"}</span>;
  }

  return <span>{String(data)}</span>;
}
