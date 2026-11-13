
import { Code2, FileCode2 } from "lucide-react";
import CopyButton from "./CopyButton";

interface CodeOutputProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeOutput({
  code,
  language = "text",
  title = "Generated Output",
}: CodeOutputProps) {
  if (!code.trim()) {
    return null;
  }

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

        <CopyButton text={code} label="Copy code" />
      </header>

      <div className="overflow-x-auto p-4">
        <pre className="min-w-0 whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </section>
  );
}
