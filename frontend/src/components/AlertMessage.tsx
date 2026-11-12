import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertMessageProps {
  type: AlertType;
  message: string;
  title?: string;
  onClose?: () => void;
}

const alertStyles = {
  success: {
    icon: CheckCircle2,
    container: "border-green-500/30 bg-green-500/10",
    iconColor: "text-green-400",
    titleColor: "text-green-300",
    messageColor: "text-green-200/80",
  },
  error: {
    icon: AlertCircle,
    container: "border-red-500/30 bg-red-500/10",
    iconColor: "text-red-400",
    titleColor: "text-red-300",
    messageColor: "text-red-200/80",
  },
  warning: {
    icon: TriangleAlert,
    container: "border-yellow-500/30 bg-yellow-500/10",
    iconColor: "text-yellow-400",
    titleColor: "text-yellow-300",
    messageColor: "text-yellow-200/80",
  },
  info: {
    icon: Info,
    container: "border-blue-500/30 bg-blue-500/10",
    iconColor: "text-blue-400",
    titleColor: "text-blue-300",
    messageColor: "text-blue-200/80",
  },
};

export default function AlertMessage({
  type,
  message,
  title,
  onClose,
}: AlertMessageProps) {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border p-4 ${style.container}`}
    >
      <Icon
        size={20}
        className={`mt-0.5 shrink-0 ${style.iconColor}`}
      />

      <div className="min-w-0 flex-1">
        {title && (
          <h3 className={`text-sm font-semibold ${style.titleColor}`}>
            {title}
          </h3>
        )}

        <p className={`text-sm leading-6 ${style.messageColor}`}>
          {message}
        </p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss message"
          className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}
