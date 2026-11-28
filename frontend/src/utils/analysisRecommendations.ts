export interface AnalysisRecommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action: string;
}

interface AnalysisIssue {
  severity?: string;
  message?: string;
  description?: string;
  rule?: string;
}

export function generateAnalysisRecommendations(
  issues: AnalysisIssue[]
): AnalysisRecommendation[] {
  const recommendations: AnalysisRecommendation[] = [];

  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const issue of issues) {
    const severity = issue.severity?.toLowerCase();

    if (severity === "critical") counts.critical++;
    else if (severity === "high") counts.high++;
    else if (severity === "medium") counts.medium++;
    else if (severity === "low") counts.low++;
  }

  if (counts.critical > 0) {
    recommendations.push({
      title: "Resolve critical issues first",
      description: `Your analysis found ${counts.critical} critical issue(s). These may indicate serious defects or security risks.`,
      priority: "high",
      action: "Review and fix every critical finding before deployment.",
    });
  }

  if (counts.high > 0) {
    recommendations.push({
      title: "Address high-severity findings",
      description: `There are ${counts.high} high-severity issue(s) that may affect reliability or maintainability.`,
      priority: "high",
      action: "Inspect the affected code and apply appropriate fixes.",
    });
  }

  if (counts.medium > 0) {
    recommendations.push({
      title: "Improve code quality",
      description: `The analysis identified ${counts.medium} medium-severity issue(s).`,
      priority: "medium",
      action: "Refactor affected sections and review the suggested improvements.",
    });
  }

  if (counts.low > 0) {
    recommendations.push({
      title: "Clean up minor issues",
      description: `There are ${counts.low} low-severity finding(s).`,
      priority: "low",
      action: "Address these during routine code cleanup.",
    });
  }

  if (issues.length === 0) {
    recommendations.push({
      title: "Keep up the good work",
      description: "No issues were reported by this analysis.",
      priority: "low",
      action: "Continue following consistent coding and review practices.",
    });
  }

  return recommendations;
}
