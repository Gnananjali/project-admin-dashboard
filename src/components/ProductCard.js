import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ products, onDelete }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <div
          key={p.id}
          className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          {/* Image */}
          <Link href={`/products/${p.id}`} className="block">
            <div className="relative h-48 overflow-hidden bg-slate-50">
              <Image
                src={p.thumbnail || "https://placehold.co/300x200"}
                alt={p.title}
                width={300}
                height={200}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            </div>
          </Link>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/products/${p.id}`}>
                  <h3 className="truncate font-semibold text-slate-900 hover:text-signal">
                    {p.title}
                  </h3>
                </Link>

                <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                  {p.category}
                </span>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                ★ {p.rating ?? "—"}
              </span>
            </div>

            {/* Price + Stock */}
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-xl font-semibold text-slate-900">
                  ${p.price}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {p.stock} in stock
                </p>
              </div>

              <Link
                href={`/products/${p.id}`}
                className="text-xs font-medium text-slate-500 transition hover:text-signal"
              >
                View details →
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-slate-100 bg-slate-50/50 p-3">
            <Link
              href={`/products/${p.id}/edit`}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => onDelete(p)}
              className="flex-1 rounded-lg border border-red-200 bg-white py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}