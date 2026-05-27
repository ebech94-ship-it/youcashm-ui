"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useAuth,
  type BetHistoryItem,
  type TransactionItem,
} from "@/context/AuthProvider";
import DepositModal from "@/components/DepositModal";

type RoundData = {
  roundId: string | null;
  serverSeed: string | null;
  nonce: string | null;
  hash: string | null;
  crashPoint: string | null;
};
type VerifyDetails = {
  valid: boolean;
   computedCrash: number;
  originalCrash: number;
};
const BASE_URL = "https://youcashm-backend.onrender.com";

export default function WalletPage() {
  const { user, setShowDepositModal } = useAuth();

const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  
  const [withdrawAmount, setWithdrawAmount] = useState("");
 const [hasRoundData, setHasRoundData] = useState(false);

const [verifyResult, setVerifyResult] = useState<null | boolean>(null);
const [verifying, setVerifying] = useState(false);
const [verifyDetails, setVerifyDetails] = useState<VerifyDetails | null>(null);

  const MIN_AMOUNT = 500;
const MAX_AMOUNT = 500000;

const isValidCMPhone = (phone: string) => {
  const cleaned = phone.replace(/\s/g, "");

  return /^(6(5|6|7|8|9)\d{7})$/.test(cleaned);
};

  const formattedBalance = useMemo(() => {
    return Number(user?.balance || 0).toLocaleString();
  }, [user]);


  useEffect(() => {
  const sync = () => {
    setRoundData({
      roundId: localStorage.getItem("lastRoundId"),
      serverSeed: localStorage.getItem("lastServerSeed"),
      nonce: localStorage.getItem("lastNonce"),
      hash: localStorage.getItem("lastRoundHash"),
      crashPoint: localStorage.getItem("lastCrashPoint"),
    });
  };

  sync();

  window.addEventListener("storage", sync);

  // 🔥 important: also poll (because same-tab storage doesn't trigger event)
  const interval = setInterval(sync, 1000);

  return () => {
    window.removeEventListener("storage", sync);
    clearInterval(interval);
  };
}, []);

useEffect(() => {
  const check = () => {
    const exists =
      !!localStorage.getItem("lastRoundId") &&
      !!localStorage.getItem("lastRoundHash") &&
      !!localStorage.getItem("lastServerSeed") &&
      !!localStorage.getItem("lastNonce");

    setHasRoundData(exists);
  };

  check(); // run once

  // optional: keep syncing if localStorage changes
  window.addEventListener("storage", check);

  return () => window.removeEventListener("storage", check);
}, []);

useEffect(() => {
  setVerifyResult(null);
  setVerifyDetails(null);
}, [roundData?.roundId]); 

const handleWithdraw = async () => {
  const amountNum = Number(withdrawAmount);
  const phone = user?.phone || "";

  if (!isValidCMPhone(phone)) {
    alert("Please use a valid MTN or Orange number");
    return;
  }

  if (!amountNum || amountNum < MIN_AMOUNT) {
    alert(`Minimum withdrawal is ${MIN_AMOUNT.toLocaleString()} FCFA`);
    return;
  }

  if (amountNum > MAX_AMOUNT) {
    alert(`Maximum withdrawal is ${MAX_AMOUNT.toLocaleString()} FCFA`);
    return;
  }

  if (amountNum > Number(user?.balance || 0)) {
    alert("Insufficient balance");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/withdraw/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?._id,
        amount: amountNum,
        bank_code: "011",
        account_number: phone,
        beneficiary_name: user?.phone,
        mobile_no: phone,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Withdrawal submitted");

      setShowWithdrawModal(false);
      setWithdrawAmount("");
    } else {
      alert(data.message || "Withdrawal failed");
    }
  } catch (err) {
    console.log(err);
    alert("Withdrawal failed");
  }
};

