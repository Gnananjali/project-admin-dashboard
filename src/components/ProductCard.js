import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ products, onDelete }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <div
          key={p.id}
          className="group overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <Link href={`/products/${p.id}`} className="block">
            <div className="relative flex h-44 items-center justify-center bg-ink-50">
              <Image
                src={
                  p.thumbnail ||
                  "https://placehold.co/300x200"
                }
                alt={p.title}
                width={300}
                height={200}
                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                unoptimized
              />
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-ink-900">
                    {p.title}
                  </h3>

                  <span className="mt-1 inline-block rounded-full bg-ink-50 px-2 py-1 text-xs text-ink-600">
                    {p.category}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-medium text-ink-900">
                  ★ {p.rating}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xl font-semibold text-ink-900">
                    ${p.price}
                  </p>

                  <p className="mt-1 text-xs text-ink-500">
                    {p.stock} in stock
                  </p>
                </div>

                <span className="text-xs text-ink-500">
                  View details →
                </span>
              </div>
            </div>
          </Link>

          <div className="flex gap-2 border-t border-ink-100 p-3">
            <Link
              href={`/products/${p.id}/edit`}
              className="flex-1 rounded-md border border-ink-100 py-2 text-center text-sm font-medium text-ink-700 transition hover:bg-ink-50"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => onDelete(p)}
              className="flex-1 rounded-md border border-bad/30 py-2 text-sm font-medium text-bad transition hover:bg-bad/5"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}