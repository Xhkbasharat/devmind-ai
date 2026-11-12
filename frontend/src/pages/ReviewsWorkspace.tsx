
import { useEffect, useState, type FormEvent } from "react";
import {
  ClipboardCheck,
  Loader2,
  RefreshCw,
  Send,
  ShieldCheck,
} from "lucide-react";
import reviewService from "../services/reviews";
import type { CodeReview } from "../types/api";

const languages = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "Go",
  "Rust",
];

export default function ReviewsWorkspace() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [reviews, setReviews] = useState<CodeReview[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await reviewService.getReviews();
      setReviews(data);
    } catch {
      setError("Unable to load code reviews. Check your backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      setError("Please enter code for review.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await reviewService.createReview({
        code: code.trim(),
        language,
      });

      setCode("");
      await loadReviews();
    } catch {
      setError("Unable to submit your code review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b16] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-emerald-400">
              <ShieldCheck size={20} />
              <span className="text-sm font-medium">Code Quality</span>
            </div>
            <h1 className="text-3xl font-bold">Code Reviews</h1>
            <p className="mt-2 text-slate-400">
              Submit source code and manage your code review history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadReviews()}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#111629] p-6"
        >
          <h2 className="mb-5 font-semibold">Submit code for review</h2>

          <label htmlFor="review-language" className="mb-2 block text-sm text-slate-300">
            Programming language
          </label>

          <select
            id="review-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="mb-6 w-full rounded-lg border border-white/10 bg-[#080b16] px-4 py-3 text-sm outline-none focus:border-violet-500 sm:max-w-xs"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor="review-code" className="mb-2 block text-sm text-slate-300">
            Source code
          </label>

          <textarea
            id="review-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Paste the code you want reviewed..."
            rows={10}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-white/10 bg-[#080b16] p-4 font-mono text-sm leading-6 text-emerald-300 outline-none placeholder:text-slate-600 focus:border-violet-500"
          />

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            Submit for review
          </button>
        </form>

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#111629] p-6">
          <div className="mb-5 flex items-center gap-2">
            <ClipboardCheck size={20} className="text-violet-400" />
            <h2 className="font-semibold">
              Review history ({reviews.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-3 py-8 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              Loading review history...
            </div>
          ) : reviews.length === 0 ? (
            <p className="py-8 text-sm text-slate-400">
              No reviews found. Submit your first code review above.
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-white/10 bg-[#080b16] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium">
                      Review #{review.id}
                    </h3>
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                      {review.status || "Submitted"}
                    </span>
                  </div>

                  {review.summary && (
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {review.summary}
                    </p>
                  )}

                  {review.created_at && (
                    <p className="mt-3 text-xs text-slate-500">
                      {new Date(review.created_at).toLocaleString()}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
