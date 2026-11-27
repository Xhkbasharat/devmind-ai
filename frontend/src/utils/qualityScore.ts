
export interface QualityScore {
  overall: number;
  maintainability: number;
  readability: number;
  complexity: number;
  documentation: number;
  grade: string;
  summary: string;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateQualityScore(
  code: string
): QualityScore {
  const lines = code.split("\n");
  const nonEmptyLines = lines.filter(
    (line) => line.trim().length > 0
  );

  if (!code.trim()) {
    return {
      overall: 0,
      maintainability: 0,
      readability: 0,
      complexity: 0,
      documentation: 0,
      grade: "N/A",
      summary: "Add code to calculate a quality estimate.",
    };
  }

  const lineCount = nonEmptyLines.length;

  const longLines = nonEmptyLines.filter(
    (line) => line.length > 100
  ).length;

  const functionCount = (
    code.match(
      /^\s*(?:async\s+)?(?:function\s+\w+|def\s+\w+)|^\s*(?:const|let|var)\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/gm
    ) || []
  ).length;

  const conditionalCount = (
    code.match(/\b(if|else|switch|case|elif)\b/g) || []
  ).length;

  const loopCount = (
    code.match(/\b(for|while|foreach)\b/g) || []
  ).length;

  const commentLines = lines.filter((line) =>
    /^\s*(#|\/\/|\/\*|\*|<!--)/.test(line)
  ).length;

  const averageFunctionDensity =
    functionCount / Math.max(lineCount, 1);

  const documentationRatio =
    commentLines / Math.max(lineCount, 1);

  const longLineRatio =
    longLines / Math.max(lineCount, 1);

  const complexityRatio =
    (conditionalCount + loopCount) /
    Math.max(lineCount, 1);

  const readability = clamp(
    100 - longLineRatio * 180
  );

  const complexity = clamp(
    100 - complexityRatio * 250
  );

  const documentation = clamp(
    documentationRatio * 500
  );

  const functionStructure = clamp(
    100 - Math.max(0, averageFunctionDensity - 0.05) * 100
  );

  const maintainability = clamp(
    readability * 0.4 +
    complexity * 0.3 +
    documentation * 0.15 +
    functionStructure * 0.15
  );

  const overall = clamp(
    maintainability * 0.4 +
    readability * 0.25 +
    complexity * 0.2 +
    documentation * 0.15
  );

  let grade = "F";

  if (overall >= 90) grade = "A";
  else if (overall >= 80) grade = "B";
  else if (overall >= 70) grade = "C";
  else if (overall >= 60) grade = "D";

  let summary =
    "The code has several opportunities for improvement.";

  if (overall >= 85) {
    summary =
      "The code has strong estimated quality indicators.";
  } else if (overall >= 70) {
    summary =
      "The code has a reasonable structure with room for improvement.";
  }

  return {
    overall,
    maintainability,
    readability,
    complexity,
    documentation,
    grade,
    summary,
  };
}
