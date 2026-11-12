export function createTimeoutSignal(
  timeoutMs = 30000
): AbortSignal {
  return AbortSignal.timeout(Math.max(1, timeoutMs));
}

export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs = 30000
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("The operation timed out. Please try again."));
    }, Math.max(1, timeoutMs));
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}
