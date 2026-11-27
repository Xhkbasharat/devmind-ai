
export interface FilterableIssue {
  type?: string;
  severity?: string;
  message?: string;
  description?: string;
  line?: number;
}

export type SeverityFilter =
  | "all"
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info";

export interface IssueFilters {
  severity: SeverityFilter;
  search: string;
}

function normalizeSeverity(severity?: string): string {
  const normalized = severity?.toLowerCase().trim() || "info";

  return normalized === "informational"
    ? "info"
    : normalized;
}

export function filterIssues<T extends FilterableIssue>(
  issues: T[],
  filters: IssueFilters
): T[] {
  const searchTerm = filters.search.trim().toLowerCase();

  return issues.filter((issue) => {
    const issueSeverity = normalizeSeverity(issue.severity);

    const matchesSeverity =
      filters.severity === "all" ||
      issueSeverity === filters.severity;

    const searchableText = [
      issue.type,
      issue.severity,
      issue.message,
      issue.description,
      typeof issue.line === "number"
        ? String(issue.line)
        : "",
    ]
      .filter((value) => value != null && value !== "")
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchTerm || searchableText.includes(searchTerm);

    return matchesSeverity && matchesSearch;
  });
}
