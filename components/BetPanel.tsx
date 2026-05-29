"use client";

import React from "react";

interface Props {
  
  placeBet: () => void;
  cashout: () => void;
  betState: string;
multiplier: number;
lockedBetAmount: number;

  autoTab: boolean;
  setAutoTab: (v: boolean) => void;

  autoBetEnabled: boolean;
  setAutoBetEnabled: (v: boolean) => void;

  autoCashoutEnabled: boolean;
  setAutoCashoutEnabled: (v: boolean) => void;

  autoCashout: number | null;
  setAutoCashout: (v: number | null) => void;

  playersBetting: number;
  betSlips: { id: number; amount: string }[];
addBetSlip: () => void;
removeBetSlip: (id: number) => void;
updateBetSlip: (id: number, value: string) => void;
}

export default function BetPanel({
  betSlips,
addBetSlip,
removeBetSlip,
updateBetSlip,
  placeBet,
  cashout,
  betState,
multiplier,
lockedBetAmount,
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
  const [loadingBet, setLoadingBet] = React.useState(false);
const [loadingCashout, setLoadingCashout] = React.useState(false);

  return (
    <div style={styles.container as React.CSSProperties}>

      {/* TAB SWITCH */}
      <div style={styles.toggleRow as React.CSSProperties}>
        <button
          onClick={() => setAutoTab(false)}
          style={{
            ...styles.tab,
            backgroundColor: !autoTab ? "#2a2d38" : "transparent",
            color: !autoTab ? "#fff" : "#777",
          }}
        >
          Bet
        </button>

        <button
          onClick={() => setAutoTab(true)}
          style={{
            ...styles.tab,
            backgroundColor: autoTab ? "#2a2d38" : "transparent",
            color: autoTab ? "#fff" : "#777",
          }}
        >
          Auto
        </button>
      </div>

      {/* AUTO CONTROLS */}
      {autoTab && (
        <div style={styles.autoRow as React.CSSProperties}>

          {/* AUTO BET */}
          <div style={styles.autoBox as React.CSSProperties}>
            <p>Auto Bet</p>
            <button
              onClick={() => setAutoBetEnabled(!autoBetEnabled)}
              style={{
                padding: "6px 12px",
                background: autoBetEnabled ? "#22c55e" : "#333",
                color: "#fff",
                border: "none",
                borderRadius: 8,
              }}
            >
              {autoBetEnabled ? "ON" : "OFF"}
            </button>
          </div>

          {/* AUTO CASHOUT */}
          <div style={styles.autoBox as React.CSSProperties}>
            <p>Auto Cashout</p>
            <button
              onClick={() => setAutoCashoutEnabled(!autoCashoutEnabled)}
              style={{
                padding: "6px 12px",
                background: autoCashoutEnabled ? "#22c55e" : "#333",
                color: "#fff",
                border: "none",
                borderRadius: 8,
              }}
            >
              {autoCashoutEnabled ? "ON" : "OFF"}
            </button>
          </div>

          {/* INPUT */}
         <input
  type="number"
  step="0.01"
  min="1.01"
  inputMode="decimal"
  value={autoCashout ?? ""}
  onChange={(e) => {
    const value = e.target.value;

    if (value === "") {
      setAutoCashout(null);
      return;
    }

    setAutoCashout(value === "." ? 0 : Number(value));
  }}
  placeholder="1.50x"
  style={styles.autoInput as React.CSSProperties}
/>
        </div>
      )}

      {/* BET INPUT */}
     {/* BET SLIPS SYSTEM */}
<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

  {/* EACH BET SLOT */}
  {betSlips.map((bet) => (
    <div
      key={bet.id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#1a1c24",
        padding: 10,
        borderRadius: 12,
      }}
    >

      {/* - button */}
      <button
        disabled={betState !== "IDLE"}
        onClick={() => {
          const safe = Number(bet.amount) || 0;
          updateBetSlip(bet.id, String(Math.max(0, safe - 100)));
        }}
      >
        -
      </button>

      {/* input */}
      <input
        value={bet.amount}
        disabled={betState !== "IDLE"}
        onChange={(e) => updateBetSlip(bet.id, e.target.value)}
        style={{
          flex: 1,
          textAlign: "center",
          padding: 8,
        }}
      />

      {/* + button */}
      <button
        disabled={betState !== "IDLE"}
        onClick={() => {
          const safe = Number(bet.amount) || 0;
          updateBetSlip(bet.id, String(safe + 100));
        }}
      >
        +
      </button>

      {/* remove */}
      <button
        disabled={betState !== "IDLE"}
        onClick={() => removeBetSlip(bet.id)}
        style={{ color: "red" }}
      >
        x
      </button>

    </div>
  ))}

  {/* ADD BET BUTTON */}
  <button
    disabled={betState !== "IDLE"}
    onClick={addBetSlip}
    style={{
      padding: 12,
      borderRadius: 10,
      background: "#2a2d38",
      color: "#fff",
      border: "none",
    }}
  >
    + Add Bet
  </button>

</div>

      <p style={{ color: "#888", marginTop: 10 }}>
        {playersBetting} players betting
      </p>
    </div>
  );
}

/* SIMPLE INLINE STYLES (NO TAILWIND YET = FAST MIGRATION) */
const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    background: "#12131a",
    borderRadius: 16,
    padding: 16,
    color: "white",
  },

  toggleRow: {
    display: "flex",
    marginBottom: 12,
  },

  tab: {
    flex: 1,
    padding: 10,
    border: "none",
    cursor: "pointer",
  },

  autoRow: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
    alignItems: "center",
  },

  autoBox: {
    flex: 1,
    textAlign: "center",
    background: "#1a1c24",
    padding: 10,
    borderRadius: 10,
  },

  autoInput: {
    flex: 1,
    padding: 10,
    background: "#1a1c24",
    border: "none",
    borderRadius: 10,
    color: "white",
    textAlign: "center",
  },

  inputRow: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    padding: 10,
    textAlign: "center",
  },

  quickRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  quickButton: {
    padding: 8,
    background: "#1a1c24",
    color: "#aaa",
    border: "none",
    borderRadius: 8,
  },

  actionRow: {
    display: "flex",
    gap: 10,
  },

  betBtn: {
    flex: 1,
    padding: 12,
    background: "#22c55e",
    border: "none",
    color: "#000",
    fontWeight: "bold",
    borderRadius: 10,
  },

  cashBtn: {
    flex: 1,
    padding: 12,
    background: "#00ff88",
    border: "none",
    color: "#000",
    fontWeight: "bold",
    borderRadius: 10,
  },
};