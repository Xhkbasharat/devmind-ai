
import { useState, type FormEvent } from "react";
import {
  Bug,
  CheckCircle2,
  Copy,
  Loader2,
  Sparkles,
  Wrench,
} from "lucide-react";
import aiService from "../services/ai";

const languages = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "Go",
  "Rust",
];

export default function DebugWorkspace() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isDebugging, setIsDebugging] = useState(false);

  const handleDebug = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      setError("Please enter some code to debug.");
      return;
    }

    setError("");
    setResult("");
    setIsDebugging(true);

    try {
      const response = await aiService.debugCode({
        code: code.trim(),
        language,
      });

      setResult(response.result);
    } catch {
      setError("Debugging failed. Check your backend connection and AI configuration.");
    } finally {
      setIsDebugging(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
    } catch {
      setError("Unable to copy the debugging result.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080b16] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-red-400">
            <Bug size={20} />
            <span className="text-sm font-medium">AI Debugging Tool</span>
          </div>

          <h1 className="text-3xl font-bold">AI Code Debugger</h1>
          <p className="mt-2 text-slate-400">
            Find errors, understand their causes, and get suggested fixes.
          </p>
        </div>

        <form
          onSubmit={handleDebug}
          className="rounded-2xl border border-white/10 bg-[#111629] p-6"
        >
          <label
            htmlFor="language"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
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

          <label
            htmlFor="code"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Paste your code
          </label>

          <textarea
            id="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Paste the code you want DevMind AI to debug..."
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
            disabled={isDebugging}
            className="mt-5 flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDebugging ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing code...
              </>
            ) : (
              <>
                <Wrench size={18} />
                Debug my code
              </>
            )}
          </button>
        </form>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#111629]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              {result ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : (
                <Sparkles size={18} className="text-violet-400" />
              )}
              <h2 className="font-semibold">Debugging results</h2>
            </div>

            <button
              type="button"
              onClick={copyResult}
              disabled={!result}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Copy size={15} />
              Copy
            </button>
          </div>

          <pre className="min-h-64 overflow-x-auto whitespace-pre-wrap p-5 text-sm leading-6 text-slate-300">
            {result || "// Debugging results will appear here."}
          </pre>
        </section>
      </div>
    </div>
  );
          }
