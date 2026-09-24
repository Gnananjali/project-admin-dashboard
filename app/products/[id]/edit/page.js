"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ProductForm from "@/components/ProductForm";

import { fetchProductById, updateProduct } from "@/api/products";
import { useProducts } from "@/context/ProductContext";

function EditProductContent({ id }) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  const router = useRouter();

  const {
    getProduct,
    updateProduct: saveLocalProduct,
  } = useProducts();

  function load() {
    setStatus("loading");

    const localProduct = getProduct(id);

    if (localProduct) {
      setProduct(localProduct);
      setStatus("success");
      return;
    }

    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSubmit(values) {
    const localProduct = getProduct(id);

    if (localProduct) {
      saveLocalProduct({
        ...localProduct,
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      });

      router.push(`/products/${id}`);
      return;
    }

    const updatedProduct = await updateProduct(id, values);

    saveLocalProduct({
      ...product,
      ...values,
      ...updatedProduct,
      id: product.id,
    });

    router.push(`/products/${id}`);
  }

  if (status === "loading") {
    return <Loader label="Loading product..." />;
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ErrorState
          message="Could not load this product."
          onRetry={load}
        />
      </div>
    );
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
                Product #{product.id}
              </span>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Edit product
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Update the product information below.
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
              Demo API
            </span>
          </div>
        </div>

        {/* Form card */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <ProductForm
            initialValues={{
              title: product.title,
              category: product.category,
              price: String(product.price),
              stock: String(product.stock),
              description: product.description,
              thumbnail: product.thumbnail || "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        </div>

        {/* API note */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-100/70 px-4 py-3">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-medium text-slate-700">
              Demo API note:
            </span>{" "}
            DummyJSON does not permanently persist product edits. Changes are
            stored locally in this app so they remain visible after saving.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function EditProductPage({ params }) {
  return (
    <ProtectedRoute>
      <Header />
      <EditProductContent id={params.id} />
    </ProtectedRoute>
  );
}