"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  history: number[];
  onlineUsers: number;
  onOpenDeposit: () => void; // ✅ IMPORTANT FIX
};

export default function TopBar({ history, onlineUsers, onOpenDeposit }: Props) {
  const [showBalance, setShowBalance] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const fadeAnim = useRef(1);

  const XAF_TO_USD = 0.00165;

  const balanceXAF = 12500;
  const balanceUSD = balanceXAF * XAF_TO_USD;

  const toggleHistory = () => setShowHistory((p) => !p);

  const getMultiplierColor = (value: number) => {
    if (value < 2) return "#fff";
    if (value < 10) return "#7c3aed";
    if (value < 20) return "#22c55e";
    if (value < 50) return "#facc15";
    return "#ef4444";
  };

  return (
    <div className="w-full flex justify-between items-start px-5 pt-5">

      {/* LEFT */}
      <div>
        <h1 className="text-green-400 text-2xl font-bold">youCashM</h1>
        <p className="text-gray-400 text-sm">{onlineUsers} Online</p>
      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center">
        <button onClick={toggleHistory} className="bg-gray-900 px-3 py-2 rounded-lg">
          📜
        </button>

        <div className="flex gap-1 mt-2">
          {history.slice(0, 3).map((h, i) => (
            <span key={i} className="text-xs text-green-400 bg-gray-900 px-2 rounded">
              {h.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* BALANCE */}
        <div className="bg-gray-900 px-3 py-2 rounded-xl text-white text-center">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-xs text-gray-400">BAL</span>
            <button onClick={() => setShowBalance((p) => !p)}>
              {showBalance ? "👁️" : "🙈"}
            </button>
          </div>

          {showBalance ? (
            <>
              <p className="font-bold">{balanceXAF.toLocaleString()} XAF</p>
              <p className="text-xs text-gray-400">${balanceUSD.toFixed(2)}</p>
            </>
          ) : (
            <p className="font-bold">••••••</p>
          )}
        </div>

        {/* + DEPOSIT BUTTON (FIXED) */}
        <button
          onClick={onOpenDeposit}   // ✅ THIS FIXES YOUR ISSUE
          className="bg-green-400 text-black font-bold px-3 py-2 rounded-xl text-xl"
        >
          +
        </button>
      </div>
    </div>
  );
}