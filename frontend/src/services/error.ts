import axios from "axios";

interface ApiErrorResponse {
  detail?: string | Array<{
    msg?: string;
    message?: string;
  }>;
  message?: string;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item) => item.msg || item.message)
        .filter(Boolean)
        .join(", ") || fallback;
    }

    if (typeof data?.detail === "string" && data.detail.trim()) {
      return data.detail;
    }

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (status === 401) {
      return "Your session has expired. Please sign in again.";
    }

    if (status === 403) {
      return "You do not have permission to perform this action.";
    }

    if (status === 404) {
      return "The requested resource could not be found.";
    }

    if (status === 429) {
      return "Too many requests. Please try again later.";
    }

    if (status && status >= 500) {
      return "The server encountered an error. Please try again later.";
    }

    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }

    if (!error.response) {
      return "Unable to connect to the backend. Check your connection.";
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export default getErrorMessage;
