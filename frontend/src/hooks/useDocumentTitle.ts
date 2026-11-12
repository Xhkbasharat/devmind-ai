import { useEffect } from "react";

export default function useDocumentTitle(
  title: string,
  appName = "DevMind AI"
): void {
  useEffect(() => {
    const previousTitle = document.title;

    document.title = title
      ? `${title} | ${appName}`
      : appName;

    return () => {
      document.title = previousTitle;
    };
  }, [title, appName]);
}
