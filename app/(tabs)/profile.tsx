"use client";

import { useState } from "react";

const avatars = ["😎", "🔥", "🚀", "🎮", "🦅", "💎", "👑", "⚡"];

export default function ProfileScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState("😎");

  return (
    <div style={styles.container}>
      <div style={{ paddingBottom: 40 }}>

        {/* PROFILE HEADER */}
        <div style={styles.profileCard}>
          <div style={styles.avatarCircle}>
            <span style={styles.avatarText}>{selectedAvatar}</span>
          </div>

          <h2 style={styles.username}>Player Profile</h2>

          <p style={styles.subText}>
            Customize your gaming experience
          </p>

          <button style={styles.inviteButton}>
            👥 Invite / Share
          </button>
        </div>

        {/* AVATARS */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Choose Avatar</h3>

          <div style={styles.avatarGrid}>
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                style={{
                  ...styles.avatarOption,
                  ...(selectedAvatar === avatar ? styles.avatarActive : {}),
                }}
              >
                <span style={styles.avatarEmoji}>{avatar}</span>
              </button>
            ))}
          </div>

          <button style={styles.uploadButton}>
            📸 Upload From Device
          </button>
        </div>

        {/* SOUND */}
        <div style={styles.card}>
          <div style={styles.rowBetween}>
            <div>
              <h3 style={styles.sectionTitle}>Sound Effects</h3>
              <p style={styles.info}>Enable game sounds & effects</p>
            </div>

            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
          </div>
        </div>

        {/* BET HISTORY */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>My Bet History</h3>

          <div style={styles.historyItem}>
            <div>
              <p style={styles.betId}>Bet #A1024</p>
              <p style={styles.betDate}>18 May 2026 • 20:35</p>
            </div>
            <p style={styles.winText}>+1,500 FCFA</p>
          </div>

          <div style={styles.historyItem}>
            <div>
              <p style={styles.betId}>Bet #A1025</p>
              <p style={styles.betDate}>18 May 2026 • 20:41</p>
            </div>
            <p style={styles.lossText}>-500 FCFA</p>
          </div>
        </div>

        {/* GAME LIMITS */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Game Limits</h3>

          <div style={styles.limitRow}>
            <span>Minimum Bet</span>
            <span>100 FCFA</span>
          </div>

          <div style={styles.limitRow}>
            <span>Maximum Bet</span>
            <span>100,000 FCFA</span>
          </div>

          <div style={styles.limitRow}>
            <span>Maximum Payout</span>
            <span>5,000,000 FCFA</span>
          </div>
        </div>

        {/* HOW TO PLAY */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>How To Play</h3>
          <p style={styles.info}>
            • Enter your bet amount{"\n"}
            • Press BET before round starts{"\n"}
            • Watch multiplier rise{"\n"}
            • Cash out before crash
          </p>
        </div>

        {/* FAIRNESS */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Provably Fair</h3>

          <p style={styles.info}>
            This game uses a provably fair system.
          </p>

          <button style={styles.fairButton}>
            VERIFY FAIRNESS
          </button>
        </div>

      </div>
    </div>
  );
}

const styles: any = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    fontFamily: "Arial",
  },

  profileCard: {
    textAlign: "center",
    marginBottom: 20,
  },

  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 10px",
  },

  avatarText: {
    fontSize: 48,
  },

  username: {
    fontSize: 24,
    fontWeight: "bold",
  },

  subText: {
    color: "#666",
  },

  inviteButton: {
    marginTop: 15,
    backgroundColor: "#111",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
  },

  card: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  avatarGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },

  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 12,
    background: "#f3f4f6",
    border: "none",
    cursor: "pointer",
  },

  avatarActive: {
    outline: "2px solid #3b82f6",
  },

  avatarEmoji: {
    fontSize: 24,
  },

  uploadButton: {
    marginTop: 15,
    backgroundColor: "#3b82f6",
    color: "white",
    padding: 10,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  info: {
    color: "#555",
    lineHeight: 1.5,
    whiteSpace: "pre-line",
  },

  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    padding: "10px 0",
  },

  betId: { fontWeight: "bold" },
  betDate: { fontSize: 12, color: "#777" },

  winText: { color: "green", fontWeight: "bold" },
  lossText: { color: "red", fontWeight: "bold" },

  limitRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  fairButton: {
    marginTop: 15,
    backgroundColor: "#111",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
  },
};