
import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  SearchCode,
  ShieldAlert,
} from "lucide-react";
import aiService from "../services/ai";
import type { CodeAnalysisResponse } from "../types/api";

const languages = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "Go",
  "Rust",
];

export default function AnalysisWorkspace() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<CodeAnalysisResponse | null>(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      setError("Please enter code to analyze.");
      return;
    }

    setError("");
    setAnalysis(null);
    setIsAnalyzing(true);

    try {
      const response = await aiService.analyzeCode({
        code: code.trim(),
        language,
      });

      setAnalysis(response);
    } catch {
      setError("Analysis failed. Check your backend connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b16] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-cyan-400">
            <SearchCode size={20} />
            <span className="text-sm font-medium">Static Code Analysis</span>
          </div>

          <h1 className="text-3xl font-bold">Code Quality Analyzer</h1>
          <p className="mt-2 text-slate-400">
            Identify code issues and discover opportunities to improve quality.
          </p>
        </div>

        <form
          onSubmit={handleAnalyze}
          className="rounded-2xl border border-white/10 bg-[#111629] p-6"
        >
          <label htmlFor="language" className="mb-2 block text-sm text-slate-300">
            Programming language
          </label>

          <select
            id="language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="mb-6 w-full rounded-lg border border-white/10 bg-[#080b16] px-4 py-3 text-sm outline-none focus:border-violet-500 sm:max-w-xs"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor="code" className="mb-2 block text-sm text-slate-300">
            Source code
          </label>

          <textarea
            id="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Paste your source code here..."
            rows={12}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-white/10 bg-[#080b16] p-4 font-mono text-sm leading-6 text-emerald-300 outline-none placeholder:text-slate-600 focus:border-violet-500"
          />

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isAnalyzing}
            className="mt-5 flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <SearchCode size={18} />
                Analyze code
              </>
            )}
          </button>
        </form>

        {analysis && (
          <section className="mt-6 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-[#111629] p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Analysis score</h2>
                <span className="text-2xl font-bold text-violet-400">
                  {typeof analysis.score === "number"
                    ? `${analysis.score}/100`
                    : "Not provided"}
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, analysis.score ?? 0))}%`,
                  }}
                />
              </div>

              {analysis.summary && (
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {analysis.summary}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111629] p-6">
              <h2 className="mb-5 font-semibold">
                Findings ({analysis.issues?.length ?? 0})
              </h2>

              {analysis.issues?.length ? (
                <div className="space-y-3">
                  {analysis.issues.map((issue, index) => (
                    <div
                      key={`${issue.line}-${issue.rule ?? index}`}
                      className="flex gap-3 rounded-lg border border-white/10 bg-[#080b16] p-4"
                    >
                      {issue.severity === "error" ? (
                        <ShieldAlert className="shrink-0 text-red-400" size={19} />
                      ) : issue.severity === "warning" ? (
                        <AlertCircle className="shrink-0 text-amber-400" size={19} />
                      ) : (
                        <CheckCircle2 className="shrink-0 text-cyan-400" size={19} />
                      )}

                      <div>
                        <p className="text-sm text-slate-200">
                          {issue.message}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Line {issue.line} · {issue.severity}
                          {issue.rule ? ` · ${issue.rule}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No issues were returned by the analyzer.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
            }
