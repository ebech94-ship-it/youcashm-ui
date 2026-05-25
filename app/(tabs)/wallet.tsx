"use client";

import { useState } from "react";

export default function WalletScreen() {
  const [tab, setTab] = useState<
    "main" | "deposit" | "withdraw" | "statement" | "help" | "logout"
  >("main");

  const [amount, setAmount] = useState("");

  const balance = 12500;
  const min = 500;
  const max = 200000;

  const num = Number(amount);
  const validAmount = !isNaN(num) && num >= min && num <= max;

  return (
    <div style={styles.container}>
      <div style={styles.layout}>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          {["main", "deposit", "withdraw", "statement", "help", "logout"].map(
            (t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                style={{
                  ...styles.sideTab,
                  ...(tab === t ? styles.sideTabActive : {}),
                }}
              >
                <span style={tab === t ? styles.sideTextActive : styles.sideText}>
                  {t.toUpperCase()}
                </span>
              </button>
            )
          )}
        </div>

        {/* CONTENT */}
        <div style={styles.content}>

          {/* HEADER */}
          <div style={styles.header}>
            <p style={styles.balanceLabel}>Wallet Balance</p>
            <h1 style={styles.balance}>
              {balance.toLocaleString()} FCFA
            </h1>
            <p style={styles.phone}>
              📱 MTN / Orange: +237 6XX XXX XXX
            </p>
          </div>

          {/* MAIN */}
          {tab === "main" && (
            <div style={styles.card}>
              <h3>Quick Actions</h3>

              <div style={styles.row}>
                <button
                  style={styles.depositBtn}
                  onClick={() => setTab("deposit")}
                >
                  DEPOSIT
                </button>

                <button
                  style={styles.withdrawBtn}
                  onClick={() => setTab("withdraw")}
                >
                  WITHDRAW
                </button>
              </div>
            </div>
          )}

          {/* DEPOSIT */}
          {tab === "deposit" && (
            <div style={styles.card}>
              <h3>Deposit</h3>

              <input
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <p style={styles.hint}>
                Min {min} FCFA | Max {max.toLocaleString()} FCFA
              </p>

              <button
                disabled={!validAmount}
                style={{
                  ...styles.actionBtn,
                  opacity: !validAmount ? 0.4 : 1,
                }}
              >
                CONFIRM DEPOSIT
              </button>
            </div>
          )}

          {/* WITHDRAW */}
          {tab === "withdraw" && (
            <div style={styles.card}>
              <h3>Withdraw</h3>

              <input
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <p style={styles.hint}>
                Available: {balance.toLocaleString()} FCFA
              </p>

              <button
                disabled={!validAmount || num > balance}
                style={{
                  ...styles.actionBtn,
                  opacity: !validAmount || num > balance ? 0.4 : 1,
                }}
              >
                WITHDRAW NOW
              </button>
            </div>
          )}

          {/* STATEMENT */}
          {tab === "statement" && (
            <div style={styles.card}>
              <h3>Statements</h3>

              <div style={styles.statement}>
                <span>Bet #12345</span>
                <span style={{ color: "green" }}>+1200 FCFA</span>
              </div>

              <div style={styles.statement}>
                <span>Bet #12346</span>
                <span style={{ color: "red" }}>-500 FCFA</span>
              </div>
            </div>
          )}

          {/* HELP */}
          {tab === "help" && (
            <div style={styles.card}>
              <h3>Help Center</h3>
              <p style={styles.info}>
                • Deposits instant via MTN/Orange{"\n"}
                • Withdrawals 1–5 minutes{"\n"}
                • Min withdrawal 1000 FCFA
              </p>
            </div>
          )}

          {/* LOGOUT */}
          {tab === "logout" && (
            <div style={styles.card}>
              <h3>Logout</h3>

              <button style={styles.logoutBtn}>
                LOG OUT
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles: any = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#fff",
    fontFamily: "Arial",
  },

  layout: {
    display: "flex",
    width: "100%",
  },

  sidebar: {
    width: 120,
    background: "#f4f6f8",
    padding: 10,
    borderRight: "1px solid #ddd",
  },

  sideTab: {
    width: "100%",
    padding: 10,
    marginBottom: 8,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "white",
    cursor: "pointer",
  },

  sideTabActive: {
    background: "#3b82f6",
    borderColor: "#3b82f6",
    color: "white",
  },

  sideText: {
    fontSize: 10,
    color: "#555",
    fontWeight: 600,
  },

  sideTextActive: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },

  content: {
    flex: 1,
    padding: 15,
  },

  header: {
    textAlign: "center",
    marginBottom: 20,
  },

  balanceLabel: {
    color: "#777",
  },

  balance: {
    fontSize: 36,
    fontWeight: "bold",
  },

  phone: {
    color: "#666",
  },

  card: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },

  row: {
    display: "flex",
    gap: 10,
  },

  depositBtn: {
    flex: 1,
    background: "#22c55e",
    color: "white",
    padding: 10,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  withdrawBtn: {
    flex: 1,
    background: "#ef4444",
    color: "white",
    padding: 10,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginTop: 10,
  },

  hint: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },

  actionBtn: {
    width: "100%",
    marginTop: 15,
    background: "#3b82f6",
    color: "white",
    padding: 12,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },

  statement: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },

  info: {
    whiteSpace: "pre-line",
    color: "#555",
  },

  logoutBtn: {
    width: "100%",
    background: "#111",
    color: "white",
    padding: 12,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },
};