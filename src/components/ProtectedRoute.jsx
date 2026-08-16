"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        // Logged out -> redirect to login
        router.push("/login");
      } else {
        const userEmail = session.user.email?.toLowerCase();
        const userRole = userEmail === "admin@arthub.com" ? "admin" : (session.user.role || "user");

        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          // Unauthorized role -> redirect to home
          router.push("/");
        }
      }
    }
  }, [session, isPending, allowedRoles, router]);

  // Loading state during reload - prevents page bouncing to /login!
  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 text-indigo-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // If authenticated and role matches
  if (session?.user) {
    const userEmail = session.user.email?.toLowerCase();
    const userRole = userEmail === "admin@arthub.com" ? "admin" : (session.user.role || "user");

    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return <>{children}</>;
    }
  }

  return null;
}
