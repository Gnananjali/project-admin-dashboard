"use client";

import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import ProductForm from "@/components/ProductForm";

import { createProduct } from "@/api/products";
import { useProducts } from "@/context/ProductContext";

function NewProductContent() {
  const { addProduct } = useProducts();
  const router = useRouter();

  async function handleSubmit(values) {
    const product = await createProduct(values);

    addProduct(product);

    router.push("/products");
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mt-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Product catalog
              </span>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Add product
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add a new product to your catalog.
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
              Demo API
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <ProductForm
            onSubmit={handleSubmit}
            submitLabel="Add product"
          />
        </div>

        {/* API note */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-100/70 px-4 py-3">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-medium text-slate-700">
              Demo API note:
            </span>{" "}
            DummyJSON does not permanently save newly added products. This app
            stores new products locally so they remain visible after adding.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <Header />
      <NewProductContent />
    </ProtectedRoute>
  );
}