"use client";

import { PieChart, ArrowRight, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export const StatsBanner = () => {
  const [useCount, setUseCount] = useState(542);

  // Small effect to simulate "real-time" update
  useEffect(() => {
    const interval = setInterval(() => {
      setUseCount(prev => prev + Math.floor(Math.random() * 2));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      gridColumn: "1 / -1",
      background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      borderRadius: "32px",
      padding: "24px 48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "24px",
      boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)",
      position: "relative",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.1)",
      margin: "24px 0"
    }} className="stats-banner-container">
      {/* Decorative patterns */}
      <div style={{
        position: "absolute", top: -20, left: -20,
        width: 100, height: 100, borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        zIndex: 0
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: "24px", zIndex: 1 }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff"
        }}>
          <PieChart style={{ width: 28, height: 28 }} />
        </div>
        
        <div>
          <h3 style={{
            fontSize: "clamp(18px, 2.5vw, 22px)",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "4px",
            letterSpacing: "-0.02em"
          }}>
            Eksklusif: <span style={{ color: "#E0F2FE" }}>Sudah {useCount} orang</span> menggunakan kategori <span style={{ color: "rgba(255,255,255,0.95)" }}>TikTok Affiliate</span> hari ini.
          </h3>
          <p style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <Zap style={{ width: 14, height: 14, fill: "currentColor" }} /> Bergabunglah dengan mereka dan mulai raih hasil nyata sekarang.
          </p>
        </div>
      </div>

      <button style={{
        background: "#fff",
        color: "#065F46",
        fontSize: "15px",
        fontWeight: 800,
        padding: "12px 28px",
        borderRadius: "100px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        flexShrink: 0,
        transition: "all 0.2s"
      }} className="hover-lift">
        Gabung Sekarang <ArrowRight style={{ width: 14, height: 14 }} />
      </button>

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        @media (max-width: 968px) {
          .stats-banner-container {
            flex-direction: column;
            text-align: center;
            padding: 32px 24px;
          }
          div { justify-content: center; }
        }
      `}</style>
    </div>
  );
};
