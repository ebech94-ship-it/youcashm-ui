"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthProvider";

type Props = {
  history: number[];
  onlineUsers: number;
};

export default function TopBar({ history, onlineUsers }: Props) {
  const { setShowDepositModal } = useAuth();

  const [showBalance, setShowBalance] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const fadeAnim = useRef(0);

  const XAF_TO_USD = 0.00165;

  const balanceXAF = 12500;
  const balanceUSD = balanceXAF * XAF_TO_USD;

  const toggleHistory = () => setShowHistory((p) => !p);
  const closeHistory = () => setShowHistory(false);

  const getMultiplierColor = (value: number) => {
    if (value < 2) return "#ffffff";
    if (value < 10) return "#7c3aed";
    if (value < 20) return "#22c55e";
    if (value < 50) return "#facc15";
    return "#ef4444";
  };

  return (
    <div style={styles.container}>

      {/* LEFT */}
      <div>
        <h1 style={styles.logo}>youCashM</h1>
        <p style={styles.online}>
          {onlineUsers.toLocaleString()} Online
        </p>
      </div>

      {/* CENTER */}
      <div style={styles.centerBox}>

        <button onClick={toggleHistory} style={styles.historyBtn}>
          📜
        </button>

        <div style={styles.miniHistory}>
          {history.slice(0, 3).map((item, i) => (
            <span key={i} style={styles.miniChip}>
              {Number(item).toFixed(2)}x
            </span>
          ))}
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

        {/* + BUTTON → OPEN DEPOSIT MODAL */}
        <button
          onClick={() => setShowDepositModal(true)}
          style={styles.addBtn}
        >
          ＋
        </button>

      </div>

      {/* HISTORY PANEL */}
      {showHistory && (
        <div
          style={styles.overlay}
          onClick={closeHistory}
        />
      )}

      {showHistory && (
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Round History</h3>

          {history.length === 0 ? (
            <p style={styles.empty}>No rounds yet</p>
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
                      ...styles.multiplier,
                      color: getMultiplierColor(item),
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

/* ================= STYLES ================= */
const styles: any = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
  },

  logo: {
    color: "#00ff88",
    fontSize: 28,
    fontWeight: "bold",
  },

  online: {
    color: "#888",
  },

  centerBox: {
    textAlign: "center",
  },

  historyBtn: {
    background: "#111827",
    padding: 10,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
  },

  miniHistory: {
    display: "flex",
    gap: 4,
    marginTop: 5,
  },

  miniChip: {
    fontSize: 11,
    color: "#00ff88",
    background: "#161821",
    padding: "2px 6px",
    borderRadius: 6,
  },

  rightBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  balanceBox: {
    background: "#161821",
    padding: 10,
    borderRadius: 12,
    textAlign: "center",
    color: "white",
  },

  balanceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  balanceLabel: {
    fontSize: 11,
    color: "#888",
  },

  eyeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "white",
  },

  balance: {
    fontWeight: "bold",
    marginTop: 5,
  },

  usd: {
    fontSize: 11,
    color: "#888",
  },

  addBtn: {
    background: "#00ff88",
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 18,
    fontWeight: "900",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
  },

  panel: {
    position: "absolute",
    top: 80,
    right: 20,
    width: "90%",
    maxHeight: 220,
    background: "#0f172a",
    borderRadius: 12,
    padding: 10,
  },

  panelTitle: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 8,
  },

  empty: {
    color: "#888",
  },

  historyScroll: {
    display: "flex",
    gap: 8,
  },

  historyChip: {
    background: "#161821",
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid",
  },

  multiplier: {
    fontWeight: "600",
  },
};