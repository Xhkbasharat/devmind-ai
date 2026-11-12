
import api from "./api";
import type {
  AIRequest,
  AIResponse,
  CodeAnalysisRequest,
  CodeAnalysisResponse,
} from "../types/api";

export const aiService = {
  async generateCode(data: AIRequest): Promise<AIResponse> {
    const response = await api.post<AIResponse>("/ai/generate", data);
    return response.data;
  },

  async debugCode(data: AIRequest): Promise<AIResponse> {
    const response = await api.post<AIResponse>("/ai/debug", data);
    return response.data;
  },

  async explainCode(data: AIRequest): Promise<AIResponse> {
    const response = await api.post<AIResponse>("/ai/explain", data);
    return response.data;
  },

  async analyzeCode(
    data: CodeAnalysisRequest
  ): Promise<CodeAnalysisResponse> {
    const response = await api.post<CodeAnalysisResponse>(
      "/analysis/analyze",
      data
    );
    return response.data;
  },
};

export default aiService;
