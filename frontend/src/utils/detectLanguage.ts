
const extensionMap: Record<string, string> = {
  py: "python",
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  java: "java",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  cs: "csharp",
  go: "go",
  rs: "rust",
  php: "php",
  rb: "ruby",
  swift: "swift",
  kt: "kotlin",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  yml: "yaml",
  yaml: "yaml",
  md: "markdown",
};

export function detectLanguageFromCode(
  code: string
): string {
  const content = code.trim();

  if (!content) {
    return "text";
  }

  if (/^#!.*\bpython\b/m.test(content)) {
    return "python";
  }

  if (/^#!.*\b(?:bash|sh)\b/m.test(content)) {
    return "bash";
  }

  if (
    /^\s*import\s+(?:React|react)\s+from\s+["']react["']/m.test(content) ||
    /\binterface\s+\w+\s*\{/.test(content)
  ) {
    return "typescript";
  }

  if (
    /<!DOCTYPE html>|<html[\s>]/i.test(content)
  ) {
    return "html";
  }

  if (
    /^\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE TABLE)\b/im.test(content)
  ) {
    return "sql";
  }

  if (
    /^\s*def\s+\w+\s*\(|^\s*import\s+\w+/m.test(content)
  ) {
    return "python";
  }

  if (
    /\b(?:const|let|var)\s+\w+\s*=|\bconsole\.log\s*\(/.test(content)
  ) {
    return "javascript";
  }

  if (
    /^\s*public\s+class\s+\w+/m.test(content)
  ) {
    return "java";
  }

  if (
    /^\s*package\s+main\b/m.test(content)
  ) {
    return "go";
  }

  return "text";
}

export function detectLanguage(
  filename: string,
  code?: string
): string {
  const extension = filename
    .split(".")
    .pop()
    ?.toLowerCase();

  if (extension && extensionMap[extension]) {
    return extensionMap[extension];
  }

  return code
    ? detectLanguageFromCode(code)
    : "text";
}

export default detectLanguage;
