"use client";

import { CSSProperties, useState } from "react";

import { useAuth } from "@/context/AuthProvider";

type Props = {
  mode: "login" | "join";
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({
  mode,
  onClose,
  onSuccess,
}: Props) {

const { setAuth } = useAuth();

  const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  
const submitAuth = async () => {
  try {
    setLoading(true);
    setError("");

   const BASE_URL = "https://youcashm-backend.onrender.com";

const endpoint =
  mode === "login"
    ? `${BASE_URL}/auth/login`
    : `${BASE_URL}/auth/signup`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
   

    setAuth(data.token, data.user);
    onSuccess();

} catch {
  setError(
    "Unable to connect to server. Please check your internet connection and try again."
  );
} finally {
    setLoading(false);
  }
};
 return (
  <div style={overlay}>
    <div style={modalContainer}>

      {/* HEADER */}
      <div style={header}>
        <div style={logo}>
          <span style={{ color: "#facc15" }}>you</span>
          <span style={{ color: "#fff" }}>CashM</span>
        </div>

        <button onClick={onClose} style={closeX}>
          ✕
        </button>
      </div>

      {/* TOP INDICATOR */}
      <div style={tabContainer}>
        <div style={activeTab}>
          {mode === "login"
            ? "Login"
            : "Join Now"}
        </div>
      </div>

      {/* FORM */}
      <div style={formCard}>

        <h2 style={title}>
          {mode === "login"
            ? "Welcome Back"
            : "Create Your Account"}
        </h2>

        <p style={subText}>
          {mode === "login"
            ? "Login securely to continue."
            : "Join the multiplayer crash experience."}
        </p>

        {/* PHONE */}
        <label style={label}>
          Mobile Number
        </label>

        <input
          style={input}
          placeholder="MTN / Orange number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          type="tel"
        />

        {/* PASSWORD */}
        <label style={label}>
          Password
        </label>

        <input
          style={input}
          placeholder="Enter password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          type="password"
        />

        {/* ERROR */}
        {error && (
          <p
            style={{
              color: "red",
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            {error}
          </p>
        )}

        {/* SUBMIT */}
        <button
          style={primaryBtn}
          onClick={submitAuth}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Create Account"}
        </button>

        {/* CHANGE NUMBER */}
        <p style={changeNumber}>
          Want to use another number?{" "}
          <span
            style={link}
            onClick={() => {
              setPhone("");
            }}
          >
            Change Number
          </span>
        </p>

        {/* TERMS */}
        {mode === "join" && (
          <p style={terms}>
            By creating an account, you agree
            to our Terms & Conditions.
          </p>
        )}
      </div>
    </div>
  </div>
);
}
/* ================= STYLES ================= */

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.78)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,
  padding: 20,
};

const modalContainer: CSSProperties = {
  width: "100%",
  maxWidth: 420,
  background: "#1b1f27",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
};

const header: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 20,
};

const logo: CSSProperties = {
  fontSize: 24,
  fontWeight: 900,
};

const closeX: CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: 22,
  cursor: "pointer",
};

const tabContainer: CSSProperties = {
  margin: "0 20px 20px",
  background: "#2a2f35",
  borderRadius: 30,
  padding: 5,
};

const activeTab: CSSProperties = {
  background: "#facc15",
  color: "#000",
  borderRadius: 25,
  padding: 12,
  textAlign: "center",
  fontWeight: 800,
};

const formCard: CSSProperties = {
  background: "#fff",
  margin: 15,
  borderRadius: 24,
  padding: 22,
};

const title: CSSProperties = {
  margin: 0,
  marginBottom: 8,
  color: "#111",
  fontSize: 26,
  fontWeight: 900,
};

const subText: CSSProperties = {
  color: "#666",
  marginBottom: 22,
  lineHeight: 1.5,
};

const label: CSSProperties = {
  display: "block",
  marginBottom: 10,
  color: "#111",
  fontWeight: 700,
};

const input: CSSProperties = {
  width: "100%",
  padding: 15,
  borderRadius: 14,
  border: "1px solid #ddd",
  marginBottom: 18,
  fontSize: 16,
  color: "#111",
  boxSizing: "border-box",
};

const primaryBtn: CSSProperties = {
  width: "100%",
  padding: 15,
  border: "none",
  borderRadius: 14,
  background: "#facc15",
  color: "#000",
  fontWeight: 800,
  fontSize: 16,
  cursor: "pointer",
};

const terms: CSSProperties = {
  marginTop: 18,
  fontSize: 12,
  color: "#666",
  lineHeight: 1.6,
  textAlign: "center",
};

const changeNumber: CSSProperties = {
  marginTop: 18,
  textAlign: "center",
};

const link: CSSProperties = {
  color: "#111",
  fontWeight: 700,
  cursor: "pointer",
  textDecoration: "underline",
};