interface SanitizePaginationParams {
  page?: string;
  limit?: string;
}

export function sanitizePagination({ page, limit }: SanitizePaginationParams) {
  const parsedPage = parseInt(page!, 10) || 1;
  const parsedLimit = parseInt(limit!, 10) || 10;

  if (parsedPage < 1 || parsedLimit < 1) {
    throw new Error('Page and limit must be positive integers');
  }

  return { page: parsedPage, limit: parsedLimit };
}