const handleVerifyRound = async () => {
  try {
    setVerifyResult(null);
    setVerifyDetails(null);
    setVerifying(true);

    // 🔥 SNAPSHOT EVERYTHING INCLUDING ROUND ID
    const snapshot = {
      roundId: localStorage.getItem("lastRoundId"),
      crashPoint: localStorage.getItem("lastCrashPoint"),
      serverSeed: localStorage.getItem("lastServerSeed"),
      nonce: localStorage.getItem("lastNonce"),
    };

    if (
      !snapshot.roundId ||
      !snapshot.crashPoint ||
      !snapshot.serverSeed ||
      !snapshot.nonce
    ) {
      alert("No round data found to verify");
      setVerifying(false);
      return;
    }

    const res = await fetch(`${BASE_URL}/api/verify-round`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roundId: snapshot.roundId,
        serverSeed: snapshot.serverSeed,
        nonce: Number(snapshot.nonce),
        crashPoint: Number(snapshot.crashPoint),
      }),
    });

    const data = await res.json();

    setVerifyDetails(data);
    setVerifyResult(data.valid);

  } catch (err) {
    console.log(err);
    setVerifyResult(false);
  } finally {
    setVerifying(false);
  }
};
  return (
    <div className="relative min-h-screen bg-white p-4 pb-28 overflow-y-auto">
<h1 style={{ color: "red" }}>REAL WALLET PAGE</h1>
      {/* ================= BACKGROUND DECOR ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />

        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30" />

      </div>

      {/* ================= HEADER ================= */}
     {/* ================= HEADER ================= */}
<div className="mb-8 text-center flex flex-col items-center">

  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,0.45)] border border-yellow-300/30 mb-4">
    <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
      💰
    </span>
  </div>

  <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-wide drop-shadow-[0_0_20px_rgba(255,215,0,0.25)]">
    WALLET
  </h1>

  <p className="text-amber-700 mt-3 text-sm tracking-wide font-semibold" >
    Manage deposits, withdrawals & transactions
  </p>

