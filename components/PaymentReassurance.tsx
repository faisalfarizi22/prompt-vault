"use client";

import { CheckCircle2 } from "lucide-react";

export const PaymentReassurance = () => {
  return (
    <section style={{ 
      padding: "80px 24px", 
      background: "#fff", 
      borderTop: "1px solid #F1F5F9",
      textAlign: "center" 
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ 
          fontSize: "clamp(28px, 4vw, 40px)", 
          fontWeight: 900, 
          color: "#111", 
          marginBottom: "16px",
          letterSpacing: "-0.04em"
        }}>
          Akses Instan dalam <span style={{ color: "#10B981" }}>1 Menit.</span>
        </h2>
        <p style={{ 
          fontSize: "17px", 
          color: "#64748B", 
          marginBottom: "48px",
          fontWeight: 500
        }}>
          Bayar praktis pakai QRIS. Scan sekarang, akses terbuka otomatis.
        </p>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "48px", 
          flexWrap: "wrap",
          opacity: 0.8
        }}>
          {/* QRIS */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <img 
              src="/qris.png" 
              alt="QRIS" 
              style={{ height: "48px", width: "auto" }} // Increased height slightly for prominence
            />
          </div>
        </div>

        <div style={{ 
          marginTop: "60px", 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "12px",
          padding: "12px 24px",
          background: "#F8FAFC",
          borderRadius: "100px",
          border: "1px solid #E2E8F0",
          fontSize: "14px",
          fontWeight: 600,
          color: "#475569"
        }}>
          <CheckCircle2 style={{ width: 18, height: 18, color: "#10B981" }} />
          Terverifikasi Aman & Otomatis oleh Sistem Kami
        </div>
      </div>
    </section>
  );
};
