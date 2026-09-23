const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "rating-asc", label: "Rating: Low to high" },
  { value: "rating-desc", label: "Rating: High to low" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
];

export default function FilterSort({ categories, category, onCategoryChange, sort, onSortChange, searchActive }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-ink-500">
        Category
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={searchActive}
          title={searchActive ? "Clear the search box to filter by category" : undefined}
          className="rounded-md border border-ink-100 px-2 py-1.5 text-ink-900 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-300"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-ink-500">
        Sort by
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-md border border-ink-100 px-2 py-1.5 text-ink-900"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {searchActive && (
        <span className="text-xs text-ink-300">Category filter is off while you're searching</span>
      )}
    </div>
  );
}
