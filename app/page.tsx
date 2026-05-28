"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, CSSProperties } from "react";

import AuthModal from "@/components/AuthModal";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  const [authMode, setAuthMode] = useState<"login" | "join">("login");
  const [openAuth, setOpenAuth] = useState(false);
  const [loadingServer, setLoadingServer] = useState(false);
const [loadingMsg, setLoadingMsg] = useState("Waking server...");
const [retryCount, setRetryCount] = useState(0);

const tryWakeServer = async (mode: "login" | "join", attempt = 0) => {
  setLoadingServer(true);
  setLoadingMsg(attempt === 0 ? "Waking server..." : "Retrying connection...");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);

    if (res.ok) {
      setLoadingServer(false);
      setRetryCount(0);

      setAuthMode(mode);
      setTimeout(() => setOpenAuth(true), 200);
      return;
    }

    throw new Error("Server not ready");
  } catch (err) {
    if (attempt >= 4) {
      setLoadingMsg("Server still waking. Try again.");
      setLoadingServer(false);
      return;
    }

    const delay = 1200 * (attempt + 1);

    setTimeout(() => {
      setRetryCount(attempt + 1);
      tryWakeServer(mode, attempt + 1);
    }, delay);
  }
};
  /* 🔥 LOCK BODY SCROLL WHEN NEEDED (FIX DOUBLE SCROLL ISSUE) */
  useEffect(() => {
    if (openAuth) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openAuth]);

  return (
    <div style={styles.container}>
      
      {/* BACKGROUND GLOW */}
      <div style={styles.bgGlow1}></div>
      <div style={styles.bgGlow2}></div>

      {/* MAIN HERO */}
      <div style={{ ...styles.hero, position: "relative" }}>

        <Image
          src="/LogoGs.png"
          alt="youCashM Logo"
          width={120}
          height={120}
          style={styles.logo}
        />
        <div style={styles.plane}>✈️</div>
        {/* RIGHT LOGO */}
  <Image
    src="/youcashlogo.png"
    alt="youCash logo"
    width={720}
    height={320}
    style={styles.sideLogo}
  />


        <h1 style={styles.title}>youCashM ✈️</h1>

        <p style={styles.subtitle}>
          Africa’s fastest multiplayer crash experience.
          <br />
          Cash out before the plane disappears.
        </p>
      

       {/* MAIN BUTTONS */}
<div style={styles.buttonRow}>
  <button
    style={{
      ...styles.loginBtn,
      background:
        authMode === "login"
          ? "#facc15"
          : "#161b26",
      color:
        authMode === "login"
          ? "#000"
          : "#fff",
    }}
onClick={() => tryWakeServer("login")}
  >
    Login
  </button>

  <button
    style={{
      ...styles.joinBtn,
      background:
        authMode === "join"
          ? "#facc15"
          : "#22c55e",
      color:
        authMode === "join"
          ? "#000"
          : "#fff",
    }}
   onClick={() => tryWakeServer("join")}

 
  >
    Join Now
  </button>
</div>

        {/* STATS */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>10K+</h2>
            <p style={styles.statText}>Players</p>
          </div>

          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>24/7</h2>
            <p style={styles.statText}>Live Rounds</p>
          </div>

          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>Fast</h2>
            <p style={styles.statText}>Cashouts</p>
          </div>
                </div>
                {/* TRUST SECTION */}
<div style={styles.trustSection}>
  <h2 style={styles.sectionTitle}>Why Players Trust youCashM</h2>

  <div style={styles.cardsRow}>
    <div style={styles.infoCard}>
      <h3>🔒 Fair Gameplay</h3>
      <p>Every round uses provably random crash results.</p>
    </div>

    <div style={styles.infoCard}>
      <h3>⚡ Instant Processing</h3>
      <p>Deposits and withdrawals are processed automatically.</p>
    </div>

    <div style={styles.infoCard}>
      <h3>🌍 Live System</h3>
      <p>All players participate in the same real-time rounds.</p>
    </div>
  </div>
</div>

        {/* HOW IT WORKS */}
        <div style={styles.howSection}>
          <h2 style={styles.sectionTitle}>How It Works</h2>

          <div style={styles.cardsRow}>
            <div style={styles.infoCard}>
              <h3>🎯 Place Bet</h3>
              <p>Enter your amount before the round begins.</p>
            </div>

            <div style={styles.infoCard}>
              <h3>✈️ Watch Fly</h3>
              <p>Multiplier rises every second as the plane flies.</p>
            </div>

            <div style={styles.infoCard}>
              <h3>💸 Cash Out</h3>
              <p>Cash out before the crash and secure your winnings.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={styles.faqSection}>
          <h2 style={styles.sectionTitle}>Quick Questions</h2>

          <details style={styles.faqItem}>
            <summary>Is the game multiplayer?</summary>
            <p>Yes. Players join live rounds together in real time.</p>
          </details>

          <details style={styles.faqItem}>
            <summary>How do winnings work?</summary>
            <p>Your winnings depend on the multiplier when you cash out.</p>
          </details>

          <details style={styles.faqItem}>
            <summary>Can I cash out anytime?</summary>
            <p>Yes — before the plane crashes.</p>
          </details>
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <Image
            src="/LogoGs.png"
            alt="logo"
            width={90}
            height={70}
            style={styles.footerLogo}
          />

          <p style={styles.powered}>
            Powered by <br />
            GodSpeed TECHNOLOGIES
          </p>

          <p style={styles.copy}>
            © 2026 youCashM — Secure Crash Gaming
          </p>
        </div>
      </div>
      {loadingServer && (
  <div style={styles.loadingOverlay}>
    <div style={styles.loadingBox}>
      <div style={styles.spinner}></div>

      <h2 style={{ marginTop: 15 }}>{loadingMsg}</h2>

      <p style={{ color: "#9ca3af", marginTop: 10 }}>
        Attempt: {retryCount + 1}
      </p>

      <button
        onClick={() => setLoadingServer(false)}
        style={styles.cancelBtn}
      >
        Cancel
      </button>
    </div>
  </div>
)}

      {/* MODAL */}
      {openAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setOpenAuth(false)}
          onSuccess={() => {
            setOpenAuth(false);
            router.push("/game");
          }}
        />
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #05060a, #0d111c, #05060a)",
    overflowX: "hidden",
     overflowY: "auto",
     scrollbarWidth: "none",
msOverflowStyle: "none",
    width: "100%",
    position: "relative",
    padding: "40px 20px",
    fontFamily: "Arial",
  },
  plane: {
  position: "absolute",
  top: 10,
  left: 160,
  fontSize: 70,
  animation: "flyAcross 7s linear infinite",
  transform: "rotate(40deg)",  
},
sideLogo: {
  width: "clamp(120px, 35vw, 220px)",
  height: "auto",

  objectFit: "contain",

  borderRadius: 20,
  border: "3px solid #22c55e",
  background: "#0b0f19",
  boxShadow: "0 0 25px #22c55e66",

  padding: 2,

  display: "block",
  margin: "0 auto 25px auto",
},

  bgGlow1: {
    position: "absolute",
    width: 400,
    height: 400,
    background: "#22c55e33",
    borderRadius: "50%",
    filter: "blur(120px)",
    top: -100,
    left: -100,
  },

  bgGlow2: {
    position: "absolute",
    width: 350,
    height: 350,
    background: "#2563eb33",
    borderRadius: "50%",
    filter: "blur(120px)",
    bottom: -100,
    right: -100,
  },

  hero: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
    color: "white",
  },

  logo: {
    width: 140,
    height: 140,
    objectFit: "cover",
    borderRadius: "50%",
    border: "3px solid #22c55e",
    padding: 6,
    background: "#0b0f19",
    boxShadow: "0 0 35px #22c55e88",
   marginTop: 100,
animation: "float 3s ease-in-out infinite",
    marginLeft: 25,
  },

  title: {
    fontSize: 64,
    fontWeight: 900,
    margin: 0,
    background: "linear-gradient(to right, #22c55e, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    marginTop: 20,
    color: "#b0b7c3",
    fontSize: 20,
    lineHeight: 1.7,
  },
  trustSection: {
  marginTop: 80,
},

  buttonRow: {
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
  },

  switcher: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },

  switchBtn: {
    padding: "8px 20px",
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
  },

  loginBtn: {
    padding: "14px 30px",
    background: "#161b26",
    color: "white",
    border: "1px solid #2d3748",
    borderRadius: 14,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
  },

  joinBtn: {
    padding: "14px 30px",
    background: "linear-gradient(to right, #22c55e, #16a34a)",
    color: "white",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
    boxShadow: "0 0 20px #22c55e66",
  },

  statsContainer: {
    marginTop: 60,
    display: "flex",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
  },

  statCard: {
    background: "#111827aa",
    border: "1px solid #1f2937",
    borderRadius: 18,
    padding: 25,
    width: 180,
  },

  statNumber: {
    margin: 0,
    fontSize: 32,
    color: "#22c55e",
  },

  statText: {
    marginTop: 10,
    color: "#9ca3af",
  },

  howSection: { marginTop: 80 },

  sectionTitle: {
    fontSize: 36,
    marginBottom: 30,
  },

  cardsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
  },

  infoCard: {
    background: "#111827aa",
    border: "1px solid #1f2937",
    borderRadius: 20,
    padding: 30,
    width: 280,
  },

  faqSection: {
    marginTop: 80,
    maxWidth: 700,
    marginInline: "auto",
  },

  faqItem: {
    background: "#111827aa",
    marginBottom: 15,
    padding: 20,
    borderRadius: 14,
  },

  footer: {
  marginTop: 120,
  textAlign: "center",
  paddingBottom: 40,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
},

  footerLogo: {
  width: 110,
  height: 110,
  objectFit: "cover",
  borderRadius: "50%",
  border: "3px solid #22c55e",
  padding: 6,
  background: "#0b0f19",
  boxShadow: `
    0 0 15px #22c55e88,
    0 0 30px #22c55e66,
    0 0 60px #22c55e44
  `,
  display: "block",
  margin: "0 auto",
},
powered: {
  marginTop: 18,
  fontWeight: "900",
  fontSize: 22,
  lineHeight: 1.4,
  letterSpacing: 2,
  background: "linear-gradient(to right, #facc15, #22c55e, #60a5fa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: `
    0 0 10px #facc1588,
    0 0 20px #22c55e66,
    0 0 40px #60a5fa55
  `,
},

 copy: {
  marginTop: 20,
  color: "#94a3b8",
  fontSize: 13,
  letterSpacing: 1,
},
loadingOverlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
},

loadingBox: {
  background: "#0b0f19",
  border: "1px solid #1f2937",
  padding: 25,
  borderRadius: 18,
  textAlign: "center",
  width: 300,
},

spinner: {
  width: 45,
  height: 45,
  border: "4px solid #1f2937",
  borderTop: "4px solid #22c55e",
  borderRadius: "50%",
  margin: "0 auto",
  animation: "spin 1s linear infinite",
},

cancelBtn: {
  marginTop: 20,
  padding: "10px 18px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
},
};