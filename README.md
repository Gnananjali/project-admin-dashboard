# Product Admin Dashboard

A small admin dashboard for logging in and managing products, built on the
free [DummyJSON](https://dummyjson.com) API.

Stack: Next.js (App Router) · React · Tailwind CSS · Axios.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000. Log in with:

- **Username:** `emilys`
- **Password:** `emilyspass`

To build for production:

```bash
npm run build
npm start
```

No environment variables are needed — the API base URL is set in
`src/lib/axios.js`.

## Project structure

```
app/                         Routes (App Router)
  login/page.js               Login page
  products/page.js            Product list (search, filter, sort, pagination)
  products/[id]/page.js       Product details + reviews
  products/[id]/edit/page.js  Edit product
  products/new/page.js        Add product
src/
  api/                        One file per API resource (auth, products)
  lib/axios.js                Shared Axios instance: auth header + error handling
  lib/auth.js                 localStorage token helpers
  context/AuthContext.js      Login state, shared across the app
  components/                 Small, focused UI components
  hooks/useDebounce.js        Debounce hook used by the search box
```

## What's finished

- Login with the DummyJSON credentials above, with an inline error message
  for wrong details, and a logout button.
- Route protection: `/products/*` redirects to `/login` if there's no
  session.
- Product list with a table on desktop and cards on mobile (same data,
  two layouts via Tailwind breakpoints, not two data-fetches).
- Pagination with page numbers, Previous/Next, a page-size selector
  (10/20/50), and a "Showing X–Y of Z" line.
- Debounced search (400ms) against `/products/search`, with in-flight
  requests cancelled via `AbortController` plus a request-id check, so a
  slow older response can never overwrite a newer one.
- Category filter (`/products/categories`, `/products/category/:slug`) and
  sort by price, rating or title.
- Product details page with images, description, price and reviews, and a
  proper "not found" screen for a bad id.
- Add/edit form with validation (required fields, price > 0, stock is a
  non-negative whole number) and a delete flow behind a confirm dialog.
- Loading, empty and error states everywhere data is fetched, each error
  state with a Retry button.
- Page, search, filter and sort are all kept in the URL query string, so
  refreshing or sharing the link reproduces the same view. Invalid values
  (`?page=abc`, `?page=999`) fall back to a valid page instead of breaking.
- Login and Save buttons ignore extra clicks while a request is already in
  flight, so a fast double-click can't fire two requests.

## Design decisions (things the brief asked me to explain)

**Search vs. category filter.** DummyJSON can't combine `q` and `category`
in one request. Rather than fake it client-side (which would silently
paginate over the wrong dataset), the app treats them as mutually
exclusive: typing in the search box clears the category filter, and the
category dropdown is disabled while a search is active. This keeps the
pagination math (`total`, `skip`, `limit`) always matching what's actually
on screen.

**Add/edit/delete aren't really persisted.** DummyJSON accepts these
requests and returns a plausible response, but nothing is saved on their
server — a refresh would show the old data. So the app updates its own
local state after a successful call (removes the row on delete, navigates
back to the list on add/edit) to reflect the action in the UI, and says so
next to the add/edit forms so it isn't confused for a real backend.

**Race conditions in search.** Every product fetch carries an incrementing
request id and an `AbortController`. When a new request starts, the
previous one is aborted, and even if an aborted request's promise still
resolves, its result is dropped unless its id matches the latest request.
This is what stops a slow response for an old search term from
overwriting a newer, faster one.

**Auth is client-side.** The token lives in `localStorage`, added to every
request by an Axios request interceptor, and route protection is done by
a `ProtectedRoute` component that checks for a session before rendering.
This is a demo login backed by a stateless mock API, so there's no
server session to check against; a real app would move this into
middleware backed by an httpOnly cookie.

## One problem I ran into

DummyJSON's `/products/categories` endpoint returns objects
(`{ slug, name, url }`), not plain strings. Using those values as slugs in
`/products/category/:slug` at first sent things like the human-readable
name instead of the slug and returned mismatched results. Fixed by keying
the filter UI's `<option>` values off `slug` and only using `name` for
the visible label.

## Where AI helped

I used AI assistance to scaffold the file layout, the Axios interceptor
setup, and the debounced-search/AbortController pattern, then read
through and adjusted each file myself. I can walk through any part of the
code and explain the reasoning, and I'm expecting to make a small live
change in the review round.
