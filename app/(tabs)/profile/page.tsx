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
    <div className="relative min-h-screen bg-white p-4 pb-24 overflow-y-auto">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30" />
      </div>

      {/* HEADER */}
      <div className="rounded-[32px] p-6 text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl">

        <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl border border-white/30 shadow-md">
          {selectedAvatar}
        </div>

        <h1 className="text-2xl font-bold mt-4">Player Profile</h1>

        <p className="text-sm text-white/80 mt-1">
          {user?.phone ?? "No Mobile Number"}
        </p>

        <button
          onClick={handleShare}
          className="mt-4 bg-white text-black px-5 py-3 rounded-2xl font-bold shadow-md active:scale-95 transition"
        >
          👥 Invite Friends
        </button>
      </div>

      {/* ACCOUNT */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-5">

        <h2 className="font-bold text-lg mb-4">👤 Account Information</h2>

        <div className="space-y-4">

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Mobile Number</p>
            <p className="font-semibold text-gray-800">
              {user?.phone ?? "Not Available"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Password</p>
            <p className="font-semibold text-gray-800">••••••••••</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1"> USER ID</p>
           <p className="font-semibold text-gray-800">
            {user?.publicId ?? "N/A"}
            </p>
          </div>

        </div>
      </div>

      {/* AVATAR */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-5">

        <h2 className="font-bold text-lg mb-4">🎭 Choose Avatar</h2>

        <div className="flex flex-wrap gap-3">
          {avatars.map((avatar) => (
            <button
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gray-100 transition active:scale-95 ${
                selectedAvatar === avatar
                  ? "border-2 border-blue-500 scale-110 shadow-md"
                  : ""
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      {/* SOUND */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-5 flex items-center justify-between">

        <div>
          <h2 className="font-bold">🔊 Sound Effects</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enable game sounds & effects
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled((v) => !v)}
          className={`w-14 h-8 rounded-full p-1 transition ${
            soundEnabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition ${
              soundEnabled ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* SECURITY */}
      <details className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-5">
        <summary className="font-bold cursor-pointer text-lg">
          🔐 Security Settings
        </summary>

        <div className="mt-5 space-y-3">
          <button className="w-full bg-gray-100 py-3 rounded-2xl font-semibold">
            Change Password
          </button>
          <button className="w-full bg-gray-100 py-3 rounded-2xl font-semibold">
            Verify Phone Number
          </button>
        </div>
      </details>

      {/* SUPPORT */}
      <details className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-5">
        <summary className="font-bold cursor-pointer text-lg">
          💬 Help & Support
        </summary>

        <div className="mt-5 space-y-3">

          <button
            onClick={handleSupport}
            className="w-full bg-gray-100 py-3 rounded-2xl font-semibold"
          >
            💬 Contact Support
          </button>

          <button
            onClick={() => router.push("/terms")}
            className="w-full bg-gray-100 py-3 rounded-2xl font-semibold"
          >
            📜 Terms & Conditions
          </button>

          <button
            onClick={() => router.push("/privacy")}
            className="w-full bg-gray-100 py-3 rounded-2xl font-semibold"
          >
            🔒 Privacy Policy
          </button>

        </div>
      </details>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-[28px] font-bold mb-10"
      >
        🚪 Logout
      </button>

    </div>
  );
}