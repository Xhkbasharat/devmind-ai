export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export function validateEmail(email: string): ValidationResult {
  const value = email.trim();

  if (!value) {
    return {
      isValid: false,
      message: "Email address is required.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    return {
      isValid: false,
      message: "Enter a valid email address.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

export function validateUsername(
  username: string
): ValidationResult {
  const value = username.trim();

  if (!value) {
    return {
      isValid: false,
      message: "Username is required.",
    };
  }

  if (value.length < 3 || value.length > 30) {
    return {
      isValid: false,
      message: "Username must contain 3–30 characters.",
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return {
      isValid: false,
      message: "Use only letters, numbers, and underscores.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

export function validatePassword(
  password: string
): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      message: "Password is required.",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must contain at least 8 characters.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

export function validateRequired(
  value: string,
  fieldName = "This field"
): ValidationResult {
  if (!value.trim()) {
    return {
      isValid: false,
      message: `${fieldName} is required.`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: "Passwords do not match.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
  }
