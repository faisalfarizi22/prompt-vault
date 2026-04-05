"use client";

import { LockOpen, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center"
          }}
          className="floating-cta-container"
        >
          <div style={{
            background: "#fff",
            padding: "12px 20px",
            borderRadius: "100px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.12)",
            cursor: "pointer",
            transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}
          className="hover-lift"
          onClick={() => window.scrollTo({ top: 3500, behavior: "smooth" })} // Scroll to pricing/checkout area
          >
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff"
            }}>
              <LockOpen style={{ width: 18, height: 18 }} />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ 
                fontSize: "14px", 
                fontWeight: 800, 
                color: "#111", 
                letterSpacing: "-0.01em",
                lineHeight: 1.1
              }}>
                Buka 1.000+ Prompt
              </span>
              <span style={{ 
                fontSize: "11px", 
                fontWeight: 600, 
                color: "#10B981",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Akses Sekarang <ArrowRight style={{ width: 10, height: 10, display: "inline", marginLeft: 2 }} />
              </span>
            </div>
          </div>
          
          <style jsx>{`
            .hover-lift:hover {
              transform: translateY(-5px);
              box-shadow: 0 25px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(16, 185, 129, 0.1);
            }
            
            @media (max-width: 620px) {
              .floating-cta-container {
                left: 20px;
                right: 20px;
                bottom: 20px;
                justify-content: center;
              }
              .hover-lift {
                width: 100%;
                justify-content: center;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
