
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
    description: "Generate a reusable function with clear logic.",
    language: "python",
    prompt:
      "Create a reusable Python function that performs the following task. Include input validation, clear variable names, and helpful comments.",
  },
  {
    id: "api",
    title: "Build a REST API",
    description: "Generate API endpoints with request validation.",
    language: "python",
    prompt:
      "Build a REST API using FastAPI. Include request validation, appropriate HTTP status codes, error handling, and clear endpoint documentation.",
  },
  {
    id: "debug",
    title: "Solve a Coding Problem",
    description: "Generate a solution with an explanation.",
    language: "python",
    prompt:
      "Solve the following programming problem. Provide an efficient solution, explain the approach, and include relevant edge cases.",
  },
  {
    id: "frontend",
    title: "Create a UI Component",
    description: "Generate a reusable React component.",
    language: "typescript",
    prompt:
      "Create a reusable React component using TypeScript. Include typed props, accessible markup, and clean component structure.",
  },
  {
    id: "tests",
    title: "Write Unit Tests",
    description: "Generate tests for existing code.",
    language: "python",
    prompt:
      "Write comprehensive unit tests for the supplied code. Cover normal cases, edge cases, invalid inputs, and expected errors.",
  },
  {
    id: "optimization",
    title: "Optimize Code",
    description: "Improve performance and readability.",
    language: "python",
    prompt:
      "Review the supplied code and produce an optimized version. Improve performance, readability, and maintainability while preserving its behavior.",
  },
];

export function getPromptTemplate(
  id: string
): PromptTemplate | undefined {
  return promptTemplates.find((template) => template.id === id);
}

export default promptTemplates;
