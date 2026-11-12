import { useCallback, useState } from "react";

interface ClipboardState {
  copied: boolean;
  error: string | null;
}

export default function useClipboard() {
  const [state, setState] = useState<ClipboardState>({
    copied: false,
    error: null,
  });

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable.");
      }

      await navigator.clipboard.writeText(text);

      setState({
        copied: true,
        error: null,
      });

      return true;
    } catch {
      setState({
        copied: false,
        error: "Unable to copy. Check browser clipboard permissions.",
      });

      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      copied: false,
      error: null,
    });
  }, []);

  return {
    copy,
    copied: state.copied,
    error: state.error,
    reset,
  };
}
