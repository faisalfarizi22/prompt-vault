"use client";

import { useState, useMemo } from "react";
import {
  Copy, Check, Sparkles, Music, Megaphone,
  User, Headphones, Calendar, BarChart2,
  Play, Mail, BookOpen, Rocket, Image,
  Lock as LucideLock,
  Code, Bot, Palette, GraduationCap, Heart, Users, TrendingUp
} from "lucide-react";

interface PromptCardProps {
  id: number;
  title: string;
  category: string;
  content: string;
  isLocked?: boolean;
  isPaid?: boolean;
  onSelect?: () => void;
}

const getCategoryConfig = (category: string) => {
  const normalized = category.toLowerCase();

  if (normalized.includes("tiktok")) return { color: "#8b5cf6", icon: Music }; // Violet
  if (normalized.includes("copywriting") || normalized.includes("marketing") || normalized.includes("sales")) 
    return { color: "#ef4444", icon: Megaphone }; // Red
  if (normalized.includes("personal branding")) return { color: "#3b82f6", icon: User }; // Blue
  if (normalized.includes("customer service")) return { color: "#10b981", icon: Headphones }; // Emerald
  if (normalized.includes("content ideas") || normalized.includes("daily content")) return { color: "#f59e0b", icon: Calendar }; // Amber
  if (normalized.includes("market research") || normalized.includes("market analysis")) return { color: "#6366f1", icon: BarChart2 }; // Indigo
  if (normalized.includes("youtube")) return { color: "#dc2626", icon: Play }; // Crimson
  if (normalized.includes("email")) return { color: "#0ea5e9", icon: Mail }; // Sky
  if (normalized.includes("storytelling") || normalized.includes("writing") || normalized.includes("content creation")) 
    return { color: "#8b5cf6", icon: BookOpen }; // Purple
  if (normalized.includes("product launch") || normalized.includes("business") || normalized.includes("startup")) 
    return { color: "#f43f5e", icon: Rocket }; // Rose
  if (normalized.includes("image generation")) return { color: "#14b8a6", icon: Image }; // Teal
  if (normalized.includes("coding") || normalized.includes("programming") || normalized.includes("devops")) 
    return { color: "#2563eb", icon: Code }; // Blue
  if (normalized.includes("ai agent") || normalized.includes("workflows") || normalized.includes("automation")) 
    return { color: "#7c3aed", icon: Bot }; // Violet
  if (normalized.includes("design") || normalized.includes("creative")) 
    return { color: "#ec4899", icon: Palette }; // Pink
  if (normalized.includes("data science") || normalized.includes("research")) 
    return { color: "#0891b2", icon: BarChart2 }; // Cyan
  if (normalized.includes("learning") || normalized.includes("education") || normalized.includes("teaching")) 
    return { color: "#d97706", icon: GraduationCap }; // Amber
  if (normalized.includes("personal development") || normalized.includes("self") || normalized.includes("productivity") || normalized.includes("habit")) 
    return { color: "#059669", icon: Heart }; // Green
  if (normalized.includes("leadership") || normalized.includes("hr") || normalized.includes("management")) 
    return { color: "#4f46e5", icon: Users }; // Indigo
  if (normalized.includes("health") || normalized.includes("wellness") || normalized.includes("food") || normalized.includes("lifestyle")) 
    return { color: "#84cc16", icon: Heart }; // Lime
  if (normalized.includes("legal") || normalized.includes("finance") || normalized.includes("accounting")) 
    return { color: "#f59e0b", icon: TrendingUp }; // Amber

  return { color: "#10B981", icon: Sparkles }; // Default Emerald
};

export function PromptCard({ id, title, category, content, isLocked = false, isPaid = false, onSelect }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { color, icon: CategoryIcon } = useMemo(() => getCategoryConfig(category), [category]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      if (onSelect) onSelect();
      return;
    }
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const preview = content.length > 90 ? content.slice(0, 90) + "…" : content;

  const shortCategory = category.length > 20 ? category.split('(')[0].trim() : category;

  return (
    <div
      className="prompt-card"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        border: `1px solid ${hovered ? "rgba(16, 185, 129, 0.15)" : "rgba(0, 0, 0, 0.04)"}`,
        borderRadius: 28,
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: hovered
          ? "0 30px 60px -12px rgba(0,0,0,0.12), 0 18px 36px -18px rgba(0,0,0,0.08)"
          : "0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -2px rgba(0,0,0,0.01)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        height: "100%",
        boxSizing: "border-box",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Visual Thumbnail */}
      <div className="prompt-card-thumbnail" style={{
        height: 180,
        borderRadius: 22,
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Grain Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay"
        }} />

        {/* Dynamic Category Icon */}
        <div style={{
          padding: 20,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
          zIndex: 1,
          transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          <CategoryIcon style={{
            width: 32, height: 32, color: "#fff",
            filter: "drop-shadow(0 0 12px rgba(255,255,255,0.3))"
          }} />
        </div>

        {/* Floating Category Badge */}
        <div style={{
          position: "absolute",
          top: 14,
          left: 14,
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: 100,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          border: "1px solid rgba(255,255,255,0.15)",
          maxWidth: "80%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {shortCategory}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flexGrow: 1, padding: "4px 8px 10px" }}>
        <h3 
          className="prompt-card-title"
          style={{
            fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.3,
          color: "#1E293B",
          letterSpacing: "-0.04em",
          margin: 0,
        }}>
          {title}
        </h3>

        <div
          className="prompt-card-content"
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "#64748B",
            flexGrow: 1,
            fontWeight: 500,
            position: "relative",
            filter: "none",
            userSelect: "auto",
            transition: "all 0.3s ease",
            opacity: 1
          }}
        >
          {preview}
        </div>

        <div style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(0,0,0,0.04)",
          paddingTop: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#10B981", letterSpacing: "0.02em" }}>
              ALL-ACCESS VAULT
            </span>
          </div>

          <button
            onClick={handleCopy}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 18px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 800,
              background: copied ? "#10B981" : isLocked ? "#F1F5F9" : "linear-gradient(135deg, #065f46, #10b981)",
              color: (copied || !isLocked) ? "#fff" : "#1E293B",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: (copied || !isLocked) ? "0 4px 12px rgba(16,185,129,0.3)" : "none"
            }}
          >
            {copied ? (
              <Check style={{ width: 14, height: 14 }} />
            ) : (
              <Copy style={{ width: 14, height: 14 }} />
            )}
            {copied ? "Copied" : "Salin Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}