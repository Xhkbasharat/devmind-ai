
import { useState } from "react";
import {
  Activity,
  Bot,
  Bug,
  Code2,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Zap,
} from "lucide-react";

type Page =
  | "Dashboard"
  | "AI Code Generator"
  | "Code Debugger"
  | "Code Explanation"
  | "Projects"
  | "Code Analysis"
  | "GitHub Integration"
  | "Settings";

const navigation: {
  label: Page;
  icon: typeof LayoutDashboard;
}[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "AI Code Generator", icon: Bot },
  { label: "Code Debugger", icon: Bug },
  { label: "Code Explanation", icon: MessageSquare },
  { label: "Projects", icon: FolderKanban },
  { label: "Code Analysis", icon: ShieldCheck },
  { label: "GitHub Integration", icon: GitBranch },
  { label: "Settings", icon: Settings },
];

function App() {
  const [activePage, setActivePage] =
    useState<Page>("Dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");

  const renderDashboard = () => (
    <>
      <div className="welcome-section">
        <div>
          <span className="eyebrow">
            DEVMIND INTELLIGENCE PLATFORM
          </span>
          <h1>Welcome to DevMind AI</h1>
          <p>
            Your intelligent workspace for building better software.
          </p>
        </div>

        <div className="welcome-icon">
          <Sparkles size={30} />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Projects"
          value="00"
          icon={FolderKanban}
          detail="Your workspace"
        />
        <StatCard
          title="Code Reviews"
          value="00"
          icon={ShieldCheck}
          detail="Reviews completed"
        />
        <StatCard
          title="AI Operations"
          value="00"
          icon={Zap}
          detail="AI tasks performed"
        />
        <StatCard
          title="Code Quality"
          value="--"
          icon={Activity}
          detail="Awaiting analysis"
        />
      </div>

      <section className="content-grid">
        <div className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">GET STARTED</span>
              <h2>AI Engineering Tools</h2>
            </div>
            <Bot size={22} />
          </div>

          <div className="tool-grid">
            <ToolCard
              icon={Code2}
              title="Generate Code"
              description="Create code with AI assistance."
              onClick={() => setActivePage("AI Code Generator")}
            />

            <ToolCard
              icon={Bug}
              title="Debug Code"
              description="Find bugs and explore solutions."
              onClick={() => setActivePage("Code Debugger")}
            />

            <ToolCard
              icon={MessageSquare}
              title="Explain Code"
              description="Understand complex code."
              onClick={() => setActivePage("Code Explanation")}
            />

            <ToolCard
              icon={ShieldCheck}
              title="Analyze Code"
              description="Inspect code quality."
              onClick={() => setActivePage("Code Analysis")}
            />
          </div>
        </div>

        <div className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">WORKSPACE</span>
              <h2>Platform Status</h2>
            </div>
            <Activity size={22} />
          </div>

          <div className="status-row">
            <span className="status-dot" />
            <div>
              <strong>Frontend</strong>
              <p>Application initialized</p>
            </div>
            <span className="status-label">READY</span>
          </div>

          <div className="status-row">
            <span className="status-dot pending" />
            <div>
              <strong>Backend API</strong>
              <p>Connection not verified</p>
            </div>
            <span className="status-label pending-text">
              PENDING
            </span>
          </div>

          <div className="status-row">
            <span className="status-dot pending" />
            <div>
              <strong>ML Engine</strong>
              <p>Model setup required</p>
            </div>
            <span className="status-label pending-text">
              PENDING
            </span>
          </div>

          <div className="activity-note">
            <Sparkles size={17} />
            <span>
              Your AI engineering workspace is taking shape.
            </span>
          </div>
        </div>
      </section>
    </>
  );

  const renderWorkspace = () => {
    const descriptions: Record<Page, string> = {
      Dashboard: "Your engineering workspace overview.",
      "AI Code Generator": "Generate code using AI assistance.",
      "Code Debugger": "Investigate errors and find solutions.",
      "Code Explanation": "Understand your source code.",
      Projects: "Manage your software development projects.",
      "Code Analysis": "Evaluate code quality and complexity.",
      "GitHub Integration": "Explore your connected repositories.",
      Settings: "Manage your application preferences.",
    };

    if (activePage === "Dashboard") {
      return renderDashboard();
    }

    return (
      <section className="workspace-placeholder panel">
        <div className="workspace-icon">
          <Sparkles size={32} />
        </div>
        <span className="eyebrow">ENGINEERING WORKSPACE</span>
        <h1>{activePage}</h1>
        <p>{descriptions[activePage]}</p>
        <div className="coming-soon">
          <Terminal size={17} />
          <span>Workspace interface is being developed.</span>
        </div>
        <button
          className="primary-button"
          onClick={() => setActivePage("Dashboard")}
        >
          Return to Dashboard
        </button>
      </section>
    );
  };

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Bot size={25} />
          </div>
          <div>
            <strong>DevMind AI</strong>
            <span>ENGINEERING PLATFORM</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-label">MAIN MENU</div>

        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${
                activePage === label ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(label);
                setSidebarOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-badge">
            <Sparkles size={17} />
            <div>
              <strong>AI Workspace</strong>
              <span>Development edition</span>
            </div>
          </div>

          <div className="profile">
            <div className="avatar">D</div>
            <div>
              <strong>Developer</strong>
              <span>DevMind Workspace</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            <span>DevMind AI</span>
            <span>/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search workspace..."
              aria-label="Search workspace"
            />
            <kbd>⌘ K</kbd>
          </div>

          <div className="topbar-avatar">D</div>
        </header>

        <div className="page-content">{renderWorkspace()}</div>

        <footer className="footer">
          <span>© 2026 DevMind AI</span>
          <span>Intelligent Software Engineering</span>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  detail,
}: {
  title: string;
  value: string;
  icon: typeof Activity;
  detail: string;
}) {
  return (
    <div className="stat-card panel">
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon">
          <Icon size={19} />
        </div>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </div>
  );
}

function ToolCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof Bot;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button className="tool-card" onClick={onClick}>
      <div className="tool-icon">
        <Icon size={21} />
      </div>
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
  );
}

export default App;
            
