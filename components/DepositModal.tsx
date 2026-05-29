"use client";

import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";

const BASE_URL = "http://localhost:5000";
export default function DepositModal() {
  const { showDepositModal, setShowDepositModal, user,
  } = useAuth();
  const [depositAmount, setDepositAmount] = useState("");
const [loading, setLoading] = useState(false);
const [paymentUrl, setPaymentUrl] = useState("");
const [paymentMode, setPaymentMode] = useState<
  "iframe" | "fallback" | null
>(null);
// "iframe" | "fallback" | null

const MIN_AMOUNT = 500;
const MAX_AMOUNT = 500000;

const isValidCMPhone = (phone: string) => {
  const cleaned = phone.replace(/\s/g, "");
  return /^(6(5|6|7|8|9)\d{7})$/.test(cleaned);
};

const handleDeposit = async () => {
  if (loading) return;

  setLoading(true);

  const amountNum = Number(depositAmount);
  const phone = user?.phone || "";

  /* ✅ VALIDATE PHONE */
  if (!isValidCMPhone(phone)) {
    alert("Please use a valid MTN or Orange number");
    setLoading(false);
    return;
  }

  /* ✅ VALIDATE MIN */
  if (!amountNum || amountNum < MIN_AMOUNT) {
    alert(`Minimum deposit is ${MIN_AMOUNT.toLocaleString()} FCFA`);
    setLoading(false);
    return;
  }

  /* ✅ VALIDATE MAX */
  if (amountNum > MAX_AMOUNT) {
    alert(`Maximum deposit is ${MAX_AMOUNT.toLocaleString()} FCFA`);
    setLoading(false);
    return;
  }

  /* ✅ NETWORK TIMEOUT */
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {

    const res = await fetch(`${BASE_URL}/api/deposit/create`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      signal: controller.signal,

      body: JSON.stringify({
        userId: user?._id,
        amount: amountNum,
        mobile_no: phone,
      }),
    });

    /* ✅ STOP TIMEOUT AFTER SUCCESS */
   clearTimeout(timeoutId);

const data = await res.json();

if (data?.payment_link) {

  const link = data.payment_link;

  setPaymentUrl(link);
  setPaymentMode("iframe"); // try in-app first

  setShowDepositModal(false);
  setDepositAmount("");

      setDepositAmount("");

      setLoading(false);

    } else {

      setLoading(false);

      alert(data?.message || "Failed to create payment link");
    }

  } catch (err: any) {

    /* ✅ STOP TIMEOUT */
    clearTimeout(timeoutId);

    setLoading(false);

    /* ✅ NETWORK TOO SLOW */
    if (err.name === "AbortError") {

      alert(
        "Network is taking too long. Please check your internet connection and try again."
      );

    } else {

      alert(
        "Deposit failed. Please verify your connection and try again."
      );
    }

    console.log(err);
  }
};

  if (!showDepositModal) return null;

  return (
    <div>
      {/* ================= DEPOSIT MODAL ================= */}
     {/* ================= DEPOSIT MODAL ================= */}
{showDepositModal && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center px-4 py-8 animate-in fade-in duration-300">

    <div className="relative w-full max-w-md overflow-hidden max-h-[85vh] rounded-[34px] border border-green-500/20 bg-[#0b111c] shadow-[0_0_60px_rgba(34,197,94,0.25)]">

      {/* TOP GLOW */}
      <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl"></div>

      {/* CONTENT (SCROLL AREA) */}
      <div className="relative z-10 p-6 max-h-[85vh] overflow-y-auto scrollbar-hide overscroll-contain">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Deposit Funds
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Secure Mobile Money Deposit
            </p>
          </div>

          <button
            onClick={() => setShowDepositModal(false)}
            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white text-xl hover:bg-white/10 transition"
          >
            ×
          </button>

        </div>

        {/* NETWORK INFO */}
        <div className="mb-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">

          <p className="text-sm leading-6 text-yellow-200">
            ⚠️ Due to network conditions, payment confirmation may sometimes take a few moments.
            Please avoid closing the payment window while processing.
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
        <div className="mb-3">

          <div className="flex items-center justify-between">

            <label className="text-sm text-slate-400">
              Deposit Amount
            </label>

            <span className="text-xs text-green-400">
              500 - 500,000 FCFA
            </span>

          </div>

          <input
            type="number"
            placeholder="Enter deposit amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full mt-2 rounded-2xl border border-white/10 bg-[#111827] px-4 py-4 text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
          />

        </div>

        {/* QUICK BUTTONS */}
        <div className="grid grid-cols-3 gap-3 mt-4 mb-6">

          {[500, 1000, 2000, 5000, 10000, 25000].map((amt) => (
            <button
              key={amt}
              onClick={() => setDepositAmount(String(amt))}
              className="rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-bold text-slate-300 hover:bg-green-500/20 hover:text-white transition"
            >
              {amt.toLocaleString()}
            </button>
          ))}

        </div>

        {/* PROCESS INFO */}
        <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4">

          <div className="flex items-start gap-3">

            <div className="text-2xl">
              ✈️
            </div>

            <div>

              <p className="text-sm text-white font-semibold">
                Fast Secure Processing
              </p>

              <p className="text-xs leading-5 text-slate-400 mt-1">
                After tapping continue, a secure payment page will open for Mobile Money confirmation.
                Your wallet updates automatically after successful payment.
              </p>

            </div>

          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleDeposit}
          disabled={loading}
          className={`relative w-full overflow-hidden rounded-2xl py-4 font-extrabold transition-all duration-300 ${
            loading
              ? "bg-slate-600 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-[0.98]"
          }`}
        >

          {loading ? (
            <div className="flex items-center justify-center gap-3">

              <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>

              <span>Processing Deposit...</span>

            </div>
          ) : (
            "Continue Deposit"
          )}

        </button>

        {/* FOOT NOTE */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          ⚠️ Mobile Money operator charges may apply depending on MTN or Orange policies.
        </p>

      </div>
    </div>
  </div>
)}
{paymentMode === "iframe" && (
  <div className="fixed inset-0 z-[100] bg-black flex flex-col">

    {/* HEADER */}
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <h2 className="text-white font-bold">Complete Payment</h2>

      <button
        onClick={() => setPaymentMode("fallback")}
        className="text-white text-xl"
      >
        ✕
      </button>
    </div>

    {/* IFRAME ATTEMPT */}
    <div className="flex-1">
      <iframe
        src={paymentUrl}
        className="w-full h-full"
        onError={() => setPaymentMode("fallback")}
      />
    </div>

  </div>
)}
{paymentMode === "fallback" && (
  <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-6">

    <h2 className="text-white text-xl font-bold mb-4">
      Complete Your Payment
    </h2>

    <p className="text-slate-400 text-sm text-center mb-6">
      If the payment screen does not load, tap below to continue securely.
    </p>

    <button
      onClick={() => window.open(paymentUrl, "_self")}
      className="w-full max-w-sm bg-green-500 text-black font-bold py-4 rounded-2xl"
    >
      Open Payment Page
    </button>

    <button
      onClick={() => setPaymentMode(null)}
      className="mt-4 text-slate-400 text-sm"
    >
      Cancel
    </button>

  </div>
)}
     
         </div>
  );
}