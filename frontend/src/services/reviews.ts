
import api from "./api";
import type { CodeReview } from "../types/api";

export interface CreateReviewRequest {
  project_id?: number;
  code: string;
  language: string;
}

export const reviewService = {
  async getReviews(): Promise<CodeReview[]> {
    const response = await api.get<CodeReview[]>("/reviews/");
    return response.data;
  },

  async getReview(id: number): Promise<CodeReview> {
    const response = await api.get<CodeReview>(`/reviews/${id}`);
    return response.data;
  },

  async createReview(data: CreateReviewRequest): Promise<CodeReview> {
    const response = await api.post<CodeReview>("/reviews/", data);
    return response.data;
  },
};

export default reviewService;
