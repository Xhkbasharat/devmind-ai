
import type { FilterableIssue } from "./filterIssues";

export interface AnalysisStatistics {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  unresolved: number;
}

export function calculateAnalysisStatistics(
  issues: FilterableIssue[]
): AnalysisStatistics {
  const statistics: AnalysisStatistics = {
    total: issues.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
    unresolved: 0,
  };

  for (const issue of issues) {
    const severity =
      issue.severity?.toLowerCase().trim() || "info";

    switch (severity) {
      case "critical":
        statistics.critical++;
        statistics.unresolved++;
        break;

      case "high":
        statistics.high++;
        statistics.unresolved++;
        break;

      case "medium":
        statistics.medium++;
        break;

      case "low":
        statistics.low++;
        break;

      case "info":
      case "informational":
        statistics.info++;
        break;

      default:
        statistics.info++;
        break;
    }
  }

  return statistics;
}
