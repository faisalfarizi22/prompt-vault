"use client";

import { useState } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CampaignBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -16, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -16, height: 0 }}
          transition={{ duration: 0.25 }}
          style={{ overflow: "hidden", marginBottom: 24 }}
        >
        <div style={{
          position: "relative",
          background: "linear-gradient(135deg, #111 0%, #27272A 100%)",
          borderRadius: 16,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          color: "#fff",
          overflow: "hidden"
        }}>
          {/* Decorative background circle */}
          <div style={{
            position: "absolute", top: -50, right: -20,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none"
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, zIndex: 1 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Sparkles style={{ width: 24, height: 24, color: "#22C55E" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                Veloprome Pro Series 
                <span style={{ fontSize: 10, background: "#22C55E", padding: "2px 6px", borderRadius: 100, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>NEW</span>
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "4px 0 0" }}>
                Pelajari cara rahasia memaksimalkan AI untuk Scale-Up Bisnis Anda!
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, zIndex: 1 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fff", color: "#111", border: "none",
              padding: "10px 20px", borderRadius: 100,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)"
            }}>
              Klaim Sekarang <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
