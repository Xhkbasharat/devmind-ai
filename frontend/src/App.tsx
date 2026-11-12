
import {
  Activity,
  BarChart3,
  BookOpen,
  Bug,
  Code2,
  ClipboardCheck,
  FolderGit2,
  Github,
  LayoutDashboard,
  LogOut,
  SearchCode,
  Sparkles,
} from "lucide-react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { useAuthStore } from "./store/authStore";
import BackendStatus from "./components/BackendStatus";
import CodeWorkspace from "./pages/CodeWorkspace";
import DebugWorkspace from "./pages/DebugWorkspace";
import ExplainWorkspace from "./pages/ExplainWorkspace";
import AnalysisWorkspace from "./pages/AnalysisWorkspace";
import GitHubWorkspace from "./pages/GitHubWorkspace";
import ProjectsWorkspace from "./pages/ProjectsWorkspace";
import ReviewsWorkspace from "./pages/ReviewsWorkspace";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "AI Code Generator", path: "/dashboard/code", icon: Sparkles },
  { label: "AI Debugger", path: "/dashboard/debug", icon: Bug },
  { label: "Code Explainer", path: "/dashboard/explain", icon: BookOpen },
  { label: "Code Analyzer", path: "/dashboard/analysis", icon: SearchCode },
  { label: "GitHub Workspace", path: "/dashboard/github", icon: Github },
  { label: "My Projects", path: "/dashboard/projects", icon: FolderGit2 },
  { label: "Code Reviews", path: "/dashboard/reviews", icon: ClipboardCheck },
];

function DashboardHome() {
  const user = useAuthStore((state) => state.user);

  const tools = [
    { label: "AI Code Generator", icon: Sparkles, path: "/dashboard/code" },
    { label: "AI Debugger", icon: Bug, path: "/dashboard/debug" },
    { label: "Code Explainer", icon: BookOpen, path: "/dashboard/explain" },
    { label: "Code Analyzer", icon: SearchCode, path: "/dashboard/analysis" },
    { label: "GitHub Workspace", icon: Github, path: "/dashboard/github" },
    { label: "My Projects", icon: FolderGit2, path: "/dashboard/projects" },
    { label: "Code Reviews", icon: ClipboardCheck, path: "/dashboard/reviews" },
  ];

  return (
    <div className="p-6 text-white">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-violet-400">Developer workspace</p>
          <h1 className="mt-2 text-3xl font-bold">
            Welcome{user?.username ? `, ${user.username}` : ""}!
          </h1>
          <p className="mt-2 text-slate-400">
            Your AI-powered software engineering workspace is ready.
          </p>
        </div>

        <BackendStatus />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <Link
              key={tool.path}
              to={tool.path}
              className="rounded-xl border border-white/10 bg-[#111629] p-5 transition hover:border-violet-500/50 hover:bg-[#171d35]"
            >
              <Icon size={24} className="mb-4 text-violet-400" />
              <h2 className="font-semibold">{tool.label}</h2>
              <p className="mt-2 text-sm text-slate-400">
                Open workspace
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-[#111629] p-6">
        <div className="flex items-center gap-3">
          <Activity size={22} className="text-emerald-400" />
          <h2 className="font-semibold">Platform overview</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          DevMind AI combines AI-assisted coding, debugging, code explanations,
          static analysis, GitHub insights, project management, and code reviews.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#080b16] text-white md:flex">
      <aside className="w-full border-b border-white/10 bg-[#0d1222] p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <Link to="/dashboard" className="mb-7 flex items-center gap-3">
          <div className="rounded-xl bg-violet-600 p-2">
            <Code2 size={23} />
          </div>
          <span className="text-xl font-bold">DevMind AI</span>
        </Link>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                    isActive
                      ? "bg-violet-600/20 text-violet-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 hidden border-t border-white/10 pt-5 md:block">
          <p className="mb-4 text-xs text-slate-500">
            AI-powered development
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Github size={17} />
            GitHub integration
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
            <BarChart3 size={17} />
            Code intelligence
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {user?.username || "Developer"}
            </p>
            <p className="text-xs text-slate-500">DevMind account</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="code" element={<CodeWorkspace />} />
          <Route path="debug" element={<DebugWorkspace />} />
          <Route path="explain" element={<ExplainWorkspace />} />
          <Route path="analysis" element={<AnalysisWorkspace />} />
          <Route path="github" element={<GitHubWorkspace />} />
          <Route path="projects" element={<ProjectsWorkspace />} />
          <Route path="reviews" element={<ReviewsWorkspace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
                  }
