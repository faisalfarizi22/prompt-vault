"use client";

import { X, Copy, Check, BookOpen, Tag, Globe } from "lucide-react";
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

  useEffect(() => {
    setLang("en");
    setCopied(false);
  }, [prompt]);

  const handleCopy = () => {
    if (!prompt) return;
    const textToCopy = lang === "id" && prompt.contentId ? prompt.contentId : prompt.content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "100%", maxWidth: 480,
              background: "#fff",
              zIndex: 101,
              display: "flex", flexDirection: "column",
              fontFamily: "'Geist', system-ui, sans-serif",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
            }}
          >
            {/* ── Header ── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px", borderBottom: "1px solid #EBEBEB",
              background: "#fff",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen style={{ width: 18, height: 18, color: "#22C55E" }} />
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "#111" }}>
                  Detail Prompt
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "#F4F4F5", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#71717A", padding: 6, borderRadius: 8,
                  transition: "background 0.15s",
                }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* ── Scrollable Body ── */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>

              {/* Tags */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Tag style={{ width: 12, height: 12, color: "#A1A1AA" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Kategori &amp; Tag
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{
                    background: "#22C55E", color: "#fff",
                    padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.02em",
                  }}>
                    {prompt.category}
                  </span>
                  {prompt.tags?.map(tag => (
                    <span key={tag} style={{
                      background: "#F4F4F5", color: "#3F3F46", border: "1px solid #E4E4E7",
                      padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 22, fontWeight: 800, color: "#111",
                lineHeight: 1.25, letterSpacing: "-0.03em", marginBottom: 20,
              }}>
                {prompt.title}
              </h1>

              {/* Technical Details */}
              <div style={{
                background: "#FAFAFA", border: "1px solid #EBEBEB", borderRadius: 12, padding: "14px 16px",
                marginBottom: 24,
              }}>
                <h4 style={{
                  fontSize: 11, fontWeight: 700, color: "#A1A1AA",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  marginBottom: 8, marginTop: 0,
                }}>
                  Detail Teknis
                </h4>
                <p style={{ fontSize: 13, color: "#52525B", lineHeight: 1.65, margin: 0 }}>
                  {prompt.detail
                    ? prompt.detail
                    : "Prompt ini dioptimalkan untuk ChatGPT, Claude, dan Gemini. Ganti semua kata dalam tanda kurung siku seperti [industri] dengan konteks spesifik Anda untuk hasil terbaik."}
                </p>
              </div>

              {/* Prompt Content Section */}
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12,
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#111" }}>
                    Teks Prompt
                  </h3>

                  {/* Language Toggle — only show when translation is available */}
                  {prompt.contentId && (
                    <div style={{
                      display: "flex", background: "#F4F4F5", borderRadius: 100, padding: 3, gap: 2,
                    }}>
                      <button
                        onClick={() => setLang("en")}
                        style={{
                          padding: "4px 14px", borderRadius: 100, border: "none",
                          fontSize: 11, fontWeight: 600, cursor: "pointer",
                          background: lang === "en" ? "#fff" : "transparent",
                          color: lang === "en" ? "#111" : "#71717A",
                          boxShadow: lang === "en" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                          transition: "all 0.18s",
                        }}
                      >🇺🇸 English</button>
                      <button
                        onClick={() => setLang("id")}
                        style={{
                          padding: "4px 14px", borderRadius: 100, border: "none",
                          fontSize: 11, fontWeight: 600, cursor: "pointer",
                          background: lang === "id" ? "#fff" : "transparent",
                          color: lang === "id" ? "#111" : "#71717A",
                          boxShadow: lang === "id" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                          transition: "all 0.18s",
                        }}
                      >🇮🇩 Indonesia</button>
                    </div>
                  )}
                </div>

                {/* Prompt Box */}
                <div style={{
                  background: "#18181B", color: "rgba(255,255,255,0.88)",
                  padding: "18px 20px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.7,
                  border: "1px solid #27272A", whiteSpace: "pre-wrap",
                }}>
                  {lang === "id" && prompt.contentId ? prompt.contentId : prompt.content}
                </div>

                {/* Notice if no translation */}
                {!prompt.contentId && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, marginTop: 10,
                    background: "#FFF8E7", border: "1px solid #FDE68A",
                    borderRadius: 8, padding: "8px 12px",
                  }}>
                    <Globe style={{ width: 13, height: 13, color: "#B45309", flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: "#B45309", margin: 0, lineHeight: 1.4 }}>
                      Terjemahan Bahasa Indonesia untuk prompt ini sedang dalam proses dan akan segera tersedia.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Footer / Copy CTA ── */}
            <div style={{
              padding: "16px 24px", borderTop: "1px solid #EBEBEB", background: "#FAFAFA",
            }}>
              <p style={{ fontSize: 11, color: "#A1A1AA", margin: "0 0 10px", textAlign: "center" }}>
                {lang === "id" ? "Menyalin versi Bahasa Indonesia" : "Menyalin versi Bahasa Inggris (asli)"}
              </p>
              <button
                onClick={handleCopy}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                  padding: "15px", borderRadius: 12, cursor: "pointer",
                  fontSize: 14, fontWeight: 600,
                  background: copied ? "#22C55E" : "#111",
                  color: "#fff", border: "none",
                  transition: "background 0.2s",
                  boxShadow: copied ? "0 8px 20px rgba(34,197,94,0.3)" : "0 4px 16px rgba(0,0,0,0.13)",
                }}
              >
                {copied
                  ? <><Check style={{ width: 17, height: 17 }} /> Berhasil Disalin!</>
                  : <><Copy style={{ width: 17, height: 17 }} /> Salin Prompt</>
                }
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
