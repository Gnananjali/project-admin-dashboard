const PAGE_SIZES = [10, 20, 50];

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const windowSize = 2;
  const pages = [];

  for (
    let p = Math.max(1, page - windowSize);
    p <= Math.min(totalPages, page + windowSize);
    p++
  ) {
    pages.push(p);
  }

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Result count */}
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-700">
          {total}
        </span>
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {pages[0] > 1 && (
          <>
            <span className="px-1.5 text-sm text-slate-400">…</span>
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
              p === page
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <span className="px-1.5 text-sm text-slate-400">…</span>
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Page size */}
      <label className="flex items-center gap-2 text-sm text-slate-500">
        <span>Rows per page</span>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/10"
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