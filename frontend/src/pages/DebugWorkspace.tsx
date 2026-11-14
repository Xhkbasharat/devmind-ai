
import { useState } from "react";
import { Bug, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import CodeEditor from "../components/CodeEditor";
import CodeOutput from "../components/CodeOutput";
import CodeFileUpload from "../components/CodeFileUpload";
import aiService from "../services/ai";
import { getErrorMessage } from "../services/error";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function DebugWorkspace() {
  useDocumentTitle("AI Debugger");

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [debugResult, setDebugResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDebug = async () => {
    if (!code.trim()) {
      setError("Please enter or upload code to debug.");
      return;
    }

    setIsLoading(true);
    setError("");
    setDebugResult("");

    try {
      const response = await aiService.debugCode({
        code,
        language,
      });

      setDebugResult(response.result);
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
    setDebugResult("");
    setError("");
  };

  return (
    <div className="workspace-page">
      <PageHeader
        title="AI Code Debugger"
        description="Find bugs, understand errors, and get suggested fixes with AI."
        icon={<Bug size={24} />}
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
            label="Code to debug"
          />

          <button
            type="button"
            className="btn btn-primary workspace-action"
            onClick={handleDebug}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <Sparkles size={18} />
            )}
            {isLoading ? "Analyzing..." : "Debug Code"}
          </button>
        </section>

        <section className="workspace-panel">
          {debugResult ? (
            <CodeOutput
              code={debugResult}
              language="text"
              title="Debugging Results"
              filename="debug-results"
            />
          ) : (
            <div className="workspace-placeholder">
              <Bug size={32} />
              <h3>Debugging results will appear here</h3>
              <p>
                Enter or upload your code, then run the AI debugger
                to receive an analysis and suggested fixes.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
