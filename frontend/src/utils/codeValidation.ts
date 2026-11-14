
export interface CodeValidationResult {
  valid: boolean;
  error: string | null;
}

export const MAX_CODE_LENGTH = 50000;

export function validateCodeInput(
  code: string,
  maxLength: number = MAX_CODE_LENGTH
): CodeValidationResult {
  if (!code || !code.trim()) {
    return {
      valid: false,
      error: "Code cannot be empty.",
    };
  }

  if (code.length > maxLength) {
    return {
      valid: false,
      error: `Code exceeds the maximum allowed length of ${maxLength.toLocaleString()} characters.`,
    };
  }

  if (code.includes("\0")) {
    return {
      valid: false,
      error: "Code contains invalid null characters.",
    };
  }

  return {
    valid: true,
    error: null,
  };
}

export default validateCodeInput;
