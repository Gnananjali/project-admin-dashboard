"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FilterSort from "@/components/FilterSort";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import ConfirmDialog from "@/components/ConfirmDialog";
import useDebounce from "@/hooks/useDebounce";
import { fetchProducts, fetchCategories, deleteProduct } from "@/api/products";
import Link from "next/link";
import { useProducts } from "@/context/ProductContext";

// Read a positive integer from the URL, falling back to a default when the
// value is missing, non-numeric, or nonsensical (?page=abc, ?page=-3).
function parseIntParam(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
  mutations,
  applyMutations,
  deleteProduct: saveDeletedProduct,
} = useProducts();



  const page = parseIntParam(searchParams.get("page"), 1);
  const pageSize = [10, 20, 50].includes(Number(searchParams.get("pageSize")))
    ? Number(searchParams.get("pageSize"))
    : 10;
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || ""; // e.g. "price-asc"

  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error | empty
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Tracks the most recent request so a slow, older response can never
  // overwrite a newer one (the "type fast, old results replace new ones"
  // problem called out in the assignment).
  const latestRequestId = useRef(0);
  const abortControllerRef = useRef(null);
  const skipLoadingRef = useRef(false);

  function updateParams(next) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/products?${params.toString()}`);
  }

  // Push debounced search text into the URL, resetting to page 1.
  useEffect(() => {
    if (debouncedSearch === q) return;
    updateParams({ q: debouncedSearch, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Load categories once.
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([])); // non-fatal: filters just won't populate
  }, []);

  const loadProducts = useCallback(() => {
    const requestId = ++latestRequestId.current;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!skipLoadingRef.current) {
  setStatus("loading");
}

skipLoadingRef.current = false;
setErrorMessage("");

    const [sortBy, order] = sortParam ? sortParam.split("-") : ["", "asc"];

    fetchProducts({ page, limit: pageSize, q, category, sortBy, order, signal: controller.signal })
      .then((data) => {
      if (requestId !== latestRequestId.current) return;

      

      const mergedProducts = applyMutations(data.products).filter(
  (product) =>
    !mutations.added.some(
      (addedProduct) => addedProduct.id === product.id
    )
);

const localAdded =
  page === 1
    ? mutations.added.filter((product) => {
        const matchesSearch =
          !q ||
          product.title.toLowerCase().includes(q.toLowerCase());

        const matchesCategory =
          !category || product.category === category;

        return matchesSearch && matchesCategory;
      })
    : [];

const productsWithLocalAdds = [
  ...localAdded,
  ...mergedProducts,
];

      const uniqueProducts = Array.from(
        new Map(
  productsWithLocalAdds.map((product) => [product.id, product])
).values()
      );

      const localAddedCount = mutations.added.filter((product) => {
  const matchesSearch =
    !q ||
    product.title.toLowerCase().includes(q.toLowerCase());

  const matchesCategory =
    !category || product.category === category;

  return matchesSearch && matchesCategory;
}).length;

     

const deletedFromApiCount = mutations.deleted.filter(
  (id) => !mutations.added.some((product) => product.id === id)
).length;

const adjustedTotal = Math.max(
  0,
  data.total + localAddedCount - deletedFromApiCount
);

const totalPages = Math.max(
  1,
  Math.ceil(adjustedTotal / pageSize)
);

if (page > totalPages) {
  updateParams({ page: totalPages });
  return;
}

setProducts(uniqueProducts);
setTotal(adjustedTotal);
setStatus(uniqueProducts.length === 0 ? "empty" : "success");
    })
      .catch((err) => {
        if (err.raw?.code === "ERR_CANCELED") return; // expected when a newer request supersedes this one
        if (requestId !== latestRequestId.current) return;
        setStatus("error");
        setErrorMessage(err.message || "Could not load products.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, q, category, sortParam, mutations]);

  useEffect(() => {
    loadProducts();
    return () => abortControllerRef.current?.abort();
  }, [loadProducts]);

  function handleCategoryChange(newCategory) {
    updateParams({ category: newCategory, page: 1 });
  }

  function handleSortChange(newSort) {
    updateParams({ sort: newSort });
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage });
  }

  function handlePageSizeChange(newSize) {
    updateParams({ pageSize: newSize, page: 1 });
  }

  async function confirmDelete() {
  if (!deleteTarget) return;

  setDeleting(true);

  const isLocalProduct = mutations.added.some(
    (product) => product.id === deleteTarget.id
  );

  try {
    if (!isLocalProduct) {
      await deleteProduct(deleteTarget.id);
    }

    skipLoadingRef.current = true;
    saveDeletedProduct(deleteTarget.id);

    setProducts((prev) =>
      prev.filter((p) => p.id !== deleteTarget.id)
    );

    setTotal((prev) => Math.max(0, prev - 1));
    setDeleteTarget(null);
  } catch (err) {
    setErrorMessage(err.message || "Could not delete this product.");
  } finally {
    setDeleting(false);
  }
}

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="sticky top-0 z-30 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Products
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage your product catalog
      </p>
    </div>

    <Link
      href="/products/new"
      className="inline-flex items-center justify-center rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-signal-dark"
    >
      + Add product
    </Link>
  </div>
</div>

        <div className="sticky top-[89px] z-20 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">

    <div className="min-w-0 flex-1">
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <FilterSort
        categories={categories}
        category={category}
        onCategoryChange={handleCategoryChange}
        sort={sortParam}
        onSortChange={handleSortChange}
        searchActive={Boolean(q)}
      />

      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setViewMode("table")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            viewMode === "table"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          ▤ Table
        </button>

        <button
          type="button"
          onClick={() => setViewMode("cards")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            viewMode === "cards"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          ▦ Cards
        </button>
      </div>
    </div>

  </div>
</div>

        <div className="mt-5">
          {status === "loading" && <Loader label="Loading products..." />}
          {status === "error" && <ErrorState message={errorMessage} onRetry={loadProducts} />}
          {status === "empty" && (
            <EmptyState title="No products found" hint="Try a different search term or category." />
          )}
          {status === "success" && (
            <>
              {viewMode === "table" ? (
  <ProductTable
    products={products}
    onDelete={setDeleteTarget}
  />
) : (
  <ProductCard
    products={products}
    onDelete={setDeleteTarget}
  />
)}
              <div className="mt-4">
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this product?"
        message={deleteTarget ? `"${deleteTarget.title}" will be removed from this list.` : ""}
        confirmLabel="Delete"
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Loader label="Loading products..." />}>
        <ProductsPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
