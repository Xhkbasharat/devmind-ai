
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  icon,
  description,
  className = "",
}: MetricCardProps) {
  return (
    <div className={`metric-card ${className}`.trim()}>
      {icon && (
        <div className="metric-card-icon">
          {icon}
        </div>
      )}

      <strong>{value}</strong>

      <span>{label}</span>

      {description && (
        <small>{description}</small>
      )}
    </div>
  );
}
