"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowDownToLine, Loader2, Check, X, Clock,
  Wallet, TrendingUp, CircleDollarSign, History
} from "lucide-react";
import { motion } from "framer-motion";

const MIN_WD = 25000;

function fmt(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; label: string; icon: any }> = {
    PENDING: { color: "var(--ethereal-on-surface-variant)", bg: "var(--ethereal-surface-container-highest)", label: "Diproses", icon: Clock },
    PAID:    { color: "#006c49", bg: "rgba(16, 185, 129, 0.1)", label: "Berhasil",  icon: Check },
    REJECTED:{ color: "#ba1a1a", bg: "#ffdad6", label: "Ditolak",  icon: X },
  };
  const cfg = map[status] || map.PENDING;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg,
      padding: "6px 12px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase"
    }}>
      <Icon style={{ width: 12, height: 12 }} />
      {cfg.label}
    </span>
  );
}

export function WithdrawalPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/referral/stats");
      const d = await r.json();
      setStats(d);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleWithdraw = async () => {
    setRequesting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/withdrawal", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Komisi Anda sedang dikirim ke rekening! Verifikasi selesai dalam 1x24 jam." });
        fetchStats();
      } else {
        setMessage({ type: "error", text: data.error || "Gagal mengajukan pencairan." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    }
    setRequesting(false);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <Loader2 style={{ width: 32, height: 32, color: "var(--ethereal-primary)", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const available = stats?.available || 0;
  const earnings = stats?.earnings || 0;
  const totalWithdrawn = stats?.totalWithdrawn || 0;
  const history = stats?.withdrawalHistory || [];
  const canWithdraw = available >= MIN_WD;

  const cards = [
    { label: "TOTAL KOMISI", value: fmt(earnings), icon: TrendingUp },
    { label: "SIAP CAIR", value: fmt(available), icon: Wallet, isPrimary: true },
    { label: "TOTAL DITERIMA", value: fmt(totalWithdrawn), icon: CircleDollarSign },
  ];

  return (
    <div style={{ marginTop: 100, paddingBottom: 100, fontFamily: "var(--font-inter), sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ 
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "var(--ethereal-primary)", fontSize: "12px", fontWeight: 800, 
            background: "rgba(0, 108, 73, 0.05)", padding: "8px 16px", borderRadius: "full",
            marginBottom: 20, letterSpacing: "0.05em",
            fontFamily: "var(--font-jakarta)"
        }}>
           <CircleDollarSign style={{ width: 16, height: 16 }} />
           <span>DISBURSEMENT CENTER</span>
        </div>
        <h3 style={{ fontSize: 32, fontWeight: 800, color: "var(--ethereal-on-surface)", letterSpacing: "-0.04em", margin: "0 0 12px", fontFamily: "var(--font-jakarta)" }}>
          Pencairan Saldo Quest
        </h3>
        <p style={{ fontSize: 16, color: "var(--ethereal-on-surface-variant)", fontWeight: 500, margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
          Transfer diproses secara otomatis setiap hari kerja pukul 09:00 - 17:00 WIB.
        </p>
      </div>

      {/* Balance Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, marginBottom: 48 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: "var(--ethereal-surface-container-lowest)",
            borderRadius: "2rem",
            padding: "32px",
            boxShadow: "0 20px 40px rgba(28, 27, 27, 0.04)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}>
            <p style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 800, margin: "0 0 12px", letterSpacing: "0.15em", fontFamily: "var(--font-jakarta)" }}>{c.label}</p>
            <p style={{ 
                fontSize: "28px", fontWeight: 900, 
                color: c.isPrimary ? "var(--ethereal-primary)" : "var(--ethereal-on-surface)", 
                margin: 0, letterSpacing: "-0.04em", fontFamily: "var(--font-jakarta)" 
            }}>
                {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Withdraw CTA / Alert */}
      <div style={{
        background: canWithdraw ? "var(--ethereal-surface-container-lowest)" : "#fffcf2",
        borderRadius: "2.5rem",
        padding: "48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 64,
        gap: 32,
        flexWrap: "wrap",
        border: `1px solid ${canWithdraw ? "rgba(255,255,255,0.5)" : "#fff1c2"}`,
        boxShadow: canWithdraw ? "0 40px 100px -20px rgba(0,0,0,0.05)" : "none"
      }}>
        <div style={{ flex: 1, minWidth: 320, display: "flex", alignItems: "flex-start", gap: 24 }}>
          {!canWithdraw && (
             <div style={{ 
                width: 48, height: 48, borderRadius: "full", background: "#f59e0b", 
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0
             }}>
                <ArrowDownToLine style={{ width: 24, height: 24 }} />
             </div>
          )}
          <div>
            <h4 style={{ 
                fontWeight: 800, fontSize: "20px", 
                color: "var(--ethereal-on-surface)", 
                margin: "0 0 8px", fontFamily: "var(--font-jakarta)" 
            }}>
                {canWithdraw ? `${fmt(available)} Siap Dicairkan` : `Saldo Belum Mencapai ${fmt(MIN_WD)}`}
            </h4>
            <p style={{ fontSize: "15px", color: "var(--ethereal-on-surface-variant)", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
                {canWithdraw
                ? "Semua syarat pencairan telah terpenuhi. Klik tombol di kanan untuk mulai proses transfer otomatis."
                : `Terus bagikan link Quest Anda! Anda butuh ${fmt(MIN_WD - available)} lagi untuk melakukan pencairan pertama.`}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={canWithdraw ? { scale: 1.05 } : {}}
          whileTap={canWithdraw ? { scale: 0.95 } : {}}
          onClick={canWithdraw ? handleWithdraw : undefined}
          disabled={!canWithdraw || requesting}
          style={{
            minWidth: 200,
            padding: "20px 48px",
            borderRadius: "9999px",
            border: "none",
            background: canWithdraw ? "var(--mint-gradient)" : "var(--ethereal-surface-container-highest)",
            color: canWithdraw ? "#fff" : "#94A3B8",
            fontSize: "15px", fontWeight: 800,
            cursor: canWithdraw && !requesting ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
            boxShadow: canWithdraw ? "0 20px 50px rgba(0, 108, 73, 0.2)" : "none",
            fontFamily: "var(--font-jakarta)",
            transition: "all 0.3s ease"
          }}
        >
          {requesting ? "VERIFIKASI..." : "CAIRKAN SALDO"}
        </motion.button>
      </div>

      {/* Message Popup */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "24px 32px", borderRadius: "2rem", marginBottom: 64,
            fontSize: 15, fontWeight: 700,
            background: message.type === "success" ? "rgba(16, 185, 129, 0.05)" : "rgba(186, 26, 26, 0.05)",
            color: message.type === "success" ? "#006c49" : "#ba1a1a",
            border: `1px solid ${message.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(186, 26, 26, 0.2)"}`,
            display: "flex", alignItems: "center", gap: 16
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: "full", background: message.type === "success" ? "#006c49" : "#ba1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            {message.type === "success" ? <Check style={{ width: 18, height: 18 }} /> : <X style={{ width: 18, height: 18 }} />}
          </div>
          {message.text}
        </motion.div>
      )}

      {/* History List */}
      {history.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <h4 style={{ fontSize: 24, fontWeight: 800, color: "var(--ethereal-on-surface)", letterSpacing: "-0.02em", fontFamily: "var(--font-jakarta)" }}>Riwayat Pencairan</h4>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {history.map((wd: any) => (
              <div key={wd.id} style={{
                background: "var(--ethereal-surface-container-lowest)",
                borderRadius: "2rem",
                padding: "24px 32px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 20,
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 10px 30px rgba(28, 27, 27, 0.02)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "1.25rem", background: "var(--ethereal-surface-container-low)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircleDollarSign style={{ width: 24, height: 24, color: "#94A3B8" }} />
                    </div>
                    <div>
                        <p style={{ fontWeight: 800, fontSize: "18px", color: "var(--ethereal-on-surface)", margin: "0 0 6px", fontFamily: "var(--font-jakarta)" }}>{fmt(wd.amount)}</p>
                        <p style={{ fontSize: "13px", color: "var(--ethereal-on-surface-variant)", fontWeight: 500, margin: 0 }}>
                            {wd.bankName} · {wd.accountNumber} · {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(wd.createdAt))}
                        </p>
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <StatusBadge status={wd.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
