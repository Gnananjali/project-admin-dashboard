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

  const { getProduct, updateProduct: saveLocalProduct } = useProducts();

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
      <ErrorState
        message="Could not load this product."
        onRetry={load}
      />
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-lg font-semibold text-ink-900">
        Edit product
      </h1>

      <p className="mt-1 text-sm text-ink-500">
        Note: the demo API doesn't persist edits (see README).
      </p>

      <div className="mt-5">
        <ProductForm
          initialValues={{
            title: product.title,
            category: product.category,
            price: String(product.price),
            stock: String(product.stock),
            description: product.description,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
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