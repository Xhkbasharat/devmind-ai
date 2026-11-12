export function formatDate(
  value: string | number | Date,
  locale = "en-IN"
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(
  value: string | number | Date,
  locale = "en-IN"
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeTime(
  value: string | number | Date
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let remaining = seconds;

  for (const [limit, unit] of intervals) {
    if (Math.abs(remaining) < limit) {
      return formatter.format(Math.round(remaining), unit);
    }

    remaining /= limit;
  }

  return formatter.format(Math.round(remaining), "year");
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "Invalid size";
  }

  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const size = bytes / Math.pow(1024, index);

  return `${size.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

export function truncateText(
  value: string,
  maxLength = 100
): string {
  if (maxLength < 0) {
    return value;
  }

  if (value.length <= maxLength) {
    return value;
  }

  if (maxLength <= 3) {
    return ".".repeat(maxLength);
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
      }
