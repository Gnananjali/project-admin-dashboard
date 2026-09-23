const PAGE_SIZES = [10, 20, 50];

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  // Show a small window of page numbers around the current page so this
  // doesn't turn into a huge row when there are many pages.
  const windowSize = 2;
  const pages = [];
  for (let p = Math.max(1, page - windowSize); p <= Math.min(totalPages, page + windowSize); p++) {
    pages.push(p);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-4 sm:flex-row">
      <p className="text-sm text-ink-500">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-ink-100 px-2.5 py-1.5 text-sm text-ink-700 disabled:opacity-40"
        >
          Previous
        </button>

        {pages[0] > 1 && <span className="px-1 text-ink-300">…</span>}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`h-8 w-8 rounded-md text-sm ${
              p === page ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-50"
            }`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && <span className="px-1 text-ink-300">…</span>}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md border border-ink-100 px-2.5 py-1.5 text-sm text-ink-700 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-500">
        Rows per page
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-ink-100 px-2 py-1.5 text-ink-900"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
