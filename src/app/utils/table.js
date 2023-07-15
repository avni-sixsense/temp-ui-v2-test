export const TABLE_CONST = { DEFAULT_PAGE: 1, DEFAULT_ROWS_PER_PAGE: 30 };

export function getLimitOffset(page, rowsPerPage) {
  const limit = rowsPerPage;
  const offset = rowsPerPage * (page - 1);

  return { limit, offset };
}
