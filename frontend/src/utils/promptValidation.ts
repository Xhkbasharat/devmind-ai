
export interface PromptValidationResult {
  valid: boolean;
  error: string | null;
}

export const MAX_PROMPT_LENGTH = 4000;

export function validatePrompt(
  prompt: string,
  maxLength: number = MAX_PROMPT_LENGTH
): PromptValidationResult {
  if (!prompt || !prompt.trim()) {
    return {
      valid: false,
      error: "Please enter instructions for code generation.",
    };
  }

  if (prompt.length > maxLength) {
    return {
      valid: false,
      error: `Instructions cannot exceed ${maxLength.toLocaleString()} characters.`,
    };
  }

  if (prompt.includes("\0")) {
    return {
      valid: false,
      error: "Instructions contain invalid characters.",
    };
  }

  return {
    valid: true,
    error: null,
  };
}

export default validatePrompt;
