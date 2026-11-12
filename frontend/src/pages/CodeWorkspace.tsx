
import { useState, type FormEvent } from "react";
import {
  Code2,
  Copy,
  Loader2,
  Sparkles,
  WandSparkles,
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

export default function CodeWorkspace() {
  const [language, setLanguage] = useState("Python");
  const [instructions, setInstructions] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!instructions.trim()) {
      setError("Please describe the code you want to generate.");
      return;
    }

    setError("");
    setResult("");
    setIsGenerating(true);

    try {
      const response = await aiService.generateCode({
        code: "",
        language,
        instructions: instructions.trim(),
      });

      setResult(response.result);
    } catch {
      setError("Code generation failed. Check your backend connection and AI configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
    } catch {
      setError("Unable to copy the generated code.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080b16] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-violet-400">
            <Sparkles size={20} />
            <span className="text-sm font-medium">AI Development Tool</span>
          </div>

          <h1 className="text-3xl font-bold">AI Code Generator</h1>
          <p className="mt-2 text-slate-400">
            Describe what you want to build and let DevMind AI generate the code.
          </p>
        </div>

        <form
          onSubmit={handleGenerate}
          className="rounded-2xl border border-white/10 bg-[#111629] p-6"
        >
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Programming language
          </label>

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="mb-6 w-full rounded-lg border border-white/10 bg-[#080b16] px-4 py-3 text-sm text-white outline-none focus:border-violet-500 sm:max-w-xs"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label
            htmlFor="instructions"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Describe your code
          </label>

          <textarea
            id="instructions"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Example: Create a Python REST API with user registration, login, and JWT authentication..."
            rows={7}
            className="w-full resize-y rounded-lg border border-white/10 bg-[#080b16] p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
          />

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="mt-5 flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <WandSparkles size={18} />
                Generate code
              </>
            )}
          </button>
        </form>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#111629]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-violet-400" />
              <h2 className="font-semibold">Generated output</h2>
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

          <pre className="min-h-64 overflow-x-auto whitespace-pre-wrap p-5 text-sm leading-6 text-emerald-300">
            {result || "// Your generated code will appear here."}
          </pre>
        </section>
      </div>
    </div>
  );
                }
