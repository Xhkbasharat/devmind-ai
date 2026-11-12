
import api from "./api";
import type { Project, ProjectCreate } from "../types/api";

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>("/projects/");
    return response.data;
  },

  async getProject(id: number): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: ProjectCreate): Promise<Project> {
    const response = await api.post<Project>("/projects/", data);
    return response.data;
  },

  async updateProject(
    id: number,
    data: Partial<ProjectCreate>
  ): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};

export default projectService;
