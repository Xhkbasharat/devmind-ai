import { FolderOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-[#101626] px-6 py-10 text-center">
      <div className="mb-5 rounded-2xl bg-violet-500/10 p-4 text-violet-400">
        <FolderOpen size={32} />
      </div>

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          <Plus size={17} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
