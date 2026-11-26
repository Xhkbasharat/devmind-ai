
import { useCallback, useEffect, useState } from "react";

export interface AnalysisHistoryItem {
  id: string;
  language: string;
  code: string;
  score?: number;
  summary: string;
  issues: {
    type?: string;
    severity?: string;
    message?: string;
    description?: string;
    line?: number;
  }[];
  createdAt: string;
}

const STORAGE_KEY = "devmind_analysis_history";
const MAX_HISTORY_ITEMS = 20;

function loadAnalysisHistory(): AnalysisHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is AnalysisHistoryItem =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.language === "string" &&
          typeof item.code === "string" &&
          typeof item.summary === "string" &&
          Array.isArray(item.issues) &&
          typeof item.createdAt === "string"
      )
      .slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(
    loadAnalysisHistory
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
      );
    } catch {
      // Keep the application usable if storage is unavailable.
    }
  }, [history]);

  const addAnalysis = useCallback(
    (
      analysis: Omit<AnalysisHistoryItem, "id" | "createdAt">
    ) => {
      const entry: AnalysisHistoryItem = {
        ...analysis,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      setHistory((current) =>
        [entry, ...current].slice(0, MAX_HISTORY_ITEMS)
      );

      return entry;
    },
    []
  );

  const removeAnalysis = useCallback((id: string) => {
    setHistory((current) =>
      current.filter((item) => item.id !== id)
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addAnalysis,
    removeAnalysis,
    clearHistory,
  };
}

export default useAnalysisHistory;