</div>

      {/* ================= BALANCE CARD ================= */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-[32px] p-6 text-white shadow-xl mb-5">

        <p className="text-sm text-white/80">
          Available Balance
        </p>

        <h2 className="text-4xl font-bold mt-2">
          {formattedBalance} FCFA
        </h2>

        <div className="flex items-center justify-between mt-6">

          <div>
            <p className="text-xs text-white/70">
              Account
            </p>

            <p className="text-xs text-white/70 mt-1">
  Player ID: {user?.publicId || "N/A"}
</p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <p className="text-xs text-white/80">
              Status
            </p>

            <p className="font-bold">
              Active
            </p>
          </div>

        </div>

      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {/* DEPOSIT */}
        <button
          onClick={() => setShowDepositModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-[28px] p-5 shadow-lg active:scale-95 transition-all text-left"
        >

          <div className="text-3xl mb-3">
            ⬇️
          </div>

          <h2 className="font-bold text-lg">
            Deposit
          </h2>

          <p className="text-sm text-white/80 mt-1">
            Fast Mobile Money Topup
          </p>

        </button>

        {/* WITHDRAW */}
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-[28px] p-5 shadow-lg active:scale-95 transition-all text-left"
        >

          <div className="text-3xl mb-3">
            ⬆️
          </div>

          <h2 className="font-bold text-lg">
            Withdraw
          </h2>

          <p className="text-sm text-white/80 mt-1">
            Instant Cashout
          </p>

        </button>

      </div>

      {/* ================= LIVE STATS ================= */}
      <div className="grid grid-cols-2 gap-3 mb-6">

        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            🎯 Total Bets
          </p>

          <h2 className="text-2xl font-bold mt-1">
            {user?.totalBets || 0}
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            🏆 Wins
          </p>

          <h2 className="text-2xl font-bold mt-1">
            {user?.wins || 0}
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            🔥 Best Multiplier
          </p>

          <h2 className="text-2xl font-bold mt-1">
            x{user?.bestMultiplier || 0}
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            💰 Profit
          </p>

          <h2 className="text-2xl font-bold mt-1 text-green-500">
            +{Number(user?.profit || 0).toLocaleString()}
          </h2>
        </div>

      </div>

      {/* ================= BET HISTORY ================= */}
      <details className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-5">

        <summary className="font-bold cursor-pointer text-lg">
          📜 Bet History
        </summary>

        <div className="mt-5 space-y-3">

          {user?.betHistory?.length ? (
            user.betHistory.map((bet: BetHistoryItem, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-2xl p-4 border-l-4 ${
                  bet.win
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >

                <div>
                  <p className="font-bold">
                    {bet.win ? "WIN" : "LOST"} • x{bet.multiplier}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {bet.date}
                  </p>
                </div>

                <p
                  className={`font-bold ${
                    bet.win
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {bet.win ? "+" : "-"}
                  {Number(bet.amount).toLocaleString()} FCFA
                </p>

              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No betting history available
            </p>
          )}

        </div>

      </details>

      {/* ================= GAME LIMITS ================= */}
      <details className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-5">

        <summary className="font-bold cursor-pointer text-lg">
          🎯 Game Limits
        </summary>

        <div className="mt-5">

          <div className="flex justify-between border-b py-3">
            <span>Minimum Bet</span>
            <span className="font-bold">
              50 FCFA
            </span>
          </div>

          <div className="flex justify-between border-b py-3">
            <span>Maximum Bet</span>
            <span className="font-bold">
              5,000 FCFA
            </span>
          </div>

          <div className="flex justify-between py-3">
            <span>Maximum Payout</span>
            <span className="font-bold">
              1,000,000 FCFA
            </span>
          </div>

        </div>

      </details>
      {/* ================= FIAR VERIFICATION ================= */}
      {/* ================= PROVABLY FAIR VERIFICATION ================= */}
<details className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-5">

  <summary className="font-bold cursor-pointer text-lg">
    🔐 Provably Fair System
  </summary>

  <div className="mt-5 space-y-3 text-sm text-gray-600 leading-6">

    <p>
      Every crash result is generated using a secure algorithm that cannot be manipulated during gameplay.
    </p>

    <p>
      You can verify each round using a unique server seed and nonce combination.
    </p>

    <p className="font-semibold text-gray-800">
      This ensures transparency, fairness, and trust in every game round.
    </p>

    {/* ================= ROUND DATA ================= */}
    {roundData && (
      <div className="bg-gray-100 p-3 rounded-xl text-xs space-y-1">
        <p><b>Round ID:</b> {roundData.roundId}</p>
        <p><b>Server Seed:</b> {roundData.serverSeed}</p>
        <p><b>Nonce:</b> {roundData.nonce}</p>
        <p><b>Crash Point:</b> {roundData.crashPoint}</p>
      </div>
    )}

    {/* ================= VERIFY BUTTON ================= */}
    <button
      onClick={handleVerifyRound}
      disabled={!hasRoundData || verifying}
      className={`w-full py-3 rounded-2xl font-bold mt-4 active:scale-95 transition-all shadow-lg ${
        !hasRoundData || verifying
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-[0_0_18px_rgba(99,102,241,0.4)]"
      }`}
    >
      {verifying ? "VERIFYING..." : "VERIFY ROUND"}
    </button>

    {/* ================= NO DATA WARNING ================= */}
    {!hasRoundData && (
      <p className="text-xs text-red-500 mt-2">
        No round data available. Play at least one round first.
      </p>
    )}

    {/* ================= RESULT ================= */}
    {verifyResult !== null && (
      <div
        className={`mt-3 text-center font-bold ${
          verifyResult ? "text-green-600" : "text-red-600"
        }`}
      >
        {verifyResult ? "✔ VALID ROUND" : "❌ INVALID ROUND"}
      </div>
    )}

    {/* ================= DETAILS ================= */}
    {verifyDetails && (
      <div className="mt-2 text-xs text-gray-600 break-all bg-gray-50 p-3 rounded-xl space-y-1">
        <p><b>Computed Crash:</b> {verifyDetails.computedCrash}</p>
        <p><b>Original Crash:</b> {verifyDetails.originalCrash}</p>
      </div>
    )}

  </div>

</details>

      {/* ================= TRANSACTION HISTORY ================= */}
      <details className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-10">

        <summary className="font-bold cursor-pointer text-lg">
          💳 Transaction History
        </summary>

        <div className="mt-5 space-y-3">

          {user?.transactions?.length ? (
            user.transactions.map((tx: TransactionItem, index: number) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between"
              >

                <div>
                  <p className="font-bold">
                    {tx.type}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {tx.date}
                  </p>
                </div>

                <p
                  className={`font-bold ${
                    tx.type === "Deposit"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {tx.type === "Deposit" ? "+" : "-"}
                  {Number(tx.amount).toLocaleString()} FCFA
                </p>

              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No transaction history available
            </p>
          )}

        </div>

      </details>

      {/* ================= DEPOSIT MODAL ================= */}
          <DepositModal />

      {/* ================= WITHDRAW MODAL ================= */}
{showWithdrawModal && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center px-4 py-8 animate-in fade-in duration-300">

    <div className="relative w-full max-w-md overflow-hidden rounded-[34px] border border-red-500/20 bg-[#0b111c] shadow-[0_0_60px_rgba(239,68,68,0.25)]">

      {/* TOP GLOW */}
      <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl"></div>

      {/* CONTENT (SCROLL AREA) */}
      <div className="relative z-10 p-6 max-h-[85vh] overflow-y-auto scrollbar-hide">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Withdraw Funds
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Secure Mobile Money Withdrawal
            </p>
          </div>

          <button
            onClick={() => setShowWithdrawModal(false)}
            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white text-xl hover:bg-white/10 transition"
          >
            ×
          </button>

        </div>

        {/* WARNING INFO */}
        <div className="mb-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">

          <p className="text-sm leading-6 text-yellow-200">
            ⚠️ Withdrawals are processed securely. Depending on network conditions, it may take a short time to complete.
          </p>

        </div>

        {/* PHONE */}
        <div className="mb-5">

          <label className="text-sm text-slate-400 mb-2 block">
            Mobile Money Number
          </label>

          <input
            type="text"
            value={user?.phone || ""}
            readOnly
            className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-4 text-white outline-none"
          />

        </div>

        {/* AMOUNT */}
        <div className="mb-4">

          <div className="flex items-center justify-between">

            <label className="text-sm text-slate-400">
              Withdrawal Amount
            </label>

            <span className="text-xs text-red-400">
              500 - 500,000 FCFA
            </span>

          </div>

          <input
            type="number"
            placeholder="Enter withdrawal amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full mt-2 rounded-2xl border border-white/10 bg-[#111827] px-4 py-4 text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />

        </div>

        {/* QUICK BUTTONS */}
        <div className="grid grid-cols-3 gap-3 mt-4 mb-6">

          {[500, 1000, 2000, 5000, 10000, 25000].map((amt) => (
            <button
              key={amt}
              onClick={() => setWithdrawAmount(String(amt))}
              className="rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-bold text-slate-300 hover:bg-red-500/20 hover:text-white transition"
            >
              {amt.toLocaleString()}
            </button>
          ))}

        </div>

        {/* INFO BOX */}
        <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4">

          <div className="flex items-start gap-3">

            <div className="text-2xl">
              💸
            </div>

            <div>

              <p className="text-sm text-white font-semibold">
                Secure Withdrawal Processing
              </p>

              <p className="text-xs leading-5 text-slate-400 mt-1">
                Withdrawals are verified and processed automatically to ensure safety and accuracy.
              </p>

            </div>

          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleWithdraw}
          disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
          className={`relative w-full overflow-hidden rounded-2xl py-4 font-extrabold transition-all duration-300 ${
            !withdrawAmount || Number(withdrawAmount) <= 0
              ? "bg-slate-600 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 via-pink-500 to-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-[0.98]"
          }`}
        >

          Continue Withdrawal

        </button>

        {/* FOOT NOTE */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">

          ⚠️ Withdrawal charges may apply depending on MTN or Orange policies.

        </p>

      </div>
    </div>
  </div>
)}

    </div>
  );
}