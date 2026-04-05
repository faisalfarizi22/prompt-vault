"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (!ref) return;

    // 1. Generate basic fingerprint (Lightweight)
    const getFingerprint = () => {
      const { userAgent, language, platform } = navigator;
      const { width, height, colorDepth } = window.screen;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const data = `${userAgent}|${language}|${platform}|${width}x${height}|${colorDepth}|${timezone}`;
      
      // Simple hash (Base64 for now)
      return btoa(data).substring(0, 32);
    };

    const fingerprint = getFingerprint();

    // 2. Store in Cookie (30 Days)
    const expires = new Date();
    expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = `veloprome_ref=${ref};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    document.cookie = `veloprome_fp=${fingerprint};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

    // 3. Log Visit to API (Fire and forget)
    fetch("/api/referral/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: ref, fingerprint }),
    }).catch(err => console.error("Referral logging failed", err));

  }, [ref]);

  return null; // Side-effect only component
}
