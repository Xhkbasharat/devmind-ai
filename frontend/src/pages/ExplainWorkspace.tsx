
import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import CodeEditor from "../components/CodeEditor";
import CodeOutput from "../components/CodeOutput";
import CodeFileUpload from "../components/CodeFileUpload";
import aiService from "../services/ai";
import { getErrorMessage } from "../services/error";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function ExplainWorkspace() {
  useDocumentTitle("Code Explainer");

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileRead = (
    fileCode: string,
    fileLanguage: string
  ) => {
    setCode(fileCode);
    setLanguage(fileLanguage);
    setExplanation("");
    setError("");
  };

  const handleExplain = async () => {
    if (!code.trim()) {
      setError("Please enter or upload code to explain.");
      return;
    }

    setIsLoading(true);
    setError("");
    setExplanation("");

    try {
      const response = await aiService.explainCode({
        code,
        language,
      });

      setExplanation(response.result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="workspace-page">
      <PageHeader
        title="AI Code Explainer"
        description="Understand code structure, logic, and functionality with AI-powered explanations."
        icon={<BookOpen size={24} />}
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
            label="Code to explain"
          />

          <button
            type="button"
            className="btn btn-primary workspace-action"
            onClick={handleExplain}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <Sparkles size={18} />
            )}
            {isLoading ? "Explaining..." : "Explain Code"}
          </button>
        </section>

        <section className="workspace-panel">
          {explanation ? (
            <CodeOutput
              code={explanation}
              language="text"
              title="Code Explanation"
              filename="code-explanation"
            />
          ) : (
            <div className="workspace-placeholder">
              <BookOpen size={32} />
              <h3>Your explanation will appear here</h3>
              <p>
                Enter or upload code, then request an explanation
                to understand how it works.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
