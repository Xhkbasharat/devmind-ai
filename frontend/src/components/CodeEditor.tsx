
import { useMemo } from "react";
import { Code2, Trash2 } from "lucide-react";

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  minHeight?: number;
}

const languages = [
  "python",
  "javascript",
  "typescript",
  "java",
  "cpp",
  "c",
  "go",
  "rust",
  "php",
  "ruby",
  "html",
  "css",
  "sql",
  "bash",
];

export default function CodeEditor({
  code,
  language,
  onChange,
  onLanguageChange,
  readOnly = false,
  placeholder = "Write or paste your code here...",
  minHeight = 320,
}: CodeEditorProps) {
  const lineNumbers = useMemo(
    () => Array.from({ length: Math.max(1, code.split("\n").length) }, (_, i) => i + 1),
    [code]
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101626]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Code2 size={18} className="text-violet-400" />
          Code Editor
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(event) => onLanguageChange?.(event.target.value)}
            disabled={!onLanguageChange}
            aria-label="Programming language"
            className="rounded-lg border border-slate-700 bg-[#080b16] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500 disabled:opacity-70"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>

          {!readOnly && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={!code}
              aria-label="Clear code"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
      </header>

      <div className="flex overflow-auto" style={{ minHeight }}>
        <div
          aria-hidden="true"
          className="select-none border-r border-slate-800 bg-[#0b1020] px-3 py-4 text-right font-mono text-xs leading-6 text-slate-600"
        >
          {lineNumbers.map((number) => (
            <div key={number}>{number}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Source code editor"
          placeholder={placeholder}
          className="min-w-0 flex-1 resize-y bg-transparent p-4 font-mono text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600"
          style={{ minHeight }}
        />
      </div>

      <footer className="flex justify-between border-t border-slate-800 px-4 py-2 text-xs text-slate-500">
        <span>{language.toUpperCase()}</span>
        <span>{code.length.toLocaleString()} characters</span>
      </footer>
    </section>
  );
}
