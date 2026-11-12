import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b16] px-6 text-white">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
          <SearchX size={38} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
          Error 404
        </p>

        <h1 className="mt-4 text-4xl font-extrabold">
          Page not found
        </h1>

        <p className="mt-5 leading-7 text-slate-400">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to DevMind AI.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500"
          >
            <Home size={18} />
            Homepage
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
          >
            <ArrowLeft size={18} />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}
