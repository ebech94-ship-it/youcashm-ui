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
  computedHash: string;
  originalHash: string;
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
    setVerifying(true);


    const hash = localStorage.getItem("lastRoundHash");
    const serverSeed = localStorage.getItem("lastServerSeed");
    const nonce = localStorage.getItem("lastNonce");

    // ✅ SAFETY CHECK (IMPORTANT FIX)
    if ( !hash || !serverSeed || !nonce) {
      alert("No round data found to verify");
      setVerifying(false);
      return;
    }

    const res = await fetch(`${BASE_URL}/api/verify-round`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  serverSeed,
  nonce: Number(nonce),
  hash,
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

            <p className="font-semibold mt-1">
              {user?.phone || "No Number"}
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
      <details className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-[28px] shadow-sm p-5 mb-5">

  <summary className="font-bold cursor-pointer text-lg">
    🔐 Provably Fair System
  </summary>

  <div className="mt-5 space-y-3 text-sm text-gray-600 leading-6">

    <p>
      Every crash result is generated using a secure algorithm that cannot be manipulated during gameplay.
    </p>

    <p>
      You can verify each round using a unique server seed and client seed combination.
    </p>

    <p className="font-semibold text-gray-800">
      This ensures transparency, fairness, and trust in every game round.
    </p>
    {roundData && (
  <div className="bg-gray-100 p-3 rounded-xl text-xs space-y-1">
    <p><b>Round ID:</b> {roundData.roundId}</p>
    <p><b>Server Seed:</b> {roundData.serverSeed}</p>
    <p><b>Nonce:</b> {roundData.nonce}</p>
    <p><b>Hash:</b> {roundData.hash}</p>
    <p><b>Crash Point:</b> {roundData.crashPoint}</p>
  </div>
)}
<button
  onClick={handleVerifyRound}
  disabled={!hasRoundData || verifying}
  className={`w-full py-3 rounded-2xl font-bold mt-4 active:scale-95 transition-all ${
    !hasRoundData || verifying
      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
      : "bg-black text-white"
  }`}
>
  {verifying ? "VERIFYING..." : "VERIFY ROUND"}
</button>
{!hasRoundData && (
  <p className="text-xs text-red-500 mt-2">
    No round data available. Play at least one round first.
  </p>
)}
{verifyResult !== null && (
  <div
    className={`mt-3 text-center font-bold ${
      verifyResult ? "text-green-600" : "text-red-600"
    }`}
  >
    {verifyResult ? "✔ VALID ROUND" : "❌ INVALID ROUND"}
  </div>
)}
{verifyDetails && (
  <div className="mt-2 text-xs text-gray-600 break-all">
    <p><b>Computed:</b> {verifyDetails.computedHash}</p>
    <p><b>Original:</b> {verifyDetails.originalHash}</p>
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-sm rounded-[32px] p-5 shadow-2xl animate-in fade-in zoom-in duration-200">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold">
                Withdraw Funds
              </h2>
            
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-10 h-10 rounded-full bg-gray-100 text-xl"
              >
                ×
              </button>

            </div>

            <div className="space-y-4">

              <div>
                <label className="text-sm text-gray-500">
                  Mobile Number
                </label>

                <input
                  type="text"
                  value={user?.phone || ""}
                  readOnly
                  className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none bg-gray-50"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Amount
                </label>
                  <p className="text-xs text-gray-400 mt-1">
  Min: 500 FCFA • Max: 500,000 FCFA
</p>

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) =>
                    setWithdrawAmount(e.target.value)
                  }
                  className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

             <button
  onClick={handleWithdraw}
  disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
  className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 ${
    !withdrawAmount || Number(withdrawAmount) <= 0
      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
      : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
  }`}
>
  Continue Withdrawal
</button>
<p className="text-xs text-amber-500 text-center leading-5">
  ⚠️ Withdrawal processing charges may occasionally be applied by MTN or Orange Money.
</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}