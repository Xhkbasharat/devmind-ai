
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b16] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="text-sm text-slate-400">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
