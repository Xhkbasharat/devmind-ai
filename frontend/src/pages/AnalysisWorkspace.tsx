
import { useState } from "react";
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import CodeEditor from "../components/CodeEditor";
import CodeFileUpload from "../components/CodeFileUpload";
import QualityScoreCard from "../components/QualityScoreCard";
import AnalysisSummary from "../components/AnalysisSummary";
import SeverityBadge from "../components/SeverityBadge";
import AnalysisExportButton from "../components/AnalysisExportButton";

import aiService from "../services/ai";
import { getErrorMessage } from "../services/error";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { calculateCodeMetrics } from "../utils/codeMetrics";
import { analyzeComplexity } from "../utils/complexity";
import { validateCodeInput } from "../utils/codeValidation";
import { filterIssues } from "../utils/filterIssues";
import type { SeverityFilter } from "../utils/filterIssues";

interface AnalysisIssue {
  type?: string;
  severity?: string;
  message?: string;
  line?: number;
  description?: string;
}

interface AnalysisResult {
  score?: number;
  summary?: string;
  issues?: AnalysisIssue[];
}

export default function AnalysisWorkspace() {
  useDocumentTitle("Code Analyzer");

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [severityFilter, setSeverityFilter] =
    useState<SeverityFilter>("all");

  const [issueSearch, setIssueSearch] = useState("");

  const metrics = calculateCodeMetrics(code, language);
  const complexity = analyzeComplexity(code, language);

  const filteredIssues = filterIssues(
    result?.issues ?? [],
    {
      severity: severityFilter,
      search: issueSearch,
    }
  );

  const handleAnalyze = async () => {
    const validation = validateCodeInput(code);

    if (!validation.valid) {
      setError(validation.error ?? "Invalid code input.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);
    setSeverityFilter("all");
    setIssueSearch("");

    try {
      const response = await aiService.analyzeCode({
        code,
        language,
      });

      setResult(response as AnalysisResult);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileRead = (
    fileCode: string,
    fileLanguage: string
  ) => {
    setCode(fileCode);
    setLanguage(fileLanguage);
    setResult(null);
    setError("");
    setSeverityFilter("all");
    setIssueSearch("");
  };

  const summaryStatus =
    result?.issues?.some((issue) => {
      const severity = issue.severity?.toLowerCase();

      return severity === "high" || severity === "critical";
    })
      ? "warning"
      : result?.issues?.length
        ? "info"
        : "success";

  return (
    <div className="workspace-page">
      <PageHeader
        title="Code Analyzer"
        description="Inspect code metrics, complexity, potential issues, and estimated quality."
        icon={<BarChart3 size={24} />}
      />

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <section className="workspace-panel">
        <CodeFileUpload onFileRead={handleFileRead} />

        <CodeEditor
          value={code}
          onChange={(value) => {
            setCode(value);
            setResult(null);
          }}
          language={language}
          onLanguageChange={(value) => {
            setLanguage(value);
            setResult(null);
          }}
          label="Source code"
        />

        <button
          type="button"
          className="btn btn-primary workspace-action"
          onClick={handleAnalyze}
          disabled={isLoading || !code.trim()}
        >
          {isLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <BarChart3 size={18} />
          )}
          {isLoading ? "Analyzing..." : "Analyze Code"}
        </button>
      </section>

      {code.trim() && (
        <>
          <QualityScoreCard code={code} />

          <section className="workspace-panel">
            <h3>Code Metrics</h3>

            <div className="metrics-grid">
              <div className="metric-card">
                <strong>{metrics.totalLines}</strong>
                <span>Total Lines</span>
              </div>

              <div className="metric-card">
                <strong>{metrics.codeLines}</strong>
                <span>Code Lines</span>
              </div>

              <div className="metric-card">
                <strong>{metrics.commentLines}</strong>
                <span>Comment Lines</span>
              </div>

              <div className="metric-card">
                <strong>{metrics.blankLines}</strong>
                <span>Blank Lines</span>
              </div>
            </div>
          </section>

          <section className="workspace-panel">
            <h3>Complexity Analysis</h3>

            <div className="complexity-summary">
              <strong>{complexity.level}</strong>
              <span>Complexity score: {complexity.score}</span>
            </div>

            <p>{complexity.explanation}</p>

            <div className="metrics-grid">
              <div className="metric-card">
                <strong>{complexity.functionCount}</strong>
                <span>Functions</span>
              </div>

              <div className="metric-card">
                <strong>{complexity.conditionalCount}</strong>
                <span>Conditionals</span>
              </div>

              <div className="metric-card">
                <strong>{complexity.loopCount}</strong>
                <span>Loops</span>
              </div>

              <div className="metric-card">
                <strong>{complexity.nestingDepth}</strong>
                <span>Nesting Depth</span>
              </div>
            </div>
          </section>
        </>
      )}

      {result && (
        <section className="workspace-panel">
          <div className="analysis-results-header">
            <h3>AI Analysis Results</h3>

            <AnalysisExportButton
              language={language}
              issues={result.issues ?? []}
              score={result.score}
              summary={result.summary}
            />
          </div>

          {result.summary && (
            <AnalysisSummary
              title="Analysis Overview"
              summary={result.summary}
              status={summaryStatus}
              score={result.score}
            />
          )}

          {!result.summary &&
            typeof result.score === "number" && (
              <AnalysisSummary
                title="Analysis Overview"
                summary="The AI analysis has returned a score."
                score={result.score}
              />
            )}

          {result.issues && result.issues.length > 0 ? (
            <>
              <div className="issue-filter-toolbar">
                <div className="history-search">
                  <Search size={16} />
                  <input
                    type="search"
                    value={issueSearch}
                    onChange={(event) =>
                      setIssueSearch(event.target.value)
                    }
                    placeholder="Search analysis findings..."
                    aria-label="Search analysis findings"
                  />
                </div>

                <div className="history-language-filter">
                  <Filter size={16} />

                  <select
                    value={severityFilter}
                    onChange={(event) =>
                      setSeverityFilter(
                        event.target.value as SeverityFilter
                      )
                    }
                    aria-label="Filter findings by severity"
                  >
                    <option value="all">All severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="info">Info</option>
                  </select>
                </div>
              </div>

              <p className="issue-result-count">
                Showing {filteredIssues.length} of{" "}
                {result.issues.length} findings
              </p>

              {filteredIssues.length > 0 ? (
                <div className="analysis-issues">
                  {filteredIssues.map((issue, index) => (
                    <article
                      className="analysis-issue"
                      key={`${issue.line ?? "unknown"}-${index}`}
                    >
                      <div className="analysis-issue-header">
                        <div>
                          <AlertTriangle size={18} />
                          <strong>
                            {issue.type || "Finding"}
                          </strong>
                        </div>

                        <SeverityBadge
                          severity={issue.severity || "info"}
                        />
                      </div>

                      <p>
                        {issue.message ||
                          issue.description ||
                          "No additional details provided."}
                      </p>

                      {typeof issue.line === "number" && (
                        <small>Line {issue.line}</small>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <p>No findings match your filters.</p>
              )}
            </>
          ) : (
            <p>
              <CheckCircle2 size={16} />
              No issues were returned by the AI analysis.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
