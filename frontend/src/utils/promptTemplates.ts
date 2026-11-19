
export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  language: string;
  prompt: string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "function",
    title: "Create a Function",
    description: "Generate a reusable function with clear documentation.",
    language: "python",
    prompt:
      "Create a reusable, well-documented function for the following task. Include input validation, appropriate error handling, and a short usage example.",
  },
  {
    id: "api",
    title: "Build a REST API",
    description: "Create API endpoints with validation and error handling.",
    language: "python",
    prompt:
      "Build a REST API for the following requirements. Include routes, request validation, response schemas, error handling, and clear documentation.",
  },
  {
    id: "debug",
    title: "Fix a Bug",
    description: "Identify and fix a problem in existing code.",
    language: "python",
    prompt:
      "Analyze the following code, identify likely bugs, explain their causes, and provide a corrected version. Preserve the intended behavior.",
  },
  {
    id: "frontend",
    title: "Build a Frontend Component",
    description: "Generate a reusable and responsive UI component.",
    language: "typescript",
    prompt:
      "Create a reusable, accessible, responsive frontend component. Include typed properties, sensible loading and error states, and clean component structure.",
  },
  {
    id: "tests",
    title: "Write Unit Tests",
    description: "Generate tests for important cases and edge conditions.",
    language: "python",
    prompt:
      "Write comprehensive unit tests for the following code. Cover normal behavior, edge cases, invalid inputs, and expected errors. Use clear test names.",
  },
  {
    id: "optimization",
    title: "Optimize Code",
    description: "Improve performance and maintainability.",
    language: "python",
    prompt:
      "Review and optimize the following code for performance, readability, and maintainability. Explain the important improvements and preserve its existing functionality.",
  },
  {
    id: "documentation",
    title: "Generate Documentation",
    description: "Create clear technical documentation.",
    language: "python",
    prompt:
      "Write technical documentation for the following code. Explain its purpose, parameters, return values, exceptions, dependencies, and provide usage examples.",
  },
  {
    id: "sql",
    title: "Write SQL Queries",
    description: "Generate readable and efficient database queries.",
    language: "sql",
    prompt:
      "Write an efficient and readable SQL solution for the following database requirements. Explain the query, joins, filtering, and indexing considerations where relevant.",
  },
  {
    id: "refactor",
    title: "Refactor Existing Code",
    description: "Improve code structure without changing behavior.",
    language: "python",
    prompt:
      "Refactor the following code to improve readability, modularity, and maintainability. Preserve its existing behavior and explain the major changes.",
  },
  {
    id: "security",
    title: "Security Review",
    description: "Identify potential security weaknesses.",
    language: "python",
    prompt:
      "Review the following code for potential security vulnerabilities. Explain each finding, its possible impact, and practical remediation steps. Do not claim that unverified issues are confirmed vulnerabilities.",
  },
];

export function getPromptTemplate(
  templateId: string
): PromptTemplate | undefined {
  return promptTemplates.find(
    (template) => template.id === templateId
  );
}
