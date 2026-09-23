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
    console.log("BEFORE CREATE");

    const product = await createProduct(values);

    console.log("AFTER CREATE", product);

    addProduct(product);

    console.log("AFTER ADD");

    router.push("/products");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-lg font-semibold text-ink-900">Add product</h1>
      <p className="mt-1 text-sm text-ink-500">
        Note: the demo API doesn't actually save new products (see README).
      </p>
      <div className="mt-5">
        <ProductForm onSubmit={handleSubmit} submitLabel="Add product" />
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
