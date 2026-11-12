import React, { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineBanner from "./components/OfflineBanner";
import { useAuthStore } from "./store/authStore";
import "./styles/index.css";

function Application() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  return (
    <>
      <OfflineBanner />
      <AppRoutes />
    </>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <ErrorBoundary>
      <Application />
    </ErrorBoundary>
  </StrictMode>
);
