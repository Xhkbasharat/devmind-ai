
import { useEffect, useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import healthService from "../services/health";

type ConnectionState = "checking" | "connected" | "disconnected";

export default function BackendStatus() {
  const [status, setStatus] = useState<ConnectionState>("checking");

  useEffect(() => {
    let active = true;

    const checkConnection = async () => {
      try {
        await healthService.checkHealth();

        if (active) {
          setStatus("connected");
        }
      } catch {
        if (active) {
          setStatus("disconnected");
        }
      }
    };

    void checkConnection();

    const interval = window.setInterval(() => {
      void checkConnection();
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const statusConfig = {
    checking: {
      label: "Checking backend...",
      color: "text-amber-400",
      dot: "bg-amber-400",
    },
    connected: {
      label: "Backend connected",
      color: "text-emerald-400",
      dot: "bg-emerald-400",
    },
    disconnected: {
      label: "Backend disconnected",
      color: "text-red-400",
      dot: "bg-red-400",
    },
  };

  const current = statusConfig[status];

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111629] px-3 py-2">
      {status === "checking" ? (
        <Loader2 size={15} className="animate-spin text-amber-400" />
      ) : (
        <span className={`h-2 w-2 rounded-full ${current.dot}`} />
      )}

      <Activity size={15} className={current.color} />

      <span className={`text-xs font-medium ${current.color}`}>
        {current.label}
      </span>
    </div>
  );
      }
