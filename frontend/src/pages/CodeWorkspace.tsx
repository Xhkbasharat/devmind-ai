
import { useState } from "react";
import { Code2, Sparkles, WandSparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import CodeEditor from "../components/CodeEditor";
import CodeOutput from "../components/CodeOutput";
import aiService from "../services/ai";
import { getErrorMessage } from "../services/error";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { validatePrompt } from "../utils/promptValidation";
import { promptTemplates } from "../utils/promptTemplates";

export default function CodeWorkspace() {
  useDocumentTitle("AI Code Generator");

  const [language, setLanguage] = useState("python");
  const [instructions, setInstructions] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);

    const template = promptTemplates.find(
      (item) => item.id === templateId
    );

    if (template) {
      setLanguage(template.language);
      setInstructions(template.prompt);
      setGeneratedCode("");
      setError("");
    }
  };

  const handleGenerate = async () => {
    const validation = validatePrompt(instructions);

    if (!validation.valid) {
      setError(validation.error ?? "Invalid instructions.");
      return;
    }

    setIsLoading(true);
    setError("");
    setGeneratedCode("");

    try {
      const response = await aiService.generateCode({
        code: "",
        language,
        instructions: instructions.trim(),
      });

      setGeneratedCode(response.result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="workspace-page">
      <PageHeader
        title="AI Code Generator"
        description="Describe what you want to build or start with a ready-made template."
        icon={<Code2 size={24} />}
      />

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <div className="workspace-grid">
        <section className="workspace-panel">
          <div className="form-group">
            <label htmlFor="prompt-template">
              <WandSparkles size={16} /> Choose a prompt template
            </label>

            <select
              id="prompt-template"
              className="form-select"
              value={selectedTemplate}
              onChange={(event) =>
                handleTemplateChange(event.target.value)
              }
            >
              <option value="">Write my own instructions</option>

              {promptTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>

            {selectedTemplate && (
              <small>
                {
                  promptTemplates.find(
                    (item) => item.id === selectedTemplate
                  )?.description
                }
              </small>
            )}
          </div>

          <CodeEditor
            value=""
            onChange={() => undefined}
            language={language}
            onLanguageChange={(value) => {
              setLanguage(value);
              setGeneratedCode("");
            }}
            label="Programming language"
            readOnly
          />

          <div className="form-group">
            <label htmlFor="generation-instructions">
              Describe what you want to generate
            </label>

            <textarea
              id="generation-instructions"
              className="form-textarea"
              value={instructions}
              onChange={(event) => {
                setInstructions(event.target.value);
                setSelectedTemplate("");
                setError("");
              }}
              placeholder="Example: Create a Python function that checks whether a number is prime."
              rows={8}
              maxLength={4000}
            />

            <small>
              {instructions.length}/4000 characters
            </small>
          </div>

          <button
            type="button"
            className="btn btn-primary workspace-action"
            onClick={handleGenerate}
            disabled={isLoading || !instructions.trim()}
          >
            {isLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <Sparkles size={18} />
            )}
            {isLoading ? "Generating..." : "Generate Code"}
          </button>
        </section>

        <section className="workspace-panel">
          {generatedCode ? (
            <CodeOutput
              code={generatedCode}
              language={language}
              title="Generated Code"
              filename="generated-code"
            />
          ) : (
            <div className="workspace-placeholder">
              <Code2 size={32} />
              <h3>Your generated code will appear here</h3>
              <p>
                Choose a template or describe your coding task,
                select a programming language, and generate code.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
