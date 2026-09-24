"use client";

import { useState } from "react";

const EMPTY = {
  title: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  thumbnail: "",
};

function validate(values) {
  const errors = {};

  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.category.trim()) errors.category = "Category is required.";

  const price = Number(values.price);
  if (values.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  const stock = Number(values.stock);
  if (
    values.stock === "" ||
    Number.isNaN(stock) ||
    stock < 0 ||
    !Number.isInteger(stock)
  ) {
    errors.stock = "Enter stock as a whole number, 0 or more.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  return errors;
}

export default function ProductForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
}) {
  const [values, setValues] = useState({
    ...EMPTY,
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field, value) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear the field's error as the user fixes it
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Prevent rapid double submissions
    if (submitting) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      await onSubmit({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="space-y-5">
        {/* Title */}
        <Field label="Title" error={errors.title} required>
          <input
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="input"
            placeholder="Enter product title"
          />
        </Field>

        {/* Category */}
        <Field label="Category" error={errors.category} required>
          <input
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="input"
            placeholder="e.g. smartphones"
          />
        </Field>

        {/* Image URL */}
        <Field label="Image URL">
          <input
            type="url"
            value={values.thumbnail}
            onChange={(e) => handleChange("thumbnail", e.target.value)}
            className="input"
            placeholder="https://example.com/product.jpg"
          />

          {values.thumbnail && (
            <div className="mt-3 flex items-center gap-3">
              <div className="h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img
                  src={values.thumbnail}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-600">
                  Image preview
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  This image will be used for the product.
                </p>
              </div>
            </div>
          )}
        </Field>

        {/* Price + Stock */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Price ($)" error={errors.price} required>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="input"
              placeholder="0.00"
            />
          </Field>

          <Field label="Stock" error={errors.stock} required>
            <input
              type="number"
              min="0"
              step="1"
              value={values.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              className="input"
              placeholder="0"
            />
          </Field>
        </div>

        {/* Description */}
        <Field label="Description" error={errors.description} required>
          <textarea
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={5}
            className="input resize-none"
            placeholder="Describe the product..."
          />
        </Field>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-w-[110px] items-center justify-center rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-signal-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>

          {submitting && (
            <span className="text-xs text-slate-400">
              Please wait...
            </span>
          )}
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.625rem;
          background: #ffffff;
          padding: 0.65rem 0.8rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #0f172a;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .input::placeholder {
          color: #94a3b8;
        }

        .input:hover {
          border-color: #cbd5e1;
        }

        .input:focus {
          outline: none;
          border-color: #c8712b;
          box-shadow: 0 0 0 3px rgba(200, 113, 43, 0.12);
        }

        .input:disabled {
          background: #f8fafc;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

function Field({ label, error, required, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {children}

      {error && (
        <span className="text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}