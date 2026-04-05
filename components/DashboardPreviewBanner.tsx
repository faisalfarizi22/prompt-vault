"use client";

import { Crown, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export const DashboardPreviewBanner = () => {
  const { user } = useUser();
  const isPaid = user?.publicMetadata?.isPaid === true;
  
  if (isPaid) return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #111827 0%, #065F46 100%)",
      borderRadius: "32px",
      padding: "32px 40px",
      marginBottom: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 25px 50px -12px rgba(6, 95, 70, 0.25)",
      border: "1px solid rgba(255,255,255,0.1)"
    }}>
      {/* Decorative background circle */}
      <div style={{
        position: "absolute", top: "-50%", right: "10%",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "rgba(16, 185, 129, 0.15)",
        filter: "blur(60px)",
        pointerEvents: "none"
      }} />

      <div style={{ flex: 1, zIndex: 1, paddingRight: "40px" }}>
        <div style={{ 
          display: "inline-flex", alignItems: "center", gap: "8px", 
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", 
          padding: "8px 16px", borderRadius: "100px", 
          border: "1px solid rgba(255,255,255,0.1)", marginBottom: "20px" 
        }}>
          <Crown style={{ width: 14, height: 14, color: "#FBBF24" }} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>EXCLUSIVE PREVIEW MODE</span>
        </div>
        
        <h2 style={{ 
          fontSize: "clamp(24px, 3vw, 32px)", 
          fontWeight: 900, 
          color: "#fff", 
          lineHeight: 1.2, 
          marginBottom: "16px",
          letterSpacing: "-0.04em"
        }}>
          Upgrade ke Ultimate <br />
          <span style={{ color: "#10B981" }}>Akses Tanpa Batas.</span>
        </h2>
        
        <p style={{ 
          fontSize: "16px", 
          color: "rgba(255,255,255,0.7)", 
          marginBottom: "28px", 
          lineHeight: 1.6, 
          maxWidth: "480px" 
        }}>
          Anda sedang dalam mode preview. Unlock 1.000+ prompt premium untuk melejitkan produktivitas AI Anda sekarang.
        </p>

        <button 
          onClick={() => window.location.href = "/"} // Go back to landing/pricing
          style={{
            background: "#fff",
            color: "#065F46",
            fontSize: "15px",
            fontWeight: 800,
            padding: "14px 32px",
            borderRadius: "100px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            transition: "all 0.2s"
          }}
          className="hover-lift"
        >
          Upgrade Sekarang <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }} className="banner-visual">
         <img 
            src="/hero-mockup.png" 
            alt="3D Visual" 
            style={{ 
              width: "100%", 
              maxWidth: "280px", 
              height: "auto", 
              borderRadius: "24px", 
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
              transform: "perspective(1000px) rotateY(-15deg) rotateX(5deg)",
              display: "block"
            }} 
         />
      </div>

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        @media (max-width: 968px) {
          .banner-visual { display: none !important; }
          div { padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  );
};
