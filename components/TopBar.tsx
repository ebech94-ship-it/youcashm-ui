"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthProvider";

type Props = {
  history: number[];
  onlineUsers: number;
  openDeposit: () => void;
};

export default function TopBar({ history, onlineUsers,  }: Props) {
  const [showBalance, setShowBalance] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const fadeAnim = useRef(0);

  // 💱 FX
  const XAF_TO_USD = 0.00165;

const { user, setShowDepositModal } = useAuth();

const balanceXAF = user?.balance ?? 0;
const balanceUSD = balanceXAF * XAF_TO_USD;

  // toggle history (no Animated API needed in web)
  useEffect(() => {
    fadeAnim.current = showHistory ? 1 : 0;
  }, [showHistory]);

  const getMultiplierColor = (value: number) => {
    if (value < 2) return "#ffffff";
    if (value < 10) return "#7c3aed";
    if (value < 20) return "#11fc4fff";
    if (value < 50) return "#e3fa15ff";
    return "#ef4444";
  };

  return (
    <div style={styles.container}>

      {/* LEFT */}
      <div>
        <div style={styles.logo}>youCashM</div>
        <div style={styles.online}>
          {onlineUsers} Online
        </div>
      </div>

      {/* CENTER */}
      <div style={styles.centerBox}>

        <button
          onClick={() => setShowHistory((p) => !p)}
          style={styles.historyBtn}
        >
          📜
        </button>

 <div className="flex gap-1 mt-2 overflow-x-auto max-w-[1000px] no-scrollbar">
  {history.slice(0, 18).map((h, i) => {
    const color = getMultiplierColor(h);

    return (
      <span
        key={i}
        style={{
          color,
          borderColor: color,
        }}
        className="border px-2 py-1 rounded whitespace-nowrap"
      >
        {h.toFixed(2)}x
      </span>
    );
  })}
</div>
      </div>

      {/* RIGHT */}
      <div style={styles.rightBox}>

        {/* BALANCE */}
        <div style={styles.balanceBox}>
          <div style={styles.balanceHeader}>
            <span style={styles.balanceLabel}>BALANCE</span>

            <button
              onClick={() => setShowBalance((p) => !p)}
              style={styles.eyeBtn}
            >
              {showBalance ? "👁️" : "🙈"}
            </button>
          </div>

          {showBalance ? (
            <>
              <div style={styles.balance}>
                {balanceXAF.toLocaleString()} XAF
              </div>

              <div style={styles.usd}>
                ≈ ${balanceUSD.toFixed(2)} USD
              </div>
            </>
          ) : (
            <div style={styles.balance}>••••••</div>
          )}
        </div>

        {/* DEPOSIT */}
        <button
       onClick={() => setShowDepositModal(true)}
          style={styles.addBtn}
        >
          +
        </button>
      </div>

      {/* OVERLAY */}
      {showHistory && (
        <div
          style={styles.overlay}
          onClick={() => setShowHistory(false)}
        />
      )}

      {/* HISTORY PANEL */}
      {showHistory && (
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Round History</div>

          {history.length === 0 ? (
            <div style={styles.empty}>No rounds yet</div>
          ) : (
            <div style={styles.historyScroll}>
              {history.map((item, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.historyChip,
                    borderColor: getMultiplierColor(item),
                  }}
                >
                  <span
                    style={{
                      color: getMultiplierColor(item),
                      fontWeight: "bold",
                    }}
                  >
                    {Number(item).toFixed(2)}x
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

/* ===================== */
/* WEB STYLES */
/* ===================== */

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "20px",
  },

  logo: {
    color: "#00ff88",
    fontSize: "28px",
    fontWeight: "bold",
  },

  online: {
    color: "#888",
    marginTop: "4px",
  },

  centerBox: {
    textAlign: "center",
  },

  historyBtn: {
    background: "#111827",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
  },

  miniHistory: {
    display: "flex",
    gap: "6px",
    marginTop: "6px",
    justifyContent: "center",
  },

  miniChip: {
    fontSize: "11px",
    color: "#00ff88",
    background: "#161821",
    padding: "2px 6px",
    borderRadius: "6px",
  },

  rightBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  balanceBox: {
    background: "#161821",
    padding: "10px 14px",
    borderRadius: "12px",
    textAlign: "center",
  },

  balanceHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },

  balanceLabel: {
    color: "#888",
    fontSize: "11px",
  },

  eyeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#fff",
  },

  balance: {
    color: "#65d107ff",
    fontWeight: "bold",
    marginTop: "4px",
  },

  usd: {
    color: "#552af2ff",
    fontSize: "11px",
    marginTop: "2px",
  },

 addBtn: {
  background: "#25cb0fff",
  border: "2px solid black",

  width: "50px",
  height: "50px",

  borderRadius: "50%",
  fontSize: "34px",
  fontWeight: "bold",
  cursor: "pointer",

  marginRight: "16px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},
overlay: {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
},

 panel: {
  position: "absolute",
  top: "70px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: "1000px",
  background: "#0f172a",
  borderRadius: "16px",
  padding: "14px",
  border: "1px solid #1e293b",
  boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
  zIndex: 1000,
  overflow: "hidden",
  animation: "dropDown 0.25s ease",
},

  panelTitle: {
    color: "#fff",
    fontSize: "12px",
    marginBottom: "8px",
  },

  empty: {
    color: "#888",
    fontSize: "12px",
  },

historyScroll: {
  display: "grid",
  gridAutoFlow: "column",
  gridTemplateRows: "repeat(2, 1fr)",
  gap: "8px",
  overflowX: "auto",
  overflowY: "hidden",
  paddingBottom: "4px",
  marginTop: "10px",
  maxWidth: "100%",

  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // IE/Edge
},

historyChip: {
 width: "80px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  background: "#161821",
  border: "1px solid",
  flexShrink: 0,
},
};