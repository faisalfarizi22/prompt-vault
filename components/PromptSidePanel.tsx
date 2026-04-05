"use client";

import { X, Copy, Check, BookOpen, Tag, Sparkles, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Prompt {
  id: number;
  category: string;
  title: string;
  content: string;
  isPremium: boolean;
  tags?: string[];
  detail?: string;
  contentId?: string;
}

interface PromptSidePanelProps {
  prompt: Prompt | null;
  onClose: () => void;
}

export const PromptSidePanel = ({ prompt, onClose }: PromptSidePanelProps) => {
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<"en" | "id">("en");

  // Reset states when prompt changes
  useEffect(() => {
    setLang("en");
    setCopied(false);
  }, [prompt]);

  const handleCopy = () => {
    if (!prompt) return;
    const isLocked = prompt.content === "PROTECTED_CONTENT";
    if (isLocked) return;

    const textToCopy = lang === "id" && prompt.contentId ? prompt.contentId : prompt.content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    // Don't auto-reset copied immediately to let the teaser show
  };

  return (
    <AnimatePresence>
      {prompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              zIndex: 100,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 260 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "100%", maxWidth: 520,
              background: "#FFFFFF",
              zIndex: 101,
              display: "flex", flexDirection: "column",
              fontFamily: "'Geist', system-ui, sans-serif",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.1)",
              borderLeft: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            {/* ── Header ── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "24px 32px", borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: prompt.isPremium ? "linear-gradient(135deg, #065f46 0%, #10b981 100%)" : "#F1F5F9",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Sparkles style={{ width: 18, height: 18, color: prompt.isPremium ? "#fff" : "#64748B" }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#111", letterSpacing: "-0.02em" }}>
                    Prompt Details
                  </h2>
                  <span style={{ fontSize: 11, fontWeight: 700, color: prompt.isPremium ? "#10B981" : "#64748B", textTransform: "uppercase" }}>
                    {prompt.isPremium ? "Premium Vault" : "Free Teaser Access"} #00{prompt.id}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#111", padding: 8, borderRadius: 100,
                  transition: "all 0.2s",
                }}
                className="close-panel-btn"
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {/* ── Scrollable Body ── */}
            <div style={{ padding: "32px", overflowY: "auto", flex: 1 }} className="scroll-panel">

              {/* Category & Tags */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <Tag style={{ width: 14, height: 14, color: "#94A3B8" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Category & Labels
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    background: prompt.isPremium ? "#065f46" : "#E2E8F0", 
                    color: prompt.isPremium ? "#fff" : "#1e293b",
                    padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                  }}>
                    {prompt.category}
                  </span>
                  {!prompt.isPremium && (
                    <span style={{
                        background: "linear-gradient(135deg, #065f46, #10b981)", color: "#fff",
                        padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 800,
                        boxShadow: "0 4px 10px rgba(16,185,129,0.2)"
                    }}>
                        GRATIS
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 28, fontWeight: 800, color: "#111",
                lineHeight: 1.2, letterSpacing: "-0.04em", marginBottom: 24,
              }}>
                {prompt.title}
              </h1>

              {/* Technical Explanation (Indonesian) */}
              <div style={{
                background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: 20, padding: "20px 24px",
                marginBottom: 32,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <BookOpen style={{ width: 14, height: 14, color: "#065F46" }} />
                  <h4 style={{
                    fontSize: 12, fontWeight: 700, color: "#065F46",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    margin: 0,
                  }}>
                    Penjelasan & Panduan
                  </h4>
                </div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                  {prompt.detail
                    ? prompt.detail
                    : "Prompt ini telah dioptimalkan untuk model AI terbaru (ChatGPT-4o, Claude 3.5, & Flux). Pastikan Anda mengganti bagian di dalam kurung siku [seperti ini] dengan data spesifik Anda agar hasil yang dihasilkan lebih akurat dan relevan."}
                </p>
              </div>

              {/* Prompt Content Section */}
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16,
                }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: "#111", letterSpacing: "-0.02em" }}>
                    Prompt Text
                  </h3>

                  {/* Language Toggle */}
                  {prompt.contentId && prompt.content !== "PROTECTED_CONTENT" && (
                    <div style={{
                      display: "flex", backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.05)", borderRadius: 100, padding: 4, gap: 4,
                    }}>
                      <button
                        onClick={() => setLang("en")}
                        style={{
                          padding: "6px 14px", borderRadius: 100, border: "none",
                          fontSize: 12, fontWeight: 700, cursor: "pointer",
                          background: lang === "en" ? "#fff" : "transparent",
                          color: lang === "en" ? "#111" : "#64748B",
                          boxShadow: lang === "en" ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >🇺🇸 En</button>
                      <button
                        onClick={() => setLang("id")}
                        style={{
                          padding: "6px 14px", borderRadius: 100, border: "none",
                          fontSize: 12, fontWeight: 700, cursor: "pointer",
                          background: lang === "id" ? "#fff" : "transparent",
                          color: lang === "id" ? "#111" : "#64748B",
                          boxShadow: lang === "id" ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >🇮🇩 Id</button>
                    </div>
                  )}
                </div>

                {/* Prompt Box */}
                <div style={{
                  background: "#0F172A", color: "#F1F5F9",
                  padding: "24px", borderRadius: 24, fontSize: 14, lineHeight: 1.8,
                  border: "1px solid rgba(255,255,255,0.05)", whiteSpace: "pre-wrap",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2), 0 10px 30px -10px rgba(15,23,42,0.4)",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {prompt.content === "PROTECTED_CONTENT" ? (
                    <div style={{ position: "relative", minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {/* Blurred Dummy Content */}
                        <div style={{ 
                            filter: "blur(10px)", opacity: 0.3, userSelect: "none", pointerEvents: "none",
                            fontSize: 14, lineHeight: 2, textAlign: "left", width: "100%"
                        }}>
                            "Sebagai seorang ahli [KATEGORI], tugas Anda adalah memberikan strategi [TUJUAN] yang komprehensif bagi [TARGET]. Strukturkan jawaban Anda dengan langkah-langkah [METODE] dan pastikan menyertakan [VARIABEL1], [VARIABEL2], serta matriks performa yang [DETAIL]..."
                        </div>
                        
                        {/* Lock Overlay Content */}
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                            <div style={{ 
                                background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", padding: 12, borderRadius: "50%",
                                border: "1px solid rgba(255,255,255,0.2)", marginBottom: 16
                            }}>
                                <Lock style={{ width: 24, height: 24, color: "#10B981" }} />
                            </div>
                            <div style={{ fontWeight: 900, fontSize: 18, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Unlock Ultimate Access</div>
                            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>Dapatkan akses penuh ke ribuan prompt premium</div>
                        </div>
                    </div>
                  ) : (
                    lang === "id" && prompt.contentId ? prompt.contentId : prompt.content
                  )}
                </div>
              </div>

              {/* Teaser Notification (Conversion Trigger) */}
              <AnimatePresence>
                {copied && !prompt.isPremium && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                            background: "linear-gradient(135deg, #1e293b, #0f172a)",
                            padding: "20px",
                            borderRadius: "24px",
                            marginTop: 24,
                            border: "1px solid rgba(255,255,255,0.1)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                            <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 800, margin: 0 }}>Suka prompt gratis ini?</h4>
                        </div>
                        <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                            Kamu baru saja menyalin 1 dari ribuan prompt kami. Dapatkan 100+ variasi serupa di paket Ultimate.
                        </p>
                        <button style={{
                            background: "linear-gradient(135deg, #065f46, #10b981)",
                            color: "#fff",
                            border: "none",
                            padding: "10px 16px",
                            borderRadius: "100px",
                            fontSize: 13,
                            fontWeight: 800,
                            cursor: "pointer",
                            boxShadow: "0 8px 20px rgba(16,185,129,0.2)"
                        }}>
                            Upgrade ke Ultimate Now
                        </button>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer / Copy CTA ── */}
            <div style={{
              padding: "24px 32px", borderTop: "1px solid rgba(0,0,0,0.04)", background: "#fff",
            }}>
              <button
                onClick={handleCopy}
                disabled={prompt.content === "PROTECTED_CONTENT"}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
                  padding: "18px", borderRadius: 100, cursor: prompt.content === "PROTECTED_CONTENT" ? "not-allowed" : "pointer",
                  fontSize: 15, fontWeight: 800,
                  background: copied ? "#10B981" : prompt.content === "PROTECTED_CONTENT" ? "#94A3B8" : "linear-gradient(135deg, #111, #333)",
                  color: "#fff", border: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: copied ? "0 12px 24px -6px rgba(16,185,129,0.4)" : "0 8px 24px -8px rgba(0,0,0,0.3)",
                }}
              >
                {copied
                  ? <><Check style={{ width: 20, height: 20 }} /> Copied Successfully!</>
                  : prompt.content === "PROTECTED_CONTENT" 
                    ? <><Lock style={{ width: 20, height: 20 }} /> Upgrade to View Content</>
                    : !prompt.isPremium 
                      ? <><Copy style={{ width: 20, height: 20 }} /> Gunakan Sekarang (Gratis)</>
                      : <><Copy style={{ width: 20, height: 20 }} /> Copy This Premium Prompt</>
                }
              </button>
            </div>
            
            <style jsx>{`
              .close-panel-btn:hover { background: rgba(0,0,0,0.1); transform: rotate(90deg); }
              .scroll-panel::-webkit-scrollbar { width: 6px; }
              .scroll-panel::-webkit-scrollbar-track { background: transparent; }
              .scroll-panel::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
