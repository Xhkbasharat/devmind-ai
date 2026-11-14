
import { useState } from "react";
import { BarChart3, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import CodeEditor from "../components/CodeEditor";
import CodeFileUpload from "../components/CodeFileUpload";
import aiService from "../services/ai";
import { getErrorMessage } from "../services/error";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { calculateCodeMetrics } from "../utils/codeMetrics";
import { analyzeComplexity } from "../utils/complexity";

interface AnalysisIssue {
  severity: string;
  message: string;
  description?: string;
  line?: number;
  rule?: string;
}

interface AnalysisResult {
  score: number;
  summary: string;
  issues: AnalysisIssue[];
}

export default function AnalysisWorkspace() {
  useDocumentTitle("Code Analyzer");

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const metrics = calculateCodeMetrics(code, language);
  const complexity = analyzeComplexity(code, language);

  const handleFileRead = (
    fileCode: string,
    fileLanguage: string
  ) => {
    setCode(fileCode);
    setLanguage(fileLanguage);
    setResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please enter or upload code to analyze.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await aiService.analyzeCode({
        code,
        language,
      });

      setResult({
        score: response.score,
        summary: response.summary,
        issues: response.issues,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="workspace-page">
      <PageHeader
        title="AI Code Analyzer"
        description="Inspect code quality, identify potential issues, and review improvement suggestions."
        icon={<BarChart3 size={24} />}
      />

      <CodeFileUpload onFileRead={handleFileRead} />

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <div className="workspace-grid">
        <section className="workspace-panel">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            label="Code to analyze"
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
              <Sparkles size={18} />
            )}
            {isLoading ? "Analyzing..." : "Analyze Code"}
          </button>
        </section>

        <section className="workspace-panel">
          {code.trim() && (
            <div className="analysis-metrics">
              <h3>Code Metrics</h3>

              <div className="analysis-metric-grid">
                <div className="analysis-metric">
                  <strong>{metrics.totalLines}</strong>
                  <span>Total Lines</span>
                </div>

                <div className="analysis-metric">
                  <strong>{metrics.nonEmptyLines}</strong>
                  <span>Non-empty Lines</span>
                </div>

                <div className="analysis-metric">
                  <strong>{metrics.commentLines}</strong>
                  <span>Comment Lines</span>
                </div>

                <div className="analysis-metric">
                  <strong>{metrics.words}</strong>
                  <span>Words</span>
                </div>
              </div>

              <h3>Complexity Estimate</h3>

              <div className="analysis-complexity">
                <strong>
                  {complexity.level} ({complexity.score}/100)
                </strong>
                <p>{complexity.explanation}</p>
                <p>
                  Functions: {complexity.functionCount} ·
                  Conditionals: {complexity.conditionalCount} ·
                  Loops: {complexity.loopCount} ·
                  Nesting depth: {complexity.nestingDepth}
                </p>
              </div>
            </div>
          )}

          {result ? (
            <div className="analysis-results">
              <h3>AI Analysis Results</h3>

              <div className="analysis-score">
                <span className="analysis-score-value">
                  {result.score}
                </span>
                <span>Quality Score</span>
              </div>

              <p>{result.summary}</p>

              <h4>Detected Issues ({result.issues.length})</h4>

              {result.issues.length === 0 ? (
                <p>No issues were detected.</p>
              ) : (
                <div className="analysis-issues">
                  {result.issues.map((issue, index) => (
                    <article
                      className="analysis-issue"
                      key={`${issue.rule ?? "issue"}-${index}`}
                    >
                      <strong>
                        {issue.severity}: {issue.message}
                      </strong>

                      {issue.description && (
                        <p>{issue.description}</p>
                      )}

                      {issue.line !== undefined && (
                        <span>Line {issue.line}</span>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="workspace-placeholder">
              <BarChart3 size={32} />
              <h3>Your AI analysis will appear here</h3>
              <p>
                Enter or upload code, then run the analyzer to
                receive an AI quality review.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
