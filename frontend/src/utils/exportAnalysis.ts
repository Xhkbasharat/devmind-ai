
import type { FilterableIssue } from "./filterIssues";

interface AnalysisExportData {
  language: string;
  score?: number;
  summary?: string;
  issues: FilterableIssue[];
}

function escapeCsvValue(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportAnalysisReport(
  data: AnalysisExportData
): void {
  const headers = [
    "Programming Language",
    "Overall Score",
    "Summary",
    "Issue Type",
    "Severity",
    "Description",
    "Line",
  ];

  const rows = data.issues.length
    ? data.issues.map((issue) => [
        data.language,
        data.score ?? "",
        data.summary ?? "",
        issue.type ?? "Finding",
        issue.severity ?? "info",
        issue.message ?? issue.description ?? "",
        issue.line ?? "",
      ])
    : [[
        data.language,
        data.score ?? "",
        data.summary ?? "",
        "No findings",
        "",
        "",
        "",
      ]];

  const csv = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      row.map(escapeCsvValue).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(
    ["\uFEFF", csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

  link.href = url;
  link.download = `devmind-analysis-${timestamp}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
