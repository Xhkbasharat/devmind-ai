
import { getSupportedExtensions } from "./language";

const languageExtensions: Record<string, string> = {
  python: ".py",
  javascript: ".js",
  typescript: ".ts",
  java: ".java",
  cpp: ".cpp",
  c: ".c",
  go: ".go",
  rust: ".rs",
  php: ".php",
  ruby: ".rb",
  html: ".html",
  css: ".css",
  sql: ".sql",
  bash: ".sh",
};

export function downloadCode(
  code: string,
  language: string,
  filename?: string
): void {
  if (!code.trim()) {
    throw new Error("There is no code available to download.");
  }

  const extension = languageExtensions[language.toLowerCase()] || ".txt";

  const safeName = (filename || "devmind-generated-code")
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\.+$/, "")
    .slice(0, 100) || "devmind-generated-code";

  const hasSupportedExtension = getSupportedExtensions().some(
    (item) => safeName.toLowerCase().endsWith(item)
  );

  const finalName = hasSupportedExtension
    ? safeName
    : `${safeName}${extension}`;

  const blob = new Blob([code], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = finalName;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export default downloadCode;
