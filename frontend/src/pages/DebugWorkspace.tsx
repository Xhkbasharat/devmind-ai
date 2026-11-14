
import { useState, type FormEvent } from "react";
import { Bug, Sparkles } from "lucide-react";

import CodeEditor from "../components/CodeEditor";
import CodeOutput from "../components/CodeOutput";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

import aiService from "../services/ai";
import { getErrorMessage } from "../services/error";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function DebugWorkspace() {
  useDocumentTitle("AI Debugger");

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [debugResult, setDebugResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDebug = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setDebugResult("");

    if (!code.trim()) {
      setError("Please enter the code you want to debug.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await aiService.debugCode({
        code: code.trim(),
        language,
      });

      setDebugResult(response.result);
    } catch (err) {
      setError(
        getErrorMessage(err, "Debugging failed. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Code Debugger"
        description="Find bugs, understand errors, and get AI-assisted suggestions to improve your code."
      />

      {error && (
        <AlertMessage
          type="error"
          title="Debugging failed"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <form onSubmit={handleDebug} className="space-y-6">
        <CodeEditor
          code={code}
          language={language}
          onChange={setCode}
          onLanguageChange={setLanguage}
          placeholder="Paste your faulty code here..."
          minHeight={350}
        />

        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <Bug size={19} />
          {isLoading ? "Analyzing code..." : "Debug my code"}
        </button>
      </form>

      {isLoading && (
        <LoadingSpinner message="DevMind AI is examining your code and searching for potential bugs..." />
      )}

      {!isLoading && debugResult && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-violet-400">
            <Sparkles size={20} />
            <h2 className="font-semibold text-white">
              Debugging Results
            </h2>
          </div>

          <CodeOutput
            code={debugResult}
            language="text"
            title="AI Debugging Suggestions"
          />
        </section>
      )}
    </div>
  );
}
