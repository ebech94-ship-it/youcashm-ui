"use client";

import { useState } from "react";

const avatars = ["😎", "🔥", "🚀", "🎮", "🦅", "💎", "👑", "⚡"];

export default function ProfilePage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState("😎");

  return (
    <div className="p-5 bg-white min-h-screen">

      {/* PROFILE HEADER */}
      <div className="text-center mb-6">

        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-5xl">
          {selectedAvatar}
        </div>

        <h1 className="text-2xl font-bold mt-3">Player Profile</h1>

        <p className="text-gray-500 text-sm">
          Customize your gaming experience
        </p>

        <button className="mt-4 bg-black text-white px-4 py-2 rounded-xl">
          👥 Invite / Share
        </button>

      </div>

      {/* AVATARS */}
      <div className="border p-4 rounded-xl mb-4">

        <h2 className="font-bold mb-3">Choose Avatar</h2>

        <div className="grid grid-cols-4 gap-3">
          {avatars.map((avatar) => (
            <button
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`text-3xl p-3 rounded-xl border ${
                selectedAvatar === avatar
                  ? "border-blue-500"
                  : "border-gray-200"
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>

        <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-xl">
          📸 Upload From Device
        </button>

      </div>

      {/* SOUND */}
      <div className="border p-4 rounded-xl flex justify-between items-center">

        <div>
          <h2 className="font-bold">Sound Effects</h2>
          <p className="text-gray-500 text-sm">
            Enable game sounds & effects
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`w-12 h-6 rounded-full p-1 transition ${
            soundEnabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition ${
              soundEnabled ? "ml-6" : ""
            }`}
          />
        </button>

      </div>

      {/* INFO */}
      <div className="mt-5 border p-4 rounded-xl text-sm text-gray-600">
        <p>• Bet history is stored securely</p>
        <p>• Game limits protect your wallet</p>
        <p>• Provably fair system ensures transparency</p>
      </div>

    </div>
  );
}