import Link from "next/link";
import { 
  Sparkles, Copy, ArrowRight, Check, Zap, Shield, Layers, 
  Music, Megaphone, User, Headphones, Calendar, BarChart2, 
  Play, Mail, BookOpen, Rocket, Image as ImageIcon 
} from "lucide-react";
import { PromptCard } from "@/components/PromptCard";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "VELOPROME | 1,000+ Premium AI Prompts",
  description: "Buka 1.000+ prompt AI premium untuk ChatGPT, Claude, dan Gemini. Pembayaran sekali bayar hanya IDR 8.000.",
};

const CATEGORIES_WITH_ICONS = [
  { name: "TikTok Affiliate", icon: <Music className="w-4 h-4" /> },
  { name: "Copywriting", icon: <Megaphone className="w-4 h-4" /> },
  { name: "Personal Branding", icon: <User className="w-4 h-4" /> },
  { name: "Customer Service", icon: <Headphones className="w-4 h-4" /> },
  { name: "Content Ideas", icon: <Calendar className="w-4 h-4" /> },
  { name: "Market Research", icon: <BarChart2 className="w-4 h-4" /> },
  { name: "YouTube Scripts", icon: <Play className="w-4 h-4" /> },
  { name: "Email Marketing", icon: <Mail className="w-4 h-4" /> },
  { name: "Storytelling", icon: <BookOpen className="w-4 h-4" /> },
  { name: "Product Launch", icon: <Rocket className="w-4 h-4" /> },
  { name: "Image Generation", icon: <ImageIcon className="w-4 h-4" /> },
];

const SNEAK_PEEK = [
  {
    category: "TikTok Affiliate",
    title: "Viral TikTok Hook Generator",
    content: "Tulis naskah hook TikTok berdurasi 15 detik untuk produk afiliasi [nama produk] yang dimulai dengan statistik mengejutkan dan diakhiri dengan curiosity gap yang kuat.",
  },
  {
    category: "Copywriting",
    title: "High-Conv FB Ads Framework",
    content: "Tulis judul dan teks utama iklan Facebook menggunakan framework 'Problem → Solution → Result' untuk mendorong klik segera dari target audiens.",
  },
  {
    category: "Product Launch",
    title: "Launch Checklist Day-7",
    content: "Buat rencana hitung mundur pra-peluncuran 7 hari yang mendetail meliputi tugas harian, jadwal konten, dan pemicu urgensi untuk audiens.",
  },
];

const STATS = [
  { value: "1,000+", label: "Premium Prompts" },
  { value: "10", label: "Categories" },
  { value: "3", label: "AI Platforms" },
  { value: "IDR 8k", label: "One-time Price" },
];

