
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import "../styles/severity-badge.css";

export type IssueSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info";

interface SeverityBadgeProps {
  severity?: string;
}

const severityConfig = {
  critical: {
    label: "Critical",
    className: "severity-critical",
    icon: ShieldAlert,
  },
  high: {
    label: "High",
    className: "severity-high",
    icon: AlertCircle,
  },
  medium: {
    label: "Medium",
    className: "severity-medium",
    icon: AlertTriangle,
  },
  low: {
    label: "Low",
    className: "severity-low",
    icon: Info,
  },
  info: {
    label: "Info",
    className: "severity-info",
    icon: CheckCircle2,
  },
};

export default function SeverityBadge({
  severity = "info",
}: SeverityBadgeProps) {
  const normalizedSeverity = severity.toLowerCase().trim();

  const config =
    severityConfig[
      normalizedSeverity as IssueSeverity
    ] ?? severityConfig.info;

  const SeverityIcon = config.icon;

  return (
    <span
      className={`severity-badge ${config.className}`}
      aria-label={`Severity: ${config.label}`}
    >
      <SeverityIcon size={14} />
      {config.label}
    </span>
  );
}
