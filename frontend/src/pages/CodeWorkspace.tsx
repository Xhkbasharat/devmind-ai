
import { useState, type FormEvent } from "react";
import { Sparkles, WandSparkles } from "lucide-react";

import CodeEditor from "../components/CodeEditor";
import CodeOutput from "../components/CodeOutput";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

import aiService from "../services/ai";
import { getErrorMessage } from "../services/error";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function CodeWorkspace() {
  useDocumentTitle("AI Code Generator");

  const [language, setLanguage] = useState("python");
  const [instructions, setInstructions] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setGeneratedCode("");

    if (!instructions.trim()) {
      setError("Please describe the code you want to generate.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await aiService.generateCode({
        code: "",
        language,
        instructions: instructions.trim(),
      });

      setGeneratedCode(response.result);
    } catch (err) {
      setError(
        getErrorMessage(err, "Code generation failed. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Code Generator"
        description="Transform your instructions into code using AI assistance."
      />

      {error && (
        <AlertMessage
          type="error"
          title="Generation failed"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <form onSubmit={handleGenerate} className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-[#101626] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
              <WandSparkles size={23} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Describe your idea
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Explain what you want the AI to build.
              </p>
            </div>
          </div>

          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Example: Create a Python function that sorts a list using merge sort and explains its time complexity."
            rows={5}
            maxLength={10000}
            className="w-full resize-y rounded-xl border border-slate-700 bg-[#080b16] p-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
          />

          <div className="mt-2 text-right text-xs text-slate-500">
            {instructions.length.toLocaleString()} / 10,000 characters
          </div>
        </section>

        <section className="space-y-4">
          <CodeEditor
            code=""
            language={language}
            onChange={() => undefined}
            onLanguageChange={setLanguage}
            readOnly
            placeholder="Select a programming language above. Your generated code will appear below."
            minHeight={100}
          />
        </section>

        <button
          type="submit"
          disabled={isLoading || !instructions.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <Sparkles size={19} />
          {isLoading ? "Generating code..." : "Generate code"}
        </button>
      </form>

      {isLoading && (
        <LoadingSpinner message="DevMind AI is generating your code..." />
      )}

      {!isLoading && generatedCode && (
        <CodeOutput
          code={generatedCode}
          language={language}
          title="AI Generated Code"
        />
      )}
    </div>
  );
}
