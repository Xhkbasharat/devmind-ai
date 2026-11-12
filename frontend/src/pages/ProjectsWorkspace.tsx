
import { useEffect, useState, type FormEvent } from "react";
import {
  FolderGit2,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import projectService from "../services/projects";
import type { Project } from "../types/api";

export default function ProjectsWorkspace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadProjects = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch {
      setError("Unable to load projects. Check your backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setError("");
    setIsCreating(true);

    try {
      const project = await projectService.createProject({
        name: name.trim(),
        description: description.trim(),
      });

      setProjects((current) => [project, ...current]);
      setName("");
      setDescription("");
    } catch {
      setError("Unable to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await projectService.deleteProject(project.id);
      setProjects((current) =>
        current.filter((item) => item.id !== project.id)
      );
    } catch {
      setError("Unable to delete this project.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080b16] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-violet-400">
              <FolderGit2 size={20} />
              <span className="text-sm font-medium">Project Management</span>
            </div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="mt-2 text-slate-400">
              Organize your software development projects.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadProjects()}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-2xl border border-white/10 bg-[#111629] p-6"
        >
          <h2 className="mb-5 font-semibold">Create a project</h2>

          <label htmlFor="project-name" className="mb-2 block text-sm text-slate-300">
            Project name
          </label>
          <input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="My new project"
            required
            maxLength={120}
            className="mb-5 w-full rounded-lg border border-white/10 bg-[#080b16] px-4 py-3 text-sm outline-none focus:border-violet-500"
          />

          <label htmlFor="project-description" className="mb-2 block text-sm text-slate-300">
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe what you're building..."
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-[#080b16] p-4 text-sm outline-none focus:border-violet-500"
          />

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isCreating}
            className="mt-5 flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
          >
            {isCreating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            Create project
          </button>
        </form>

        <section className="rounded-2xl border border-white/10 bg-[#111629] p-6">
          <h2 className="mb-5 font-semibold">
            Your projects ({projects.length})
          </h2>

          {isLoading ? (
            <div className="flex items-center gap-3 py-8 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <p className="py-8 text-sm text-slate-400">
              No projects yet. Create your first project above.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-xl border border-white/10 bg-[#080b16] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <FolderGit2 className="shrink-0 text-violet-400" size={22} />
                      <h3 className="truncate font-semibold">{project.name}</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleDelete(project)}
                      aria-label={`Delete ${project.name}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    {project.description || "No description provided."}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
                    }
