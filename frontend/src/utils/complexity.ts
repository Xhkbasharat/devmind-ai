
export interface ComplexityResult {
  score: number;
  level: "Low" | "Moderate" | "High";
  functionCount: number;
  conditionalCount: number;
  loopCount: number;
  nestingDepth: number;
  explanation: string;
}

export function analyzeComplexity(
  code: string,
  language: string
): ComplexityResult {
  const normalizedLanguage = language.toLowerCase();

  const functionPatterns: Record<string, RegExp> = {
    python: /^\s*def\s+\w+\s*\(/gm,
    javascript: /\bfunction\s+\w+\s*\(|\b(?:const|let|var)\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g,
    typescript: /\bfunction\s+\w+\s*\(|\b(?:const|let|var)\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g,
    java: /\b(?:public|private|protected|static|\s)+[\w<>[\]]+\s+\w+\s*\([^)]*\)\s*\{/g,
    c: /\b[\w*]+\s+\w+\s*\([^)]*\)\s*\{/g,
    cpp: /\b[\w:*&<>]+\s+\w+\s*\([^)]*\)\s*\{/g,
  };

  const functionPattern =
    functionPatterns[normalizedLanguage] ??
    /\bfunction\s+\w+\s*\(/g;

  const functionCount =
    (code.match(functionPattern) ?? []).length;

  const conditionalCount =
    (code.match(/\b(if|else if|elif|switch|case)\b/g) ?? [])
      .length;

  const loopCount =
    (code.match(/\b(for|while|do)\b/g) ?? []).length;

  const lines = code.split(/\r?\n/);

  let currentDepth = 0;
  let nestingDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (
      normalizedLanguage === "python" ||
      normalizedLanguage === "yaml"
    ) {
      const indentation = line.match(/^\s*/)?.[0].length ?? 0;
      const indentationDepth = Math.floor(indentation / 4);

      nestingDepth = Math.max(nestingDepth, indentationDepth);
    } else {
      for (const character of trimmed) {
        if (character === "{") {
          currentDepth += 1;
          nestingDepth = Math.max(
            nestingDepth,
            currentDepth
          );
        } else if (character === "}") {
          currentDepth = Math.max(0, currentDepth - 1);
        }
      }
    }
  }

  const score = Math.min(
    100,
    functionCount * 5 +
      conditionalCount * 3 +
      loopCount * 4 +
      nestingDepth * 6
  );

  const level =
    score < 25
      ? "Low"
      : score < 55
        ? "Moderate"
        : "High";

  const explanation =
    level === "Low"
      ? "The code has relatively few structural complexity indicators."
      : level === "Moderate"
        ? "The code has some structural complexity. Consider simplifying nested logic and large functions."
        : "The code has several complexity indicators. Consider splitting functions and reducing nested control flow.";

  return {
    score,
    level,
    functionCount,
    conditionalCount,
    loopCount,
    nestingDepth,
    explanation,
  };
}

export default analyzeComplexity;
