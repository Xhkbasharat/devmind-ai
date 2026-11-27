
import { Download } from "lucide-react";

import { exportAnalysisReport } from "../utils/exportAnalysis";
import type { FilterableIssue } from "../utils/filterIssues";

import "../styles/analysis-export.css";

interface AnalysisExportButtonProps {
  language: string;
  issues: FilterableIssue[];
  score?: number;
  summary?: string;
  disabled?: boolean;
}

export default function AnalysisExportButton({
  language,
  issues,
  score,
  summary,
  disabled = false,
}: AnalysisExportButtonProps) {
  const handleExport = () => {
    if (disabled || issues.length === 0) {
      return;
    }

    exportAnalysisReport({
      language,
      issues,
      score,
      summary,
    });
  };

  const isDisabled = disabled || issues.length === 0;

  return (
    <button
      type="button"
      className="btn btn-secondary analysis-export-button"
      onClick={handleExport}
      disabled={isDisabled}
      aria-label="Export analysis findings as a CSV report"
      title={
        isDisabled
          ? "There are no findings available to export."
          : "Download analysis findings as CSV"
      }
    >
      <Download size={17} aria-hidden="true" />
      Export CSV Report
    </button>
  );
}
