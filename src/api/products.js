import api from "@/lib/axios";

/**
 * Fetch a page of products.
 *
 * DummyJSON note: /products/search does NOT support a `category` filter,
 * and /products/category/:name does not support `q`. The API simply can't
 * do both at once. Our rule (see README): if a category is selected we
 * filter by category and ignore the search box; a live search clears any
 * selected category. This keeps the two features simple to reason about
 * instead of silently returning wrong results.
 */
export function fetchProducts({ page = 1, limit = 10, q = "", category = "", sortBy = "", order = "asc", signal }) {
  const skip = (page - 1) * limit;
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  let url = "/products";
  if (q) {
    url = "/products/search";
    params.q = q;
  } else if (category) {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  return api.get(url, { params, signal }).then((res) => res.data);
}

export function fetchCategories() {
  // DummyJSON returns an array of { slug, name, url } objects.
  return api.get("/products/categories").then((res) => res.data);
}

export function fetchProductById(id) {
  return api.get(`/products/${id}`).then((res) => res.data);
}

export function createProduct(payload) {
  // DummyJSON doesn't really persist this, but it echoes back a created
  // object with a new id, which is enough to simulate the add locally.
  return api.post("/products/add", payload).then((res) => res.data);
}

export function updateProduct(id, payload) {
  return api.put(`/products/${id}`, payload).then((res) => res.data);
}

export function deleteProduct(id) {
  return api.delete(`/products/${id}`).then((res) => res.data);
}
