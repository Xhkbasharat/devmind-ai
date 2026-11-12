
import { useEffect, useState } from "react";
import {
  ExternalLink,
  Github,
  Loader2,
  RefreshCw,
  SearchCode,
  Star,
} from "lucide-react";
import githubService, {
  type GitHubAnalysis,
  type GitHubRepository,
} from "../services/github";

export default function GitHubWorkspace() {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [selectedRepository, setSelectedRepository] =
    useState<GitHubRepository | null>(null);
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadRepositories = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await githubService.getRepositories();
      setRepositories(data);
    } catch {
      setError(
        "Unable to load repositories. Check your GitHub token and backend connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRepositories();
  }, []);

  const analyzeRepository = async (repository: GitHubRepository) => {
    const [owner, ...nameParts] = repository.full_name.split("/");
    const name = nameParts.join("/");

    if (!owner || !name) {
      setError("Invalid GitHub repository information.");
      return;
    }

    setSelectedRepository(repository);
    setAnalysis(null);
    setError("");
    setIsAnalyzing(true);

    try {
      const result = await githubService.analyzeRepository(owner, name);
      setAnalysis(result);
    } catch {
      setError("Repository analysis failed. Check the backend GitHub integration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b16] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-violet-400">
              <Github size={20} />
              <span className="text-sm font-medium">GitHub Integration</span>
            </div>
            <h1 className="text-3xl font-bold">GitHub Workspace</h1>
            <p className="mt-2 text-slate-400">
              Explore repositories and request AI-powered code analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadRepositories()}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <p role="alert" className="mb-5 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <section className="rounded-2xl border border-white/10 bg-[#111629] p-6">
          <h2 className="mb-5 font-semibold">
            Your repositories ({repositories.length})
          </h2>

          {isLoading ? (
            <div className="flex items-center gap-3 py-10 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              Loading repositories...
            </div>
          ) : repositories.length === 0 ? (
            <p className="py-8 text-sm text-slate-400">
              No repositories were returned. Check your GitHub connection.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {repositories.map((repository) => (
                <article
                  key={repository.id}
                  className="rounded-xl border border-white/10 bg-[#080b16] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {repository.name}
                      </h3>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {repository.full_name}
                      </p>
                    </div>

                    <a
                      href={repository.html_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${repository.name} on GitHub`}
                      className="text-slate-400 hover:text-white"
                    >
                      <ExternalLink size={17} />
                    </a>
                  </div>

                  <p className="mt-4 min-h-10 text-sm text-slate-400">
                    {repository.description || "No description provided."}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    {repository.language && <span>{repository.language}</span>}
                    <span className="flex items-center gap-1">
                      <Star size={14} />
                      {repository.stargazers_count}
                    </span>
                    <span>
                      {repository.private ? "Private" : "Public"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => void analyzeRepository(repository)}
                    disabled={isAnalyzing}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
                  >
                    <SearchCode size={16} />
                    Analyze repository
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {isAnalyzing && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#111629] p-5 text-slate-300">
            <Loader2 size={20} className="animate-spin text-violet-400" />
            Analyzing {selectedRepository?.full_name}...
          </div>
        )}

        {analysis && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-[#111629] p-6">
            <h2 className="text-xl font-semibold">
              Analysis: {selectedRepository?.name}
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              {analysis.summary}
            </p>

            <h3 className="mt-6 font-semibold">Findings</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-400">
              {analysis.findings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>

            <h3 className="mt-6 font-semibold">Recommendations</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-400">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
            }
