import api from "@/lib/axios";

// POST /auth/login -> { id, username, email, firstName, ..., token }
export function login(username, password) {
  return api
    .post("/auth/login", { username, password, expiresInMins: 60 })
    .then((res) => res.data);
}
