interface SanitizePaginationParams {
  page?: string;
  limit?: string;
}

export function sanitizePagination({ page, limit }: SanitizePaginationParams) {
  const parsedPage = parseInt(page!, 10) || 1;
  const parsedLimit = parseLimit(limit, 10, 1, 50);
  if (parsedPage < 1 || parsedLimit < 1)
    throw new Error('Page and limit must be positive integers');
  return { page: parsedPage, limit: parsedLimit };
}

/**
 * Utility: safe parse integer with defaults and bounds
 */
function parseLimit(input: string | undefined, defaultVal = 10, min = 1, max = 50): number {
  if (!input) return defaultVal;
  const parsed = Number.parseInt(input, 10);
  if (Number.isNaN(parsed)) return defaultVal;
  return Math.min(Math.max(parsed, min), max);
}
