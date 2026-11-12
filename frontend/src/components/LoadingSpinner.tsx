import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "min-h-screen" : "min-h-[200px] w-full"
      }`}
    >
      <LoaderCircle
        size={36}
        className="animate-spin text-violet-400"
        aria-hidden="true"
      />

      <p className="text-sm text-slate-400">{message}</p>

      <span className="sr-only">Please wait</span>
    </div>
  );
}
