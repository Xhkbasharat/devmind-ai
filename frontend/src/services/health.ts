
import api from "./api";

export interface HealthStatus {
  status: string;
  message?: string;
  version?: string;
}

export const healthService = {
  async checkHealth(): Promise<HealthStatus> {
    const response = await api.get<HealthStatus>("/health");
    return response.data;
  },

  async checkApiStatus(): Promise<HealthStatus> {
    const response = await api.get<HealthStatus>("/api/status");
    return response.data;
  },
};

export default healthService;
