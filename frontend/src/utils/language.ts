
export interface LanguageInfo {
  id: string;
  label: string;
  extensions: string[];
}

export const supportedLanguages: LanguageInfo[] = [
  {
    id: "python",
    label: "Python",
    extensions: [".py", ".pyw"],
  },
  {
    id: "javascript",
    label: "JavaScript",
    extensions: [".js", ".jsx", ".mjs", ".cjs"],
  },
  {
    id: "typescript",
    label: "TypeScript",
    extensions: [".ts", ".tsx", ".mts", ".cts"],
  },
  {
    id: "java",
    label: "Java",
    extensions: [".java"],
  },
  {
    id: "cpp",
    label: "C++",
    extensions: [".cpp", ".cc", ".cxx", ".hpp"],
  },
  {
    id: "c",
    label: "C",
    extensions: [".c", ".h"],
  },
  {
    id: "go",
    label: "Go",
    extensions: [".go"],
  },
  {
    id: "rust",
    label: "Rust",
    extensions: [".rs"],
  },
  {
    id: "php",
    label: "PHP",
    extensions: [".php"],
  },
  {
    id: "ruby",
    label: "Ruby",
    extensions: [".rb"],
  },
  {
    id: "html",
    label: "HTML",
    extensions: [".html", ".htm"],
  },
  {
    id: "css",
    label: "CSS",
    extensions: [".css", ".scss", ".sass"],
  },
  {
    id: "sql",
    label: "SQL",
    extensions: [".sql"],
  },
  {
    id: "bash",
    label: "Bash",
    extensions: [".sh", ".bash"],
  },
];

export function getLanguageLabel(language: string): string {
  const normalized = language.toLowerCase();

  return (
    supportedLanguages.find(
      (item) => item.id === normalized
    )?.label || language
  );
}

export function detectLanguageFromFilename(
  filename: string
): string {
  const normalized = filename.toLowerCase();

  const language = supportedLanguages.find((item) =>
    item.extensions.some((extension) =>
      normalized.endsWith(extension)
    )
  );

  return language?.id || "text";
}

export function getSupportedExtensions(): string[] {
  return supportedLanguages.flatMap(
    (language) => language.extensions
  );
}

export function isSupportedLanguage(language: string): boolean {
  return supportedLanguages.some(
    (item) => item.id === language.toLowerCase()
  );
}
