"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // 1. Read cookies
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };

      const ref = getCookie("veloprome_ref");
      const fp = getCookie("veloprome_fp");

      // 2. Sync to API (Only need to do this occasionally or once)
      // For now, simpler sync logic:
      fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referrerId: ref, fingerprint: fp }),
      }).catch(err => console.error("User sync failed", err));
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
