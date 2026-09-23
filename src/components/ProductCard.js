import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ products, onDelete }) {
  return (
    <div className="flex flex-col gap-3 sm:hidden">
      {products.map((p) => (
        <div key={p.id} className="rounded-lg border border-ink-100 p-3">
          <Link href={`/products/${p.id}`} className="flex gap-3">
            <Image
              src={p.thumbnail || "https://placehold.co/80x80"}
              alt={p.title}
              width={56}
              height={56}
              className="h-14 w-14 rounded-md object-cover"
              unoptimized
            />
            <div className="flex-1">
              <p className="font-medium text-ink-900">{p.title}</p>
              <p className="text-xs text-ink-500">{p.category}</p>
              <div className="mt-1 flex gap-3 text-xs text-ink-500">
                <span className="font-mono text-ink-900">${p.price}</span>
                <span>★ {p.rating}</span>
                <span>{p.stock} in stock</span>
              </div>
            </div>
          </Link>
          <div className="mt-3 flex gap-2">
            <Link
              href={`/products/${p.id}/edit`}
              className="flex-1 rounded-md border border-ink-100 py-1.5 text-center text-xs font-medium text-ink-700"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(p)}
              className="flex-1 rounded-md border border-bad/30 py-1.5 text-xs font-medium text-bad"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
