import {
  ArrowRight,
  BrainCircuit,
  Bug,
  Code2,
  Github,
  SearchCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Code2,
    title: "AI Code Generation",
    description:
      "Generate code from natural-language instructions and accelerate development.",
  },
  {
    icon: Bug,
    title: "Intelligent Debugging",
    description:
      "Identify errors, understand their causes, and get practical fixes.",
  },
  {
    icon: SearchCode,
    title: "Code Quality Analysis",
    description:
      "Inspect code structure and identify potential quality issues.",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description:
      "Connect repository workflows with AI-powered code analysis.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#080b16] text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-600 p-2">
            <BrainCircuit size={25} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            DevMind AI
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles size={16} />
            AI-powered software engineering
          </div>

          <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Build smarter.
            <span className="block text-violet-400">
              Code better.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            DevMind AI brings intelligent code generation, debugging,
            code explanation, quality analysis, and repository insights
            into one developer workspace.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500"
            >
              Start building
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-violet-400" />
              Developer-focused tools
            </span>
            <span className="flex items-center gap-2">
              <BrainCircuit size={17} className="text-violet-400" />
              AI-assisted workflows
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#101626] p-6 shadow-2xl shadow-violet-950/20">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-slate-500">
              devmind_workspace.py
            </span>
          </div>

          <div className="space-y-4 font-mono text-sm">
            <p className="text-violet-400">
              # Your AI development workspace
            </p>
            <p>
              <span className="text-pink-400">def</span>{" "}
              <span className="text-blue-300">build_with_ai</span>():
            </p>
            <p className="pl-6 text-slate-300">
              generate_code()
            </p>
            <p className="pl-6 text-slate-300">
              debug_errors()
            </p>
            <p className="pl-6 text-slate-300">
              analyze_quality()
            </p>
            <p className="pl-6 text-slate-300">
              explain_code()
            </p>
            <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-violet-300">
                <Sparkles size={16} />
                DevMind AI
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Your development workflow, enhanced with AI-powered
                assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            One workspace. Smarter development.
          </h2>
          <p className="mt-3 text-slate-400">
            Tools designed to support your software engineering workflow.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-[#101626] p-6 transition hover:-translate-y-1 hover:border-violet-500/50"
              >
                <div className="mb-5 inline-flex rounded-xl bg-violet-500/10 p-3 text-violet-400">
                  <Icon size={24} />
                </div>

                <h3 className="mb-3 font-semibold">
                  {feature.title}
                </h3>

                <p className="text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} DevMind AI. Built for developers.
      </footer>
    </main>
  );
            }
