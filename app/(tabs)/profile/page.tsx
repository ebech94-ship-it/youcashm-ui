"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

const avatars = ["😎", "🔥", "🚀", "🎮", "🦅", "💎", "👑", "⚡"];

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState("😎");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.origin;

    const shareData = {
      title: "Join me on Crash Game 🚀",
      text: "Play crash games and win real rewards with me!",
      url: shareUrl,
    };

    try {
      if (navigator?.share) {
        await navigator.share(shareData);
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Invite link copied!");
      } else {
        alert("Sharing not supported on this device.");
      }
    } catch (err) {
      console.log("Share error:", err);
    }
  };

  const handleSupport = () => {
    const phone = "237682783789";
    const message = encodeURIComponent(
      "Hello Support, I need help with YouCashM."
    );

    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

    return (
  <div className="relative min-h-screen bg-gray-100 p-4 pb-24 overflow-y-auto">

    {/* BACKGROUND */}
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-300 rounded-full blur-3xl opacity-20" />

    </div>

    {/* ================= HEADER ================= */}
    <div className="relative overflow-hidden rounded-[32px] p-6 text-center mb-6 bg-gradient-to-br from-[#071226] via-[#0b1f3a] to-[#133b6b] border-2 border-yellow-500 shadow-[0_0_40px_rgba(15,23,42,0.35)]">

      {/* GOLD GLOW */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10">

        {/* AVATAR */}
        <div className="w-24 h-24 mx-auto rounded-full bg-yellow-400/10 flex items-center justify-center text-5xl border-2 border-yellow-400 shadow-lg">

          {selectedAvatar}

        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-black tracking-[2px] uppercase text-yellow-300 mt-5">

          PROFILE

        </h1>

        {/* PHONE */}
        <p className="text-sm text-white font-medium mt-2 break-all">

          {user?.phone ?? "No Mobile Number"}

        </p>

        {/* SHARE BUTTON */}
        <button
          onClick={handleShare}
          className="mt-5 bg-yellow-400 text-[#071226] px-6 py-3 rounded-2xl font-extrabold shadow-lg active:scale-95 transition-all"
        >

          👥 Invite Friends

        </button>

      </div>

    </div>

    {/* ================= ACCOUNT ================= */}
    <div className="bg-white border-2 border-gray-300 rounded-[28px] shadow-md p-5 mb-5">

      <h2 className="text-2xl font-extrabold text-[#071226] mb-5">

        👤 Account Information

      </h2>

      <div className="space-y-4">

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-300">

          <p className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">

            Mobile Number

          </p>

          <p className="font-extrabold text-black text-[16px] break-all">

            {user?.phone ?? "Not Available"}

          </p>

        </div>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-300">

          <p className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">

            Password

          </p>

          <p className="font-extrabold text-black text-[16px]">

            ••••••••••

          </p>

        </div>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-300">

          <p className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">

            User ID

          </p>

          <p className="font-extrabold text-black text-[16px] break-all">

            {user?.publicId ?? "N/A"}

          </p>

        </div>

      </div>

    </div>

    {/* ================= AVATAR ================= */}
    <div className="bg-white border-2 border-gray-300 rounded-[28px] shadow-md p-5 mb-5">

      <h2 className="text-2xl font-extrabold text-[#071226] mb-5">

        🎭 Choose Avatar

      </h2>

      <div className="flex flex-wrap gap-3">

        {avatars.map((avatar) => (

          <button
            key={avatar}
            onClick={() => setSelectedAvatar(avatar)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gray-100 border-2 transition-all active:scale-95 ${
              selectedAvatar === avatar
                ? "border-blue-600 scale-110 shadow-lg bg-blue-50"
                : "border-gray-300"
            }`}
          >

            {avatar}

          </button>

        ))}

      </div>

    </div>

    {/* ================= SOUND ================= */}
    <div className="bg-white border-2 border-gray-300 rounded-[28px] shadow-md p-5 mb-5 flex items-center justify-between">

      <div>

        <h2 className="text-lg font-extrabold text-[#071226]">

          🔊 Sound Effects

        </h2>

        <p className="text-sm font-medium text-gray-700 mt-1">

          Enable game sounds & effects

        </p>

      </div>

      <button
        onClick={() => setSoundEnabled((v) => !v)}
        className={`w-16 h-9 rounded-full p-1 transition-all ${
          soundEnabled
            ? "bg-green-500"
            : "bg-gray-400"
        }`}
      >

        <div
          className={`w-7 h-7 bg-white rounded-full transition-all ${
            soundEnabled ? "translate-x-7" : ""
          }`}
        />

      </button>

    </div>

    {/* ================= SECURITY ================= */}
    <details className="bg-white border-2 border-gray-300 rounded-[28px] shadow-md p-5 mb-5">

      <summary className="font-extrabold cursor-pointer text-xl text-[#071226]">

        🔐 Security Settings

      </summary>

      <div className="mt-5 space-y-3">

        <button className="w-full bg-gray-100 border border-gray-300 text-black py-4 rounded-2xl font-extrabold active:scale-95 transition-all">

          Change Password

        </button>

        <button className="w-full bg-gray-100 border border-gray-300 text-black py-4 rounded-2xl font-extrabold active:scale-95 transition-all">

          Verify Phone Number

        </button>

      </div>

    </details>

    {/* ================= SUPPORT ================= */}
    <details className="bg-white border-2 border-gray-300 rounded-[28px] shadow-md p-5 mb-5">

      <summary className="font-extrabold cursor-pointer text-xl text-[#071226]">

        💬 Help & Support

      </summary>

      <div className="mt-5 space-y-3">

        <button
          onClick={handleSupport}
          className="w-full bg-gray-100 border border-gray-300 text-black py-4 rounded-2xl font-extrabold active:scale-95 transition-all"
        >

          💬 Contact Support

        </button>

        <button
          onClick={() => router.push("/terms")}
          className="w-full bg-gray-100 border border-gray-300 text-black py-4 rounded-2xl font-extrabold active:scale-95 transition-all"
        >

          📜 Terms & Conditions

        </button>

        <button
          onClick={() => router.push("/privacy")}
          className="w-full bg-gray-100 border border-gray-300 text-black py-4 rounded-2xl font-extrabold active:scale-95 transition-all"
        >

          🔒 Privacy Policy

        </button>

      </div>

    </details>

    {/* ================= LOGOUT ================= */}
    <button
      onClick={handleLogout}
      className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white py-4 rounded-[28px] font-extrabold text-lg shadow-lg active:scale-[0.98] transition-all mb-10"
    >

      🚪 Logout

    </button>

  </div>
);
}