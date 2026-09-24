import Image from "next/image";
import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3.5 font-medium text-slate-500">
                Product
              </th>
              <th className="px-4 py-3.5 font-medium text-slate-500">
                Category
              </th>
              <th className="px-4 py-3.5 font-medium text-slate-500">
                Price
              </th>
              <th className="px-4 py-3.5 font-medium text-slate-500">
                Rating
              </th>
              <th className="px-4 py-3.5 font-medium text-slate-500">
                Stock
              </th>
              <th className="px-5 py-3.5 text-right font-medium text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr
                key={p.id}
                className="group transition-colors hover:bg-slate-50/70"
              >
                {/* Product */}
                <td className="px-5 py-4">
                  <Link
                    href={`/products/${p.id}`}
                    className="flex min-w-[220px] items-center gap-3"
                  >
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      <Image
                        src={
                          p.thumbnail ||
                          "https://placehold.co/80x80"
                        }
                        alt={p.title}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        unoptimized
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {p.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Product #{p.id}
                      </p>
                    </div>
                  </Link>
                </td>

                {/* Category */}
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                    {p.category}
                  </span>
                </td>

                {/* Price */}
                <td className="px-4 py-4">
                  <span className="font-semibold text-slate-900">
                    ${p.price}
                  </span>
                </td>

                {/* Rating */}
                <td className="px-4 py-4">
                  <div className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                    <span>★</span>
                    <span>{p.rating ?? "—"}</span>
                  </div>
                </td>

                {/* Stock */}
                <td className="px-4 py-4">
                  <span
                    className={
                      p.stock === 0
                        ? "text-sm font-medium text-red-600"
                        : p.stock < 10
                        ? "text-sm font-medium text-amber-600"
                        : "text-sm font-medium text-slate-700"
                    }
                  >
                    {p.stock}
                  </span>

                  <span className="ml-1 text-xs text-slate-400">
                    in stock
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/products/${p.id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(p)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}