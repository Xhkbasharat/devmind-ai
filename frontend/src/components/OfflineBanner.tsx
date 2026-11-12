import { WifiOff } from "lucide-react";
import useOnlineStatus from "../hooks/useOnlineStatus";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-center gap-3 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
    >
      <WifiOff size={18} />

      <span>
        You are offline. Check your internet connection.
      </span>
    </div>
  );
}
