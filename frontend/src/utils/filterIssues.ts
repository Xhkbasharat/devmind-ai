
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

export function filterIssues<T extends FilterableIssue>(
  issues: T[],
  filters: IssueFilters
): T[] {
  const searchTerm = filters.search.trim().toLowerCase();

  return issues.filter((issue) => {
    const issueSeverity =
      issue.severity?.toLowerCase().trim() || "info";

    const matchesSeverity =
      filters.severity === "all" ||
      issueSeverity === filters.severity;

    const searchableText = [
      issue.type,
      issue.severity,
      issue.message,
      issue.description,
      issue.line?.toString(),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchTerm || searchableText.includes(searchTerm);

    return matchesSeverity && matchesSearch;
  });
}
