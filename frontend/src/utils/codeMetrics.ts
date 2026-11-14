
export interface CodeMetrics {
  totalLines: number;
  nonEmptyLines: number;
  commentLines: number;
  blankLines: number;
  characters: number;
  words: number;
}

export function calculateCodeMetrics(
  code: string,
  language: string
): CodeMetrics {
  const lines = code.split(/\r?\n/);

  const blankLines = lines.filter(
    (line) => line.trim().length === 0
  ).length;

  const nonEmptyLines = lines.length - blankLines;

  const commentPrefixes: Record<string, string[]> = {
    python: ["#"],
    javascript: ["//"],
    typescript: ["//"],
    java: ["//"],
    c: ["//"],
    cpp: ["//"],
    csharp: ["//"],
    go: ["//"],
    rust: ["//"],
    php: ["//", "#"],
    ruby: ["#"],
    shell: ["#"],
    bash: ["#"],
    yaml: ["#"],
    sql: ["--"],
  };

  const prefixes = commentPrefixes[language.toLowerCase()] ?? [];

  const commentLines = lines.filter((line) => {
    const trimmed = line.trim();

    return (
      trimmed.length > 0 &&
      prefixes.some((prefix) => trimmed.startsWith(prefix))
    );
  }).length;

  const words = code.trim()
    ? code.trim().split(/\s+/).length
    : 0;

  return {
    totalLines: lines.length,
    nonEmptyLines,
    commentLines,
    blankLines,
    characters: code.length,
    words,
  };
}

export default calculateCodeMetrics;
