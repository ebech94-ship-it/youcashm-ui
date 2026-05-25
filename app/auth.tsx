"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthScreen() {
  const [tab, setTab] = useState<"signup" | "login">("signup");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const validPhone = phone.startsWith("6") && phone.length === 9;
  const validPassword = password.length >= 4;
  const passwordsMatch = password === confirmPassword;

  const signupValid = validPhone && validPassword && passwordsMatch;
  const loginValid = validPhone && validPassword;

  const saveToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold">
            Y
          </div>

          <h1 className="text-3xl font-bold mt-3">youCashM</h1>
          <p className="text-gray-500 text-sm">
            Fast crash gaming with MTN MoMo
          </p>
        </div>

        {/* TABS */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-3 rounded-lg font-semibold ${
              tab === "signup" ? "bg-black text-white" : ""
            }`}
          >
            JOIN NOW
          </button>

          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 rounded-lg font-semibold ${
              tab === "login" ? "bg-black text-white" : ""
            }`}
          >
            LOGIN
          </button>
        </div>

        {/* FORM */}
        <div className="border rounded-xl p-4">

          {/* PHONE */}
          <input
            className="w-full border p-3 rounded mb-3"
            placeholder="MTN Number (6XXXXXXXX)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            className="w-full border p-3 rounded mb-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* CONFIRM (SIGNUP ONLY) */}
          {tab === "signup" && (
            <input
              className="w-full border p-3 rounded mb-3"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          {/* ERROR */}
          {tab === "signup" && !passwordsMatch && confirmPassword && (
            <p className="text-red-500 text-sm mb-2">
              Passwords do not match
            </p>
          )}

          {/* BUTTON */}
          <button
            disabled={tab === "signup" ? !signupValid : !loginValid}
            className="w-full bg-green-500 text-white py-3 rounded-xl disabled:opacity-40"
            onClick={async () => {
              const url =
                tab === "signup"
                  ? "https://youcashm-backend.onrender.com/auth/signup"
                  : "https://youcashm-backend.onrender.com/auth/login";

              try {
                const res = await fetch(url, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ phone, password }),
                });

                const data = await res.json();

                if (data.token) {
                  saveToken(data.token);
                  router.push("/game");
                } else {
                  alert(data.error || "Auth failed");
                }
              } catch {
                alert("Network error");
              }
            }}
          >
            {tab === "signup" ? "JOIN NOW" : "LOGIN"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure login powered by MTN Mobile Money
          </p>
        </div>
      </div>
    </div>
  );
}