
import { useState, type FormEvent } from "react";
import { BookOpen, Sparkles } from "lucide-react";

import CodeEditor from "../components/CodeEditor";
import CodeOutput from "../components/CodeOutput";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

import aiService from "../services/ai";
import { getErrorMessage } from "../services/error";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function ExplainWorkspace() {
  useDocumentTitle("Code Explainer");

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExplain = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setExplanation("");

    if (!code.trim()) {
      setError("Please enter the code you want explained.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await aiService.explainCode({
        code: code.trim(),
        language,
      });

      setExplanation(response.result);
    } catch (err) {
      setError(
        getErrorMessage(err, "Code explanation failed. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Code Explainer"
        description="Understand complex code through clear, structured AI-generated explanations."
      />

      {error && (
        <AlertMessage
          type="error"
          title="Explanation failed"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <form onSubmit={handleExplain} className="space-y-6">
        <CodeEditor
          code={code}
          language={language}
          onChange={setCode}
          onLanguageChange={setLanguage}
          placeholder="Paste the code you want DevMind AI to explain..."
          minHeight={350}
        />

        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <BookOpen size={19} />
          {isLoading ? "Explaining code..." : "Explain my code"}
        </button>
      </form>

      {isLoading && (
        <LoadingSpinner message="DevMind AI is analyzing the code and preparing an explanation..." />
      )}

      {!isLoading && explanation && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-violet-400">
            <Sparkles size={20} />
            <h2 className="font-semibold text-white">
              Code Explanation
            </h2>
          </div>

          <CodeOutput
            code={explanation}
            language="text"
            title="AI Generated Explanation"
          />
        </section>
      )}
    </div>
  );
}
