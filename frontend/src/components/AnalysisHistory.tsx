
import {
  History,
  Trash2,
  RotateCcw,
  FileCode2,
} from "lucide-react";

import type { AnalysisHistoryItem } from "../hooks/useAnalysisHistory";
import SeverityBadge from "./SeverityBadge";

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onRestore: (item: AnalysisHistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function AnalysisHistory({
  history,
  onRestore,
  onRemove,
  onClear,
}: AnalysisHistoryProps) {
  if (history.length === 0) {
    return (
      <section className="workspace-panel">
        <div className="workspace-placeholder">
          <History size={28} />
          <h3>No Analysis History</h3>
          <p>Your previous code analysis reports will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="workspace-panel analysis-history">
      <div className="history-header">
        <h3>
          <History size={20} />
          Analysis History
        </h3>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClear}
        >
          <Trash2 size={16} />
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
                <FileCode2 size={18} />
                <strong>{item.language}</strong>
              </div>

              <p>
                {item.summary || "Code analysis report"}
              </p>

              <div className="analysis-history-meta">
                {typeof item.score === "number" && (
                  <span>Score: {item.score}/100</span>
                )}

                <span>
                  {item.issues.length} findings
                </span>

                <span>
                  {new Date(item.createdAt).toLocaleString()}
                </span>
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
              >
                <RotateCcw size={15} />
                Restore
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onRemove(item.id)}
                aria-label="Delete analysis history entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
