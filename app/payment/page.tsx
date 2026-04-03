"use client";

import Link from "next/link";
import { Lock, ArrowRight, Loader2, CheckCircle, HelpCircle, Check, ShieldCheck, Zap, Layers } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const { user, isLoaded } = useUser();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    if (user.publicMetadata?.isPaid === true) {
      window.location.href = "/dashboard";
      return;
    }

    let isMounted = true;

    const checkPaymentStatus = async () => {
      while (isMounted && !isSuccess) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        if (!isMounted) break;

        try {
          await user.reload();
          if (user.publicMetadata?.isPaid === true) {
            setIsSuccess(true);
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1500);
            break;
          }
        } catch (error) {
          console.error("Clerk polling error", error);
        }
      }
    };

    checkPaymentStatus();

    return () => { isMounted = false; };
  }, [isLoaded, user?.publicMetadata?.isPaid, isSuccess]);

  if (!isLoaded) {
    return <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>;
  }

  const benefits = [
    "Akses 1.000+ Prompt Terkurasi",
    "Update Prompt Baru Selamanya",
    "Ebook Eksklusif AI Masterclass",
    "Akses Komunitas VIP Veloprome",
    "Lisensi Komersial Penggunaan"
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#fff", 
      fontFamily: "'Geist', system-ui, sans-serif",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }}>
      {/* Background Luxury Elements */}
      <div style={{
        position: "absolute", top: "-10%", right: "-10%", width: "60%", height: "60%",
        background: "radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, rgba(255, 255, 255, 0) 70%)",
        filter: "blur(80px)", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "-10%", width: "50%", height: "50%",
        background: "radial-gradient(circle, rgba(6, 95, 70, 0.03) 0%, rgba(255, 255, 255, 0) 70%)",
        filter: "blur(100px)", pointerEvents: "none"
      }} />

      {/* Main Glass Container */}
      <div style={{
        maxWidth: 540,
        width: "90%",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderRadius: 40,
        padding: "56px 48px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 40px 100px -20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)",
        position: "relative",
        zIndex: 10,
        textAlign: "center"
      }} className="payment-card">
        
        {isSuccess ? (
          <div style={{ animation: "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", background: "#ECFDF5", margin: "0 auto 32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 0 10px rgba(236, 253, 245, 0.6)"
            }}>
              <CheckCircle style={{ width: 40, height: 40, color: "#10B981" }} />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111", letterSpacing: "-0.04em", marginBottom: 16 }}>
              Pembayaran Berhasil!
            </h1>
            <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.6, marginBottom: 40 }}>
              Lisensi Anda sedang diaktifkan. Anda akan dialihkan ke dashboard dalam hitungan detik.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Loader2 style={{ width: 24, height: 24, animation: "spin 1s linear infinite", color: "#10B981" }} />
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
               <div style={{ padding: "8px 16px", background: "rgba(34, 197, 94, 0.08)", borderRadius: 100, border: "1px solid rgba(34, 197, 94, 0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                  <ShieldCheck style={{ width: 14, height: 14, color: "#10B981" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.05em" }}>Aktivasi Akun Premium</span>
               </div>
            </div>

            <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111", letterSpacing: "-0.04em", marginBottom: 12 }}>
              Langkah Terakhir.
            </h1>
            <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.6, marginBottom: 40 }}>
              Buka potensi penuh AI Anda dengan akses seumur hidup ke koleksi prompt terbaik kami.
            </p>

            {/* Price Highlight */}
            <div style={{ 
              background: "#F8FAFC", borderRadius: 24, padding: "24px", 
              border: "1px solid #F1F5F9", marginBottom: 32, textAlign: "left" 
            }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#64748B" }}>Total Pembayaran</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981", background: "rgba(16, 185, 129, 0.1)", padding: "4px 8px", borderRadius: 6 }}>OFF 90%</span>
               </div>
               <div style={{ fontSize: 32, fontWeight: 800, color: "#111" }}>IDR 8.000 <span style={{ fontSize: 14, color: "#94A3B8", fontWeight: 400, textDecoration: "line-through", marginLeft: 8 }}>IDR 80.000</span></div>
            </div>

            {/* Benefits List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40, textAlign: "left" }}>
               {benefits.map((b, i) => (
                 <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                       <Check style={{ width: 12, height: 12, color: "#10B981" }} />
                    </div>
                    <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{b}</span>
                 </div>
               ))}
            </div>

            <Link href="http://lynk.id/beurchef/34x317jlepkm/checkout" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                width: "100%", padding: "20px", borderRadius: 100,
                background: "#111", color: "#fff", fontSize: 16, fontWeight: 700,
                border: "none", cursor: "pointer", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.3)",
                transition: "all 0.2s ease"
              }} className="pay-btn">
                Aktivasi Akses Sekarang <ArrowRight style={{ width: 18, height: 18 }} />
              </button>
            </Link>

            <p style={{ marginTop: 24, fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
               Gunakan email yang sama dengan akun Clerk Anda saat di checkout Lynk.id.<br />
               Akses akan terbuka otomatis dalam <span style={{ color: "#64748B", fontWeight: 600 }}>1-5 detik</span> setelah pembayaran.
            </p>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #F1F5F9" }}>
               <a href="https://wa.me/6281383521750" target="_blank" rel="noreferrer" style={{
                 display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                 color: "#64748B", fontSize: 13, textDecoration: "none", fontWeight: 600
               }}>
                 <HelpCircle style={{ width: 16, height: 16 }} /> Punya pertanyaan? Hubungi Kami
               </a>
            </div>
          </>
        )}
      </div>

      {/* Footer Branding */}
      <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", opacity: 0.5 }}>
         <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <img src="/LOGO.png" alt="Logo" style={{ height: 20, width: "auto" }} />
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em" }}>VELOPROME</span>
         </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .pay-btn:hover { transform: translateY(-4px); background: #065F46 !important; box-shadow: 0 25px 50px -12px rgba(6, 95, 70, 0.4); }
        .payment-card { transition: transform 0.3s ease; }
        @media (max-width: 640px) {
          .payment-card { padding: 40px 24px !important; margin: 16px !important; border-radius: 32px !important; }
          h1 { fontSize: 32px !important; }
        }
      `}</style>
    </div>
  );
}
