
import {
  History,
  Trash2,
  RotateCcw,
  FileCode2,
} from "lucide-react";

import type { AnalysisHistoryItem } from "../hooks/useAnalysisHistory";
import SeverityBadge from "./SeverityBadge";

import "../styles/analysis-history.css";

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onRestore: (item: AnalysisHistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString();
}

export default function AnalysisHistory({
  history,
  onRestore,
  onRemove,
  onClear,
}: AnalysisHistoryProps) {
  const handleClear = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all analysis history?"
      )
    ) {
      onClear();
    }
  };

  const handleRemove = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this analysis report?"
      )
    ) {
      onRemove(id);
    }
  };

  if (history.length === 0) {
    return (
      <section
        className="workspace-panel analysis-history"
        aria-labelledby="analysis-history-title"
      >
        <div className="workspace-placeholder">
          <History size={28} aria-hidden="true" />
          <h3 id="analysis-history-title">
            No Analysis History
          </h3>
          <p>
            Your previous code analysis reports will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="workspace-panel analysis-history"
      aria-labelledby="analysis-history-title"
    >
      <div className="history-header">
        <h3 id="analysis-history-title">
          <History size={20} aria-hidden="true" />
          Analysis History
        </h3>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClear}
          aria-label="Clear all analysis history"
        >
          <Trash2 size={16} aria-hidden="true" />
          Clear History
        </button>
      </div>

      <div className="analysis-history-list">
        {history.map((item) => (
          <article
            className="analysis-history-item"
            key={item.id}
          >
            <div className="analysis-history-info">
              <div className="analysis-history-title">
                <FileCode2 size={18} aria-hidden="true" />
                <strong>{item.language}</strong>
              </div>

              <p>
                {item.summary || "Code analysis report"}
              </p>

              <div className="analysis-history-meta">
                {typeof item.score === "number" &&
                  Number.isFinite(item.score) && (
                    <span>
                      Score: {Math.round(item.score)}/100
                    </span>
                  )}

                <span>
                  {item.issues.length} findings
                </span>

                <span>{formatDate(item.createdAt)}</span>
              </div>

              {item.issues.length > 0 && (
                <div className="analysis-history-severities">
                  {Array.from(
                    new Set(
                      item.issues.map(
                        (issue) => issue.severity || "info"
                      )
                    )
                  ).map((severity) => (
                    <SeverityBadge
                      key={severity}
                      severity={severity}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="analysis-history-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onRestore(item)}
                aria-label={`Restore ${item.language} analysis`}
              >
                <RotateCcw size={15} aria-hidden="true" />
                Restore
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleRemove(item.id)}
                aria-label={`Delete ${item.language} analysis`}
                title="Delete this analysis"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
