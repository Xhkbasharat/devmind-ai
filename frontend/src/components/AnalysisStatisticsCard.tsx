
import {
  Activity,
  ShieldAlert,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

import { calculateAnalysisStatistics } from "../utils/analysisStatistics";
import type { FilterableIssue } from "../utils/filterIssues";

import "../styles/analysis-statistics.css";

interface AnalysisStatisticsCardProps {
  issues: FilterableIssue[];
}

export default function AnalysisStatisticsCard({
  issues,
}: AnalysisStatisticsCardProps) {
  const stats = calculateAnalysisStatistics(issues);

  const cards = [
    {
      label: "Total Findings",
      value: stats.total,
      icon: Activity,
    },
    {
      label: "Critical",
      value: stats.critical,
      icon: ShieldAlert,
    },
    {
      label: "High",
      value: stats.high,
      icon: AlertCircle,
    },
    {
      label: "Medium",
      value: stats.medium,
      icon: AlertTriangle,
    },
    {
      label: "Low",
      value: stats.low,
      icon: Info,
    },
    {
      label: "Informational",
      value: stats.info,
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="workspace-panel analysis-statistics">
      <h3>Analysis Statistics</h3>

      <div className="analysis-statistics-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="analysis-statistics-item"
              key={card.label}
            >
              <div className="analysis-statistics-icon">
                <Icon size={19} />
              </div>

              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </div>
          );
        })}
      </div>

      <div className="analysis-statistics-footer">
        <span>High-priority findings</span>
        <strong>{stats.unresolved}</strong>
      </div>
    </section>
  );
}
