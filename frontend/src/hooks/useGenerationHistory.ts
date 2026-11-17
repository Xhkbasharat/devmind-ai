
import { useCallback, useEffect, useState } from "react";

export interface GenerationHistoryItem {
  id: string;
  prompt: string;
  language: string;
  code: string;
  createdAt: string;
}

const STORAGE_KEY = "devmind_generation_history";
const MAX_HISTORY_ITEMS = 20;

function loadHistory(): GenerationHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is GenerationHistoryItem =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.prompt === "string" &&
          typeof item.language === "string" &&
          typeof item.code === "string" &&
          typeof item.createdAt === "string"
      )
      .slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

export function useGenerationHistory() {
  const [history, setHistory] =
    useState<GenerationHistoryItem[]>(loadHistory);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
      );
    } catch {
      // Keep the current session usable if storage is unavailable.
    }
  }, [history]);

  const addEntry = useCallback(
    (entry: Omit<GenerationHistoryItem, "id" | "createdAt">) => {
      const newEntry: GenerationHistoryItem = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      setHistory((current) =>
        [newEntry, ...current].slice(0, MAX_HISTORY_ITEMS)
      );

      return newEntry;
    },
    []
  );

  const removeEntry = useCallback((id: string) => {
    setHistory((current) =>
      current.filter((item) => item.id !== id)
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addEntry,
    removeEntry,
    clearHistory,
  };
}

export default useGenerationHistory;
