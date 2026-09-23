"use client";

import { useState } from "react";

const EMPTY = { title: "", category: "", price: "", stock: "", description: "" };

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.category.trim()) errors.category = "Category is required.";

  const price = Number(values.price);
  if (values.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  const stock = Number(values.stock);
  if (values.stock === "" || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = "Enter stock as a whole number, 0 or more.";
  }

  if (!values.description.trim()) errors.description = "Description is required.";

  return errors;
}

export default function ProductForm({ initialValues, onSubmit, submitLabel = "Save" }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("FORM SUBMITTED");

    // Guard against double submits from a fast double-click, in addition
    // to disabling the button below.
    if (submitting) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    console.log("VALIDATION PASSED", values);


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
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <Field label="Title" error={errors.title}>
        <input
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Category" error={errors.category}>
        <input
          value={values.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="input"
          placeholder="e.g. smartphones"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price ($)" error={errors.price}>
          <input
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Stock" error={errors.stock}>
          <input
            type="number"
            value={values.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Description" error={errors.description}>
        <textarea
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          className="input"
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 self-start rounded-md bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-dark disabled:opacity-60"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>

      <style jsx global>{`
        .input {
          border: 1px solid #e4e7eb;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #1c2027;
        }
        .input:focus {
          outline: none;
          border-color: #c8712b;
          box-shadow: 0 0 0 1px #c8712b;
        }
      `}</style>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-ink-700">{label}</span>
      {children}
      {error && <span className="text-xs text-bad">{error}</span>}
    </label>
  );
}
