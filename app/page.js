"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

export default function Home() {
  const { user, checkingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (checkingAuth) return;
    router.replace(user ? "/products" : "/login");
  }, [checkingAuth, user, router]);

  return <Loader label="Loading..." />;
}
