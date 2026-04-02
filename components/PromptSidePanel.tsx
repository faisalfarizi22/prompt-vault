"use client";

import { X, Copy, Check, Globe } from "lucide-react";
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
  contentId?: string; // Translated content
}

interface PromptSidePanelProps {
  prompt: Prompt | null;
  onClose: () => void;
}

export const PromptSidePanel = ({ prompt, onClose }: PromptSidePanelProps) => {
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<"en" | "id">("en");

  // Reset lang and state when prompt changes
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
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 100
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", boxShadow: "-4px 0 24px rgba(0,0,0,0)" }}
            animate={{ x: 0, boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}
            exit={{ x: "100%", boxShadow: "-4px 0 24px rgba(0,0,0,0)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "100%", maxWidth: 480,
              background: "#fff",
              zIndex: 101,
              display: "flex", flexDirection: "column",
              fontFamily: "'Geist', system-ui, sans-serif"
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", borderBottom: "1px solid #EBEBEB"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Prompt Detail</h2>
              <button onClick={onClose} style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#71717A", padding: 4, borderRadius: 8
              }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
              
              {/* Tags Region */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <span style={{
                    background: "#22C55E", color: "#fff",
                    padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.02em"
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

              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16 }}>
                {prompt.title}
              </h1>

              {/* Technical Details */}
              <div style={{
                background: "#fafafa", border: "1px solid #ebebeb", borderRadius: 12, padding: 16,
                marginBottom: 24
              }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, marginTop: 0 }}>Technical Details</h4>
                <p style={{ fontSize: 13, color: "#52525B", lineHeight: 1.6, margin: 0 }}>
                  {prompt.detail || "This prompt is optimized for ChatGPT and Claude. Identify bracketed variables like [industry] and fill them with your specific context."}
                </p>
              </div>

              {/* Translation Toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Prompt Content</h3>
                
                {prompt.contentId && (
                  <div style={{
                     display: "flex", background: "#f4f4f5", borderRadius: 100, padding: 4, gap: 4
                  }}>
                    <button 
                      onClick={() => setLang("en")}
                      style={{
                        padding: "4px 16px", borderRadius: 100, border: "none",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        background: lang === "en" ? "#fff" : "transparent",
                        color: lang === "en" ? "#111" : "#71717a",
                        boxShadow: lang === "en" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                        transition: "all 0.2s"
                    }}>English</button>
                    <button 
                      onClick={() => setLang("id")}
                      style={{
                        padding: "4px 16px", borderRadius: 100, border: "none",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        background: lang === "id" ? "#fff" : "transparent",
                        color: lang === "id" ? "#111" : "#71717a",
                        boxShadow: lang === "id" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                        transition: "all 0.2s"
                    }}>Indonesia</button>
                  </div>
                )}
              </div>

              {/* Prompt Text Box */}
              <div style={{
                position: "relative",
                background: "#18181B", color: "rgba(255,255,255,0.9)",
                padding: 20, borderRadius: 12, fontSize: 14, lineHeight: 1.6,
                border: "1px solid #27272A",
              }}>
                {lang === "id" && prompt.contentId ? prompt.contentId : prompt.content}
              </div>

            </div>

            {/* Footer / CTA */}
            <div style={{
              padding: "20px 24px", borderTop: "1px solid #EBEBEB", background: "#fafafa"
            }}>
              <button
                onClick={handleCopy}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                  padding: "16px", borderRadius: 12, cursor: "pointer",
                  fontSize: 15, fontWeight: 600,
                  background: copied ? "#22C55E" : "#111",
                  color: "#fff", border: "none",
                  transition: "background 0.2s",
                  boxShadow: copied ? "0 8px 20px rgba(34,197,94,0.3)" : "0 8px 20px rgba(0,0,0,0.15)"
                }}
              >
                {copied ? <Check style={{ width: 18, height: 18 }} /> : <Copy style={{ width: 18, height: 18 }} />}
                {copied ? "Copied to Clipboard!" : "Copy Prompt"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