export default async function LandingPage() {
  const authObj = await auth();
  const userId = authObj.userId;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Geist', system-ui, sans-serif", overflowX: "hidden" }}>

      {/* ────── NAV ────── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/LOGO.png"
              alt="Veloprome"
              style={{
                height: "clamp(28px, 5vw, 44px)",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
            <span style={{
              fontFamily: "'Geist', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(18px, 2vw, 24px)",
              letterSpacing: "0.12em",
              lineHeight: 1,
              background: "linear-gradient(90deg, #065f46, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>VELOPROME</span>
          </div>

          <div className="nav-cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {userId && (
              <>
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                  <button style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    background: "#111", color: "#fff",
                    fontSize: 13, fontWeight: 600,
                    padding: "10px 24px", borderRadius: 100, border: "none", cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  }}>
                    Dashboard <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                </Link>
                <SignOutButton><button style={{
                    background: "transparent", color: "#64748B",
                    fontSize: 13, fontWeight: 600,
                    padding: "10px 20px", borderRadius: 100, 
                    border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer",
                    transition: "all 0.2s ease"
                  }} className="logout-btn">
                    Logout
                  </button></SignOutButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ────── HERO SECTION ────── */}
      <header style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-10%", right: "-5%", width: "40%", height: "60%",
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(60px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "-5%", width: "30%", height: "50%",
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(60px)", pointerEvents: "none"
        }} />

        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "100px 24px 120px",
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 60, alignItems: "center"
        }} className="hero-container">
          
          <div style={{ zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 100,
              background: "rgba(34, 197, 94, 0.08)", color: "#16A34A",
              border: "1px solid rgba(34, 197, 94, 0.15)", marginBottom: 32
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} className="animate-pulse" />
              1,240+ Creators Joined Today
            </div>

            <h1 style={{
              fontSize: "clamp(48px, 5vw, 72px)", fontWeight: 800, lineHeight: 1.05,
              letterSpacing: "-0.04em", color: "#111", marginBottom: 28
            }}>
              The World&apos;s Most <br />
              <span style={{ 
                color: "#22C55E",
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Powerful AI</span> <br />
              Prompt Library.
            </h1>

            <p style={{ fontSize: 19, lineHeight: 1.6, color: "#52525B", maxWidth: 540, marginBottom: 48 }}>
              Buka akses ke 1.000+ prompt yang telah diuji untuk ChatGPT, Claude, dan Gemini. 
              Didesain untuk menghemat 20+ jam kerja Anda setiap minggu.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <SignInButton mode="modal" forceRedirectUrl="/payment">
                <button style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "#111", color: "#fff",
                  fontSize: 16, fontWeight: 600,
                  padding: "18px 36px", borderRadius: 100, border: "none", cursor: "pointer",
                  boxShadow: "0 20px 40px -12px rgba(0,0,0,0.3)",
                }} className="hover-scale">
                  {userId ? "Go to Dashboard" : "Get Instant Access"} <ArrowRight style={{ width: 18, height: 18 }} />
                </button>
              </SignInButton>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", gap: -8 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ 
                      width: 32, height: 32, borderRadius: "50%", border: "2px solid #fff",
                      background: `hsl(${i * 40}, 70%, 80%)`, marginLeft: i > 1 ? -12 : 0,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700
                    }}>U{i}</div>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: "#71717A", fontWeight: 500 }}>Trusted by 10k+ active users</span>
              </div>
            </div>
            <div style={{ marginTop: 24, fontSize: 14, color: "#A1A1AA" }}>
              One-time payment · <span style={{ fontWeight: 700, color: "#111" }}>Only IDR 8,000</span>
            </div>
          </div>

          <div style={{ position: "relative" }} className="hero-visual">
            <div style={{
              borderRadius: 32,
              padding: 0,
              position: "relative",
              zIndex: 2,
              overflow: "hidden",
            }}>
              <img
                src="/hero-mockup.png"
                alt="Dashboard Preview"
                style={{
                  width: "100%", height: "auto", display: "block",
                  borderRadius: 24,
                  boxShadow: "0 40px 80px -20px rgba(0,0,0,0.12)",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ────── CATEGORY MARQUEE ────── */}
      <section style={{ borderTop: "1px solid rgba(0,0,0,0.05)", borderBottom: "1px solid rgba(0,0,0,0.05)", padding: "24px 0", background: "#fff", overflow: "hidden" }}>
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {[...CATEGORIES_WITH_ICONS, ...CATEGORIES_WITH_ICONS].map((cat, i) => (
              <div key={i} style={{ 
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "0 40px", fontSize: 13, fontWeight: 600, color: "#111", opacity: 0.7
              }}>
                <span style={{ color: "#22C55E" }}>{cat.icon}</span>
                {cat.name.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── BENTO FEATURES ────── */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.04em", color: "#111", marginBottom: 16 }}>
            Designed for Speed.<br /><span style={{ color: "#22C55E" }}>Built for Quality.</span>
          </h2>
          <p style={{ fontSize: 17, color: "#71717A", maxWidth: 600, margin: "0 auto" }}>
            Semua yang Anda butuhkan untuk menguasai alur kerja AI tanpa kurva belajar yang curam.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 240px)",
          gap: 24
        }} className="bento-grid">
          <div style={{
            gridColumn: "span 2", background: "#f9fafb", borderRadius: 32, padding: 40,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            position: "relative", overflow: "hidden", border: "1px solid #F1F1F1"
          }}>
            <div style={{ position: "absolute", top: 40, right: 40 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(34, 197, 94, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Layers style={{ width: 40, height: 40, color: "#22C55E" }} />
              </div>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>10+ Specialized Categories</h3>
            <p style={{ color: "#71717A", fontSize: 15, maxWidth: 360 }}>Dari TikTok Affiliate hingga Coding Python Tingkat Lanjut — kami mencakup setiap kebutuhan niche Anda.</p>
          </div>

          <div style={{
            background: "#fff", borderRadius: 32, padding: 32,
            border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            display: "flex", flexDirection: "column", gap: 16
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap style={{ width: 22, height: 22, color: "#fff" }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700 }}>Instant Access</h3>
            <p style={{ color: "#71717A", fontSize: 14 }}>Pembayaran sekali klik, tanpa waktu tunggu. Akses semuanya seketika.</p>
          </div>

          <div style={{
            background: "#fff", borderRadius: 32, padding: 32,
            border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            display: "flex", flexDirection: "column", gap: 16
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield style={{ width: 22, height: 22, color: "#22C55E" }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700 }}>Secure QRIS</h3>
            <p style={{ color: "#71717A", fontSize: 14 }}>Pembayaran Midtrans. Aman & Terpercaya bagi seluruh pengguna di Indonesia.</p>
          </div>

          <div style={{
            gridColumn: "span 2", background: "linear-gradient(135deg, #111 0%, #333 100%)", borderRadius: 32, padding: 40,
            display: "flex", alignItems: "center", gap: 40, color: "#fff"
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Updates Forever</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>Satu kali pembayaran memberi Anda akses selamanya ke semua pembaruan prompt di masa depan secara gratis.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[Music, Mail, Rocket, Play].map((IconComp, i) => (
                  <div key={i} style={{ 
                    width: 50, height: 50, background: "rgba(255,255,255,0.1)", 
                    borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" 
                  }}>
                    <IconComp className="w-6 h-6 text-white opacity-40" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────── SAMPLE PROMPTS (Glassmorphic) ────── */}
      <section style={{ 
        padding: "100px 24px", 
        background: "radial-gradient(circle at 0% 0%, #F8FAFC 0%, #F1F5F9 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "40%", height: "40%", background: "rgba(34,197,94,0.03)", filter: "blur(80px)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "30%", height: "30%", background: "rgba(34,197,94,0.02)", filter: "blur(60px)", borderRadius: "50%" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: "0.15em", textTransform: "uppercase" }}>Vault Preview</span>
            <h2 style={{ fontSize: 42, fontWeight: 800, color: "#111", marginTop: 12, letterSpacing: "-0.04em" }}>Explore Premium Prompts</h2>
            <p style={{ fontSize: 17, color: "#64748B", maxWidth: 600, margin: "0 auto", marginTop: 12 }}>Eksplorasi koleksi prompt terbaik kami dengan desain transparan yang elegan dan siap pakai.</p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: 32 
          }} className="glass-grid">
            {SNEAK_PEEK.map((p, i) => (
              <div key={i} className="glass-card">
                 <div style={{ 
                   fontSize: 11, fontWeight: 700, color: "#22C55E", 
                   background: "rgba(34,197,94,0.1)", padding: "4px 12px", 
                   borderRadius: 100, display: "inline-block", marginBottom: 20
                 }}>
                   {p.category}
                 </div>
                 <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", marginBottom: 16 }}>{p.title}</h3>
                 <div style={{ 
                   color: "#6B7280", fontSize: 14, lineHeight: 1.6, 
                   fontStyle: "italic", marginBottom: 24, minHeight: 80
                 }}>
                   &quot;{p.content}&quot;
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 20 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF" }}>ID: VH-00{i+1}</span>
                    <button style={{ 
                      background: "#1F2937", color: "#fff", border: "none", 
                      padding: "8px 16px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                      cursor: "pointer", transition: "transform 0.2s ease"
                    }} className="glass-btn">Copy Prompt</button>
                 </div>
              </div>
            ))}
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 72 }}>
            {STATS.map((s,i) => (
                <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#1F2937" }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── FINAL CTA ────── */}
      <section style={{ padding: "120px 24px" }}>
        <div style={{
          maxWidth: 1000, margin: "0 auto", padding: "80px 48px",
          background: "linear-gradient(135deg, #111 0%, #22C55E 100%)", 
          borderRadius: 48, textAlign: "center",
          position: "relative", overflow: "hidden", color: "#fff",
          boxShadow: "0 40px 100px -20px rgba(34,197,94,0.3)"
        }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, marginBottom: 24, zIndex: 1, letterSpacing: "-0.04em" }}>
            Ready to boost your <span style={{ color: "#fff", textDecoration: "underline" }}>efficiency?</span>
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 500, margin: "0 auto 40px" }}>
            Bergabunglah dengan 10.000+ kreator profesional hari ini dengan harga promo terbatas.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", zIndex: 1 }}>
             <SignInButton mode="modal" forceRedirectUrl="/payment">
                <button style={{
                  background: "#fff", color: "#111",
                  fontSize: 16, fontWeight: 700,
                  padding: "18px 48px", borderRadius: 100, border: "none", cursor: "pointer",
                }}>
                  Access Now — IDR 8,000
                </button>
             </SignInButton>
          </div>
          
          <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 24, fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Check style={{ width: 14, height: 14 }} /> Lifetime Access</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Check style={{ width: 14, height: 14 }} /> Instant Activation</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Check style={{ width: 14, height: 14 }} /> Secure Payment</span>
          </div>
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer style={{
        padding: "60px 24px", borderTop: "1px solid rgba(0,0,0,0.06)",
        textAlign: "center", background: "#fff"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
          <img src="/LOGO.png" alt="Veloprome" style={{ height: 24, width: "auto", opacity: 0.8 }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "0.1em", color: "#111", opacity: 0.8, background: "linear-gradient(90deg, #065f46, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VELOPROME</span>
        </div>
        <p style={{ color: "#A1A1AA", fontSize: 13 }}>
          © 2026 Veloprome · Built with precision for ChatGPT, Claude & Gemini.
        </p>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .hover-scale:hover { transform: scale(1.02); }
        
        .marquee-wrapper { width: 100%; overflow: hidden; white-space: nowrap; }
        .marquee-content { display: inline-flex; animation: marquee 40s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 32px;
          padding: 32px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.05);
        }
        .glass-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.82);
          border-color: #22C55E;
          box-shadow: 0 20px 40px -10px rgba(34, 197, 94, 0.15);
        }
        .glass-btn:hover {
          background: #22C55E !important;
          transform: scale(1.05);
        }

        .logout-btn:hover { background: rgba(0,0,0,0.02); color: #111; border-color: rgba(0,0,0,0.15); }

        @media (max-width: 968px) {
          .hero-container { grid-template-columns: 1fr !important; text-align: center; }
          .bento-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .glass-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}