
import { useRef, useState } from "react";
import { FileCode2, Upload, X } from "lucide-react";
import { detectLanguageFromFilename } from "../utils/language";

interface CodeFileUploadProps {
  onFileRead: (code: string, language: string, filename: string) => void;
  maxSizeMB?: number;
}

export default function CodeFileUpload({
  onFileRead,
  maxSizeMB = 2,
}: CodeFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be smaller than ${maxSizeMB} MB.`);
      event.target.value = "";
      return;
    }

    const language = detectLanguageFromFilename(file.name);

    if (language === "text") {
      setError("This programming language is not supported.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("Unable to read this file.");
        return;
      }

      setFilename(file.name);
      onFileRead(reader.result, language, file.name);
    };

    reader.onerror = () => {
      setError("An error occurred while reading the file.");
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const clearFile = () => {
    setFilename("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section className="rounded-2xl border border-dashed border-slate-700 bg-[#101626] p-5">
      <input
        ref={inputRef}
        type="file"
        accept=".py,.pyw,.js,.jsx,.mjs,.cjs,.ts,.tsx,.mts,.cts,.java,.cpp,.cc,.cxx,.hpp,.c,.h,.go,.rs,.php,.rb,.html,.htm,.css,.scss,.sass,.sql,.sh,.bash"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload source code file"
      />

      {!filename ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-3 py-5 text-center transition hover:text-violet-400"
        >
          <div className="rounded-xl bg-violet-500/10 p-4 text-violet-400">
            <Upload size={26} />
          </div>

          <span className="font-semibold text-white">
            Upload source code
          </span>

          <span className="text-xs text-slate-400">
            Select a supported code file (maximum {maxSizeMB} MB)
          </span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileCode2 size={23} className="shrink-0 text-violet-400" />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {filename}
              </p>
              <p className="text-xs text-green-400">
                File loaded successfully
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearFile}
            aria-label="Clear uploaded file"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </section>
  );
}
