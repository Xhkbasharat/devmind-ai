

import {
  Award,
  BookOpen,
  Gauge,
  Layers,
  Wrench,
} from "lucide-react";

import { calculateQualityScore } from "../utils/qualityScore";
import "../styles/quality-score.css";

interface QualityScoreCardProps {
  code: string;
}

interface ScoreMetricProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function ScoreMetric({
  label,
  value,
  icon,
}: ScoreMetricProps) {
  const safeValue = Math.max(
    0,
    Math.min(100, Math.round(value))
  );

  return (
    <div className="quality-metric">
      <div className="quality-metric-header">
        <span className="quality-metric-label">
          {icon}
          {label}
        </span>

        <strong>{safeValue}/100</strong>
      </div>

      <div
        className="quality-progress-track"
        role="progressbar"
        aria-label={`${label} score`}
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="quality-progress-fill"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

export default function QualityScoreCard({
  code,
}: QualityScoreCardProps) {
  const score = calculateQualityScore(code);

  return (
    <section
      className="workspace-panel quality-score-card"
      aria-labelledby="quality-score-title"
    >
      <div className="quality-score-heading">
        <div>
          <h3 id="quality-score-title">
            <Award size={20} />
            Code Quality Score
          </h3>

          <p>{score.summary}</p>
        </div>

        <div
          className="quality-grade"
          aria-label={`Overall grade ${score.grade}, score ${score.overall} out of 100`}
        >
          <strong>{score.grade}</strong>
          <span>{score.overall}/100</span>
        </div>
      </div>

      {score.grade === "N/A" ? (
        <p>Add code to see its estimated quality score.</p>
      ) : (
        <div className="quality-metrics">
          <ScoreMetric
            label="Maintainability"
            value={score.maintainability}
            icon={<Wrench size={16} />}
          />

          <ScoreMetric
            label="Readability"
            value={score.readability}
            icon={<BookOpen size={16} />}
          />

          <ScoreMetric
            label="Complexity"
            value={score.complexity}
            icon={<Gauge size={16} />}
          />

          <ScoreMetric
            label="Documentation"
            value={score.documentation}
            icon={<Layers size={16} />}
          />
        </div>
      )}

      <small className="quality-score-note">
        Scores are heuristic estimates, not verified security,
        correctness, or machine-learning predictions.
      </small>
    </section>
  );
}
