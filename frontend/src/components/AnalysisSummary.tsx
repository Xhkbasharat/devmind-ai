
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Activity,
} from "lucide-react";

import "../styles/analysis-summary.css";

type AnalysisStatus = "success" | "warning" | "info";

interface AnalysisSummaryProps {
  title: string;
  summary: string;
  status?: AnalysisStatus;
  score?: number;
}

const statusConfig = {
  success: {
    label: "Good",
    icon: CheckCircle2,
  },
  warning: {
    label: "Needs attention",
    icon: AlertTriangle,
  },
  info: {
    label: "Information",
    icon: Info,
  },
};

export default function AnalysisSummary({
  title,
  summary,
  status = "info",
  score,
}: AnalysisSummaryProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const safeScore =
    typeof score === "number"
      ? Math.max(0, Math.min(100, score))
      : null;

  return (
    <section
      className={`workspace-panel analysis-summary analysis-summary-${status}`}
      aria-live="polite"
    >
      <div className="analysis-summary-header">
        <div className="analysis-summary-title">
          <Activity size={20} />
          <h3>{title}</h3>
        </div>

        <span className="analysis-summary-status">
          <StatusIcon size={16} />
          {config.label}
        </span>
      </div>

      <p>{summary}</p>

      {safeScore !== null && (
        <div className="analysis-summary-score">
          <span>Analysis Score</span>
          <strong>{safeScore}/100</strong>
        </div>
      )}
    </section>
  );
}
