"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, setToken, clearToken, getStoredUser, setStoredUser } from "@/lib/auth";
import { login as loginApi } from "@/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // On first load, restore session from localStorage so a refresh doesn't
  // log the user out.
  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setCheckingAuth(false);
  }, []);

  async function login(username, password) {
    const data = await loginApi(username, password);
    setToken(data.token);
    const userData = { id: data.id, username: data.username, firstName: data.firstName };
    setStoredUser(userData);
    setUser(userData);
    return userData;
  }

  function logout() {
    clearToken();
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, checkingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
