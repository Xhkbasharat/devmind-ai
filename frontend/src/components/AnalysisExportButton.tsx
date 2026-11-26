
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
    exportAnalysisReport({
      language,
      issues,
      score,
      summary,
    });
  };

  return (
    <button
      type="button"
      className="btn btn-secondary analysis-export-button"
      onClick={handleExport}
      disabled={disabled}
    >
      <Download size={17} />
      Export CSV Report
    </button>
  );
}
