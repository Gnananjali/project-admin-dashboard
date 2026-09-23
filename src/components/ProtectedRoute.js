"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "./Loader";

// Wrap any page that requires login with this component. It waits until
// we've checked localStorage for an existing session, then redirects to
// /login if there isn't one.
export default function ProtectedRoute({ children }) {
  const { user, checkingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!checkingAuth && !user) {
      router.replace("/login");
    }
  }, [checkingAuth, user, router]);

  if (checkingAuth) {
    return <Loader label="Checking your session..." />;
  }

  if (!user) {
    // Redirect is in flight; render nothing to avoid a flash of content.
    return null;
  }

  return children;
}
