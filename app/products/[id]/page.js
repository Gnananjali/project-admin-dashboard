"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";

import { fetchProductById } from "@/api/products";
import { useProducts } from "@/context/ProductContext";

function ProductDetailsContent({ id }) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [selectedImage, setSelectedImage] = useState(null);

  const { getProduct } = useProducts();

  function load() {
    setStatus("loading");

    const localProduct = getProduct(id);

    if (localProduct) {
      setProduct(localProduct);
      setSelectedImage(localProduct.thumbnail || localProduct.images?.[0]);
      setStatus("success");
      return;
    }

    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.thumbnail || data.images?.[0]);
        setStatus("success");
      })
      .catch((err) => {
        if (err.status === 404) {
          setStatus("notfound");
        } else {
          setStatus("error");
        }
      });
  }

  useEffect(() => {
    load();
  }, [id]);

  if (status === "loading") {
    return <Loader label="Loading product..." />;
  }

  if (status === "notfound") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
            ?
          </div>

          <h1 className="mt-4 text-lg font-semibold text-slate-900">
            Product not found
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            There&apos;s no product with id &quot;{id}&quot;.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-flex rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-signal-dark"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
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

  const gallery = [
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...(product.images || []).filter(
      (image) => image !== product.thumbnail
    ),
  ];

  const mainImage = selectedImage || gallery[0];

  const stockLabel =
    product.stock === 0
      ? "Out of stock"
      : product.stock < 10
      ? "Low stock"
      : "In stock";

  const stockClass =
    product.stock === 0
      ? "bg-red-50 text-red-700"
      : product.stock < 10
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to products
        </Link>

        {/* Main product card */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            {/* Images */}
            <div className="border-b border-slate-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    No image available
                  </div>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((src, index) => (
                    <button
                      key={`${src}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(src)}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 transition ${
                        selectedImage === src
                          ? "border-signal"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product information */}
            <div className="flex flex-col p-6 sm:p-8">
              <div>
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                  {product.category}
                </span>

                <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {product.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1.5 text-sm font-medium text-amber-700">
                    ★ {product.rating ?? "—"}
                  </span>

                  <span
                    className={`inline-flex rounded-md px-2.5 py-1.5 text-sm font-medium ${stockClass}`}
                  >
                    {stockLabel}
                  </span>

                  <span className="text-sm text-slate-500">
                    {product.stock} units
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-3xl font-semibold tracking-tight text-slate-900">
                    ${product.price}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Description
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {product.description || "No description available."}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-5">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-signal-dark sm:w-auto"
                >
                  Edit product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Reviews
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Customer feedback for this product
              </p>
            </div>

            {product.reviews?.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {product.reviews.length}{" "}
                {product.reviews.length === 1 ? "review" : "reviews"}
              </span>
            )}
          </div>

          {(!product.reviews || product.reviews.length === 0) && (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm font-medium text-slate-600">
                No reviews yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Customer reviews will appear here when available.
              </p>
            </div>
          )}

          {product.reviews?.length > 0 && (
            <div className="mt-5 divide-y divide-slate-100">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {review.reviewerName}
                      </p>

                      {review.date && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {review.date}
                        </p>
                      )}
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                      ★ {review.rating}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ProductDetailsPage({ params }) {
  return (
    <ProtectedRoute>
      <Header />
      <ProductDetailsContent id={params.id} />
    </ProtectedRoute>
  );
}