"use client";

import Link from "next/link";
import { Lock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const { user, isLoaded } = useUser();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Jangan lakukan polling jika user belum termuat
    if (!isLoaded || !user) return;

    // Jika masuk ke halaman payment ternyata sudah bayar, langsung tendang ke dashboard!
    if (user.publicMetadata?.isPaid === true) {
      window.location.href = "/dashboard";
      return;
    }

    let isMounted = true;

    // Fungsi polling (Mengecek Clerk Server tiap 5 detik apakah webhook berhasil)
    const checkPaymentStatus = async () => {
      while (isMounted && !isSuccess) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        if (!isMounted) break;

        try {
          // Memuat ulang data user dan cookie dari Clerk (mengecek isPaid)
          await user.reload();
          
          if (user.publicMetadata?.isPaid === true) {
            setIsSuccess(true);
            // Tunggu 1 detik agar animasi rileks, lalu refresh keras masuk ke dashboard
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
            break;
          }
        } catch (error) {
           console.error("Clerk polling error", error);
        }
      }
    };

    checkPaymentStatus();

    return () => { isMounted = false; };
  }, [isLoaded, user?.publicMetadata?.isPaid]); 

  // Jangan render UI jika Clerk belum siap untuk menghindari kedipan 
  if (!isLoaded) {
    return <div style={{ minHeight: "100vh", background: "#FAFAFA" }} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* Container */}
      <div style={{
        background: "#fff", border: "1px solid #EBEBEB", borderRadius: 24, padding: "48px 40px",
        maxWidth: 480, width: "100%", textAlign: "center",
        boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
        fontFamily: "'Geist', system-ui, sans-serif"
      }}>
        
        {isSuccess ? (
          // === UI SUKSES BAYAR (TRANSISI AUTO MASUK) ===
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: "#D1FAE5", margin: "0 auto 24px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <CheckCircle style={{ width: 24, height: 24, color: "#065F46" }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "#111", marginBottom: 12 }}>
              Payment Received!
            </h1>
            <p style={{ fontSize: 15, color: "#10B981", fontWeight: 500, lineHeight: 1.6, marginBottom: 32 }}>
              Verifying your license token... Please wait a moment.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Loader2 style={{ width: 24, height: 24, animation: "spin 1s linear infinite", color: "#A1A1AA" }} />
            </div>
          </div>
        ) : (
          // === UI LOCK STANDAR ===
          <>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: "#F4F4F5", margin: "0 auto 24px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Lock style={{ width: 24, height: 24, color: "#111" }} />
            </div>
            
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "#111", marginBottom: 12 }}>
              Dashboard Locked
            </h1>
            <p style={{ fontSize: 15, color: "#71717A", lineHeight: 1.6, marginBottom: 32 }}>
              You need lifetime access to enter the vault. Pay once and unlock 1,000+ premium prompts forever.
            </p>
            
            <Link href="http://lynk.id/beurchef/34x317jlepkm/checkout" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", padding: "16px", borderRadius: 100,
                background: "#111", color: "#fff", fontSize: 15, fontWeight: 600,
                border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}>
                Pay IDR 8,000 via QRIS <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </Link>
            
            <div style={{ marginTop: 24, fontSize: 13, color: "#A1A1AA" }}>
              Already paid? Check your Lynk.id receipt for the Validation Link.<br/>
              <Link href="/dashboard-success" style={{ color: "#111", fontWeight: 500, textDecoration: "underline", marginTop: 8, display: "inline-block" }}>
                Enter Activation Code Manually
              </Link>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
