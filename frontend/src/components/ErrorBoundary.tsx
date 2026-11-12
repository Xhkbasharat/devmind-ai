
import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("DevMind AI application error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#080b16] px-6 text-white">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertTriangle size={32} className="text-red-400" />
            </div>

            <h1 className="text-2xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              DevMind AI encountered an unexpected application error.
              Reload the application to try again.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="mx-auto mt-6 flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
            >
              <RefreshCw size={17} />
              Reload application
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
