
import { useState } from "react";
import { Code2, Download, FileCode2 } from "lucide-react";
import CopyButton from "./CopyButton";
import downloadCode from "../utils/download";

interface CodeOutputProps {
  code: string;
  language?: string;
  title?: string;
  filename?: string;
}

export default function CodeOutput({
  code,
  language = "text",
  title = "Generated Output",
  filename,
}: CodeOutputProps) {
  const [downloadError, setDownloadError] = useState("");

  if (!code.trim()) {
    return null;
  }

  const handleDownload = () => {
    try {
      setDownloadError("");
      downloadCode(code, language, filename);
    } catch {
      setDownloadError("Unable to download this code.");
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101626]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400">
            <FileCode2 size={19} />
          </div>

          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              <Code2 size={12} className="mr-1 inline" />
              {language}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CopyButton text={code} label="Copy code" />

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-500 hover:text-white"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </header>

      {downloadError && (
        <p role="alert" className="px-4 pt-3 text-sm text-red-400">
          {downloadError}
        </p>
      )}

      <div className="overflow-x-auto p-4">
        <pre className="min-w-0 whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-300">
          <code>{code}</code>
        </pre>
      </div>

      <footer className="border-t border-slate-800 px-4 py-3 text-xs text-slate-500">
        {code.length.toLocaleString()} characters
      </footer>
    </section>
  );
}
