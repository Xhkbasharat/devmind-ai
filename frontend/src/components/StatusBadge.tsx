import { CheckCircle2, Clock3, AlertCircle, LoaderCircle } from "lucide-react";

type StatusType =
  | "success"
  | "pending"
  | "failed"
  | "running"
  | "completed"
  | "active"
  | "inactive";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<
  StatusType,
  {
    label: string;
    className: string;
    icon: typeof CheckCircle2;
  }
> = {
  success: {
    label: "Success",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle2,
  },
  active: {
    label: "Active",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: Clock3,
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: AlertCircle,
  },
  inactive: {
    label: "Inactive",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    icon: AlertCircle,
  },
  running: {
    label: "Running",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: LoaderCircle,
  },
};

export default function StatusBadge({
  status,
  label,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon
        size={13}
        className={status === "running" ? "animate-spin" : ""}
      />
      {label || config.label}
    </span>
  );
}
