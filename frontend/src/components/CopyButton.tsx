
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import useClipboard from "../hooks/useClipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: CopyButtonProps) {
  const { copy } = useClipboard();
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (!text.trim() || isCopying) {
      return;
    }

    setIsCopying(true);

    const success = await copy(text);

    setCopied(success);
    setIsCopying(false);

    if (success) {
      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      disabled={!text.trim() || isCopying}
      aria-label={copied ? "Copied to clipboard" : label}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {copied ? (
        <>
          <Check size={16} className="text-green-400" />
          Copied
        </>
      ) : (
        <>
          <Copy size={16} />
          {isCopying ? "Copying..." : label}
        </>
      )}
    </button>
  );
}
