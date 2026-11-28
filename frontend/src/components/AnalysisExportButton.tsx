
import { Download } from "lucide-react";

import { exportAnalysisReport } from "../utils/exportAnalysis";
import type { FilterableIssue } from "../utils/filterIssues";
import type { AnalysisRecommendation } from "../utils/analysisRecommendations";

import "../styles/analysis-export.css";

interface AnalysisExportButtonProps {
  language: string;
  issues: FilterableIssue[];
  score?: number;
  summary?: string;
  recommendations?: AnalysisRecommendation[];
  disabled?: boolean;
}

export default function AnalysisExportButton({
  language,
  issues,
  score,
  summary,
  recommendations = [],
  disabled = false,
}: AnalysisExportButtonProps) {
  const hasExportData =
    issues.length > 0 ||
    recommendations.length > 0 ||
    typeof score === "number" ||
    Boolean(summary?.trim());

  const isDisabled = disabled || !hasExportData;

  const handleExport = () => {
    if (isDisabled) {
      return;
    }

    exportAnalysisReport({
      language,
      issues,
      score,
      summary,
      recommendations,
    });
  };

  return (
    <button
      type="button"
      className="btn btn-secondary analysis-export-button"
      onClick={handleExport}
      disabled={isDisabled}
      aria-label="Export analysis report as a CSV file"
      title={
        isDisabled
          ? "There is no analysis data available to export."
          : "Download the analysis report as CSV"
      }
    >
      <Download size={17} aria-hidden="true" />
      Export CSV Report
    </button>
  );
}
