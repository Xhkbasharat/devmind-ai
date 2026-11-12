
import api from "./api";

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
}

export interface GitHubAnalysis {
  summary: string;
  findings: string[];
  recommendations: string[];
}

export const githubService = {
  async getRepositories(): Promise<GitHubRepository[]> {
    const response = await api.get<GitHubRepository[]>("/github/repositories");
    return response.data;
  },

  async analyzeRepository(
    owner: string,
    repository: string
  ): Promise<GitHubAnalysis> {
    const response = await api.post<GitHubAnalysis>(
      "/github/analyze",
      {
        owner,
        repository,
      }
    );

    return response.data;
  },
};

export default githubService;
