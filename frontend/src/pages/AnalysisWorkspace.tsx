
import { useState, type FormEvent } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  SearchCode,
  Sparkles,
} from "lucide-react";

import CodeEditor from "../components/CodeEditor";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

import aiService from "../services/ai";
import { getErrorMessage } from "../services/error";
import useDocumentTitle from "../hooks/useDocumentTitle";

interface AnalysisIssue {
  severity?: string;
  message?: string;
  description?: string;
  line?: number;
  rule?: string;
}

export default function AnalysisWorkspace() {
  useDocumentTitle("Code Quality Analyzer");

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [summary, setSummary] = useState("");
  const [issues, setIssues] = useState<AnalysisIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setScore(null);
    setSummary("");
    setIssues([]);

    if (!code.trim()) {
      setError("Please enter code to analyze.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await aiService.analyzeCode({
        code: code.trim(),
        language,
      });

      setScore(
        typeof response.score === "number"
          ? Math.max(0, Math.min(100, response.score))
          : null
      );

      setSummary(response.summary || "Analysis completed.");

      setIssues(
        Array.isArray(response.issues) ? response.issues : []
      );
    } catch (err) {
      setError(
        getErrorMessage(err, "Code analysis failed. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityClass = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
      case "critical":
      case "error":
        return "border-red-500/30 bg-red-500/10 text-red-300";

      case "medium":
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";

      default:
        return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Code Quality Analyzer"
        description="Inspect your source code and identify potential quality issues and improvements."
      />

      {error && (
        <AlertMessage
          type="error"
          title="Analysis failed"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <form onSubmit={handleAnalyze} className="space-y-6">
        <CodeEditor
          code={code}
          language={language}
          onChange={setCode}
          onLanguageChange={setLanguage}
          placeholder="Paste your source code here for quality analysis..."
          minHeight={350}
        />

        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <SearchCode size={19} />
          {isLoading ? "Analyzing..." : "Analyze code"}
        </button>
      </form>

      {isLoading && (
        <LoadingSpinner message="DevMind AI is examining code quality and detecting potential issues..." />
      )}

      {!isLoading && score !== null && (
        <section className="rounded-2xl border border-slate-800 bg-[#101626] p-6">
          <div className="flex items-center gap-3">
            <Activity size={22} className="text-violet-400" />
            <h2 className="text-lg font-semibold text-white">
              Quality Score
            </h2>
          </div>

          <div className="mt-6 flex items-end gap-2">
            <span className="text-5xl font-bold text-violet-400">
              {score}
            </span>
            <span className="mb-1 text-slate-500">/ 100</span>
          </div>

          <div
            className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800"
            role="progressbar"
            aria-label="Code quality score"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${score}%` }}
            />
          </div>

          <p className="mt-5 leading-7 text-slate-300">
            {summary}
          </p>
        </section>
      )}

      {!isLoading && summary && score === null && (
        <section className="rounded-2xl border border-slate-800 bg-[#101626] p-6">
          <div className="flex items-center gap-3">
            <Sparkles size={21} className="text-violet-400" />
            <h2 className="font-semibold text-white">
              Analysis Summary
            </h2>
          </div>
          <p className="mt-4 leading-7 text-slate-300">{summary}</p>
        </section>
      )}

      {!isLoading && issues.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Detected Issues
            </h2>
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
              {issues.length} issues
            </span>
          </div>

          <div className="space-y-3">
            {issues.map((issue, index) => (
              <article
                key={`${issue.rule || "issue"}-${issue.line ?? index}-${index}`}
                className="rounded-xl border border-slate-800 bg-[#101626] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      size={18}
                      className="text-yellow-400"
                    />
                    <h3 className="font-semibold text-white">
                      {issue.rule || `Issue ${index + 1}`}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${getSeverityClass(issue.severity)}`}
                  >
                    {issue.severity || "Information"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {issue.message || issue.description || "No description provided."}
                </p>

                {typeof issue.line === "number" && (
                  <p className="mt-3 text-xs text-slate-500">
                    Line {issue.line}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {!isLoading && summary && issues.length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300">
          <CheckCircle2 size={20} />
          No issues were returned by the analyzer.
        </div>
      )}
    </div>
  );
}
