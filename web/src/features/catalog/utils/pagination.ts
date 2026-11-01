export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Pure pagination utility guaranteeing:
 * 1. Zero duplicate items across distinct pages
 * 2. Zero skipped items
 * 3. Graceful handling of out-of-bound pages
 */
export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginationResult<T> {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(Math.max(1, Math.floor(page)), totalPages);

  const startIndex = (safePage - 1) * safePageSize;
  const endIndex = Math.min(startIndex + safePageSize, totalItems);

  const paginatedItems = totalItems > 0 ? items.slice(startIndex, endIndex) : [];

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage: safePage,
    pageSize: safePageSize,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
    startIndex: totalItems === 0 ? 0 : startIndex + 1,
    endIndex,
  };
}

/**
 * Returns an array of page numbers with ellipsis for responsive pagination navigation.
 * E.g., for page 15 of 42: [1, 'ellipsis', 14, 15, 16, 'ellipsis', 42]
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  delta = 1
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const range: number[] = [];
  const rangeWithDots: (number | "ellipsis")[] = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    rangeWithDots.push(1, "ellipsis");
  } else {
    rangeWithDots.push(1);
    if (!range.includes(2) && totalPages > 2) {
      range.unshift(2);
    }
  }

  rangeWithDots.push(...range);

  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push("ellipsis", totalPages);
  } else {
    if (!range.includes(totalPages - 1) && totalPages > 2 && rangeWithDots[rangeWithDots.length - 1] !== totalPages - 1) {
      rangeWithDots.push(totalPages - 1);
    }
    if (rangeWithDots[rangeWithDots.length - 1] !== totalPages) {
      rangeWithDots.push(totalPages);
    }
  }

  // Deduplicate consecutive entries if any
  return rangeWithDots.filter((val, idx, arr) => idx === 0 || val !== arr[idx - 1]);
}


