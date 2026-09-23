import Image from "next/image";
import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <table className="hidden w-full text-left text-sm sm:table">
      <thead>
        <tr className="border-b border-ink-100 text-ink-500">
          <th className="py-2 pr-3 font-medium">Product</th>
          <th className="py-2 pr-3 font-medium">Category</th>
          <th className="py-2 pr-3 font-medium">Price</th>
          <th className="py-2 pr-3 font-medium">Rating</th>
          <th className="py-2 pr-3 font-medium">Stock</th>
          <th className="py-2 pr-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b border-ink-50 align-middle">
            <td className="py-2.5 pr-3">
              <Link href={`/products/${p.id}`} className="flex items-center gap-3 hover:text-signal">
                <Image
                  src={p.thumbnail || "https://placehold.co/80x80"}
                  alt={p.title}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-md object-cover"
                  unoptimized
                />
                <span className="font-medium text-ink-900">{p.title}</span>
              </Link>
            </td>
            <td className="py-2.5 pr-3 text-ink-500">{p.category}</td>
            <td className="py-2.5 pr-3 font-mono text-ink-900">${p.price}</td>
            <td className="py-2.5 pr-3 text-ink-500">{p.rating}</td>
            <td className="py-2.5 pr-3 text-ink-500">{p.stock}</td>
            <td className="py-2.5 pr-3">
              <div className="flex gap-2">
                <Link
                  href={`/products/${p.id}/edit`}
                  className="rounded-md border border-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700 hover:bg-ink-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(p)}
                  className="rounded-md border border-bad/30 px-2.5 py-1 text-xs font-medium text-bad hover:bg-bad/5"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
