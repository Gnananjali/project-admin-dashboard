"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext(null);

const STORAGE_KEY = "product-mutations";

const EMPTY = {
  added: [],
  updated: {},
  deleted: [],
};

export function ProductProvider({ children }) {
  const [mutations, setMutations] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMutations(JSON.parse(stored));
      }
    } catch {
      setMutations(EMPTY);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mutations));
  }, [mutations, loaded]);

  function addProduct(product) {
  const localProduct = {
    ...product,
    id: Date.now(),
  };

  setMutations((prev) => ({
    ...prev,
    added: [...prev.added, localProduct],
  }));
}

  function updateProduct(product) {
    setMutations((prev) => ({
      ...prev,
      updated: {
        ...prev.updated,
        [product.id]: product,
      },
    }));
  }

  function deleteProduct(id) {
    setMutations((prev) => ({
      ...prev,
      added: prev.added.filter((product) => product.id !== id),
      updated: Object.fromEntries(
        Object.entries(prev.updated).filter(([key]) => key !== String(id))
      ),
      deleted: prev.deleted.includes(id)
        ? prev.deleted
        : [...prev.deleted, id],
    }));
  }

  function applyMutations(products) {
  const deleted = new Set(mutations.deleted);

  const updatedProducts = products
    .filter((product) => !deleted.has(product.id))
    .map((product) => mutations.updated[product.id] || product);

  const addedProducts = mutations.added
    .filter((product) => !deleted.has(product.id))
    .map((product) => mutations.updated[product.id] || product);

  return [...updatedProducts, ...addedProducts];
}

  function getProduct(id) {
    if (mutations.deleted.includes(Number(id))) {
      return null;
    }

    if (mutations.updated[id]) {
      return mutations.updated[id];
    }

    const added = mutations.added.find(
      (product) => String(product.id) === String(id)
    );

    return added || null;
  }

  return (
    <ProductContext.Provider
      value={{
        mutations,
        addProduct,
        updateProduct,
        deleteProduct,
        applyMutations,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }

  return context;
}