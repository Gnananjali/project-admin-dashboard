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

  const { getProduct } = useProducts();

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
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-lg font-semibold text-ink-900">
          Product not found
        </h1>

        <p className="mt-2 text-sm text-ink-500">
          There's no product with id "{id}".
        </p>

        <Link
          href="/products"
          className="mt-4 inline-block text-sm font-medium text-signal"
        >
          Back to products
        </Link>
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

  const mainImage = product.images?.[0] || product.thumbnail;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Link
        href="/products"
        className="text-sm text-ink-500 hover:text-signal"
      >
        ← Back to products
      </Link>

      <div className="mt-4 grid gap-8 sm:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-ink-100">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.title}
                width={500}
                height={500}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-ink-50 text-sm text-ink-400">
                No image available
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`${product.title} ${i + 1}`}
                  width={72}
                  height={72}
                  className="h-16 w-16 rounded-md border border-ink-100 object-cover"
                  unoptimized
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink-300">
            {product.category}
          </p>

          <h1 className="mt-1 text-xl font-semibold text-ink-900">
            {product.title}
          </h1>

          <p className="mt-2 font-mono text-lg text-ink-900">
            ${product.price}
          </p>

          <p className="mt-1 text-sm text-ink-500">
            ★ {product.rating || "N/A"} · {product.stock} in stock
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink-700">
            {product.description}
          </p>

          <Link
            href={`/products/${product.id}/edit`}
            className="mt-5 inline-block rounded-md bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-dark"
          >
            Edit product
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-base font-semibold text-ink-900">
          Reviews
        </h2>

        {(!product.reviews || product.reviews.length === 0) && (
          <p className="mt-2 text-sm text-ink-500">
            No reviews yet.
          </p>
        )}

        <div className="mt-3 flex flex-col gap-3">
          {product.reviews?.map((review, i) => (
            <div
              key={i}
              className="rounded-lg border border-ink-100 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink-900">
                  {review.reviewerName}
                </span>

                <span className="text-xs text-ink-500">
                  ★ {review.rating}
                </span>
              </div>

              <p className="mt-1 text-sm text-ink-700">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </section>
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