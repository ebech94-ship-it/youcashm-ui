"use client";

import { useState } from "react";

interface Props {
  betAmount: string;
  setBetAmount: (value: string) => void;
  placeBet: () => void;
  cashout: () => void;

  autoTab: boolean;
  setAutoTab: (v: boolean) => void;

  autoBetEnabled: boolean;
  setAutoBetEnabled: (v: boolean) => void;

  autoCashoutEnabled: boolean;
  setAutoCashoutEnabled: (v: boolean) => void;

  autoCashout: number | null;
  setAutoCashout: (v: number | null) => void;

  playersBetting: number;
}

export default function BettingPanel({
  betAmount,
  setBetAmount,
  placeBet,
  cashout,

  autoTab,
  setAutoTab,

  autoBetEnabled,
  setAutoBetEnabled,

  autoCashoutEnabled,
  setAutoCashoutEnabled,

  autoCashout,
  setAutoCashout,

  playersBetting,
}: Props) {
  const quickAmounts = [100, 200, 500, 1000];
const [loadingBet, setLoadingBet] = useState(false);
const [loadingCashout, setLoadingCashout] = useState(false);
  return (
    <div style={styles.container}>

      {/* TOP TABS */}
      <div style={styles.toggleRow}>

        <button
          onClick={() => setAutoTab(false)}
          style={{
            ...styles.tab,
            background: !autoTab ? "#2a2d38" : "transparent",
          }}
        >
          <span style={!autoTab ? styles.activeTabText : styles.inactiveTabText}>
            Bet
          </span>
        </button>

        <button
          onClick={() => setAutoTab(true)}
          style={{
            ...styles.tab,
            background: autoTab ? "#2a2d38" : "transparent",
          }}
        >
          <span style={autoTab ? styles.activeTabText : styles.inactiveTabText}>
            Auto
          </span>
        </button>

      </div>

      {/* AUTO SETTINGS */}
      {autoTab && (
        <div style={styles.autoRow}>

          <div style={styles.autoBox}>
            <p style={styles.autoTitle}>Auto Bet</p>

            <div
              onClick={() => setAutoBetEnabled(!autoBetEnabled)}
              style={{
                ...styles.switchBase,
                background: autoBetEnabled ? "#22c55e" : "#333",
              }}
            >
              <div
                style={{
                  ...styles.switchKnob,
                  transform: autoBetEnabled
                    ? "translateX(20px)"
                    : "translateX(0px)",
                }}
              />
            </div>
          </div>

          <div style={styles.autoBox}>
            <p style={styles.autoTitle}>Auto Cashout</p>

            <div
              onClick={() =>
                setAutoCashoutEnabled(!autoCashoutEnabled)
              }
              style={{
                ...styles.switchBase,
                background: autoCashoutEnabled ? "#22c55e" : "#333",
              }}
            >
              <div
                style={{
                  ...styles.switchKnob,
                  transform: autoCashoutEnabled
                    ? "translateX(20px)"
                    : "translateX(0px)",
                }}
              />
            </div>
          </div>

          <input
            style={styles.autoInput}
            placeholder="1.50x"
            value={autoCashout !== null ? String(autoCashout) : ""}
            onChange={(e) => {
              const num = parseFloat(e.target.value);
              setAutoCashout(isNaN(num) ? null : num);
            }}
          />

        </div>
      )}

      {/* BET INPUT */}
      <div style={styles.inputRow}>

        <button
          style={styles.adjustButton}
          onClick={() =>
            setBetAmount(
              Math.max(0, Number(betAmount) - 100).toString()
            )
          }
        >
          -
        </button>

        <input
          style={styles.input}
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />

        <button
          style={styles.adjustButton}
          onClick={() =>
            setBetAmount((Number(betAmount) + 100).toString())
          }
        >
          +
        </button>

      </div>

      {/* QUICK AMOUNTS */}
      <div style={styles.quickRow}>
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            style={styles.quickButton}
            onClick={() => setBetAmount(amount.toString())}
          >
            {amount}
          </button>
        ))}
      </div>

      {/* ACTIONS */}
      <div style={styles.actionRow}>

        <button
          onClick={async () => {
  if (loadingBet) return;

  try {
    setLoadingBet(true);
    await placeBet();
  } finally {
    setLoadingBet(false);
  }
}}
          style={styles.betButton}
        >
        {loadingBet ? "BETTING..." : "BET"}
        </button>

        <button
          onClick={async () => {
  if (loadingCashout) return;

  try {
    setLoadingCashout(true);
    await cashout();
  } finally {
    setLoadingCashout(false);
  }
}}
          style={styles.cashoutButton}
        >
          {loadingCashout ? "CASHING OUT..." : "CASHOUT"}
        </button>

      </div>

      <p style={styles.players}>
        {playersBetting} players betting
      </p>

    </div>
  );
}

/* ================= STYLES ================= */
const styles: any = {
  container: {
    width: "100%",
    background: "#12131a",
    borderRadius: 20,
    padding: 18,
    color: "white",
  },

  toggleRow: {
    display: "flex",
    background: "#1a1c24",
    borderRadius: 14,
    marginBottom: 15,
  },

  tab: {
    flex: 1,
    padding: 12,
    border: "none",
    cursor: "pointer",
  },

  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },

  inactiveTabText: {
    color: "#777",
  },

  autoRow: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },

  autoBox: {
    flex: 1,
    textAlign: "center",
    background: "#1a1c24",
    padding: 10,
    borderRadius: 12,
  },

  autoTitle: {
    fontSize: 12,
    color: "#aaa",
  },

  switchBase: {
    width: 42,
    height: 22,
    borderRadius: 20,
    margin: "10px auto",
    position: "relative",
    cursor: "pointer",
  },

  switchKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    background: "white",
    position: "absolute",
    top: 2,
    left: 2,
    transition: "0.2s",
  },

  autoInput: {
    flex: 1,
    background: "#1a1c24",
    color: "white",
    textAlign: "center",
    borderRadius: 12,
    fontSize: 16,
    border: "none",
  },

  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },

  adjustButton: {
    width: 50,
    height: 50,
    background: "#1f2230",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 20,
    cursor: "pointer",
  },

  input: {
    flex: 1,
    background: "#1a1c24",
    color: "white",
    textAlign: "center",
    fontSize: 20,
    borderRadius: 12,
    border: "none",
    padding: 10,
  },

  quickRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  quickButton: {
    background: "#1a1c24",
    color: "#aaa",
    border: "none",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
  },

  actionRow: {
    display: "flex",
    gap: 15,
  },

  betButton: {
    flex: 1,
    background: "#22c55e",
    border: "none",
    padding: 15,
    borderRadius: 16,
    fontWeight: "bold",
    cursor: "pointer",
  },

  cashoutButton: {
    flex: 1,
    background: "#00ff88",
    border: "none",
    padding: 15,
    borderRadius: 16,
    fontWeight: "bold",
    cursor: "pointer",
  },

  players: {
    color: "#888",
    marginTop: 10,
    fontSize: 12,
  },
};