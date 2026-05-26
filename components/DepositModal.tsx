"use client";

import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";

const BASE_URL = "https://youcashm-backend.onrender.com";
export default function DepositModal() {
  const { showDepositModal, setShowDepositModal, user,
  } = useAuth();
  const [depositAmount, setDepositAmount] = useState("");
const [loading, setLoading] = useState(false);

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

  if (!isValidCMPhone(phone)) {
    alert("Please use a valid MTN or Orange number");
    return;
  }

  if (!amountNum || amountNum < MIN_AMOUNT) {
    alert(`Minimum deposit is ${MIN_AMOUNT.toLocaleString()} FCFA`);
    return;
  }

  if (amountNum > MAX_AMOUNT) {
    alert(`Maximum deposit is ${MAX_AMOUNT.toLocaleString()} FCFA`);
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/deposit/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?._id,
        amount: amountNum,
        mobile_no: phone,
      }),
    });

    const data = await res.json();

    if (data?.payment_link) {
      window.open(data.payment_link, "_blank");

      setShowDepositModal(false);
      setDepositAmount("");
      setLoading(false);
    } else {
    setLoading(false);
      alert(data?.message || "Failed to create payment link");
    }
  } catch (err) {
    console.log(err);
    setLoading(false);
    alert("Deposit failed");
  }
};

  if (!showDepositModal) return null;

  return (
    <div>
      {/* ================= DEPOSIT MODAL ================= */}
     
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-sm rounded-[32px] p-5 shadow-2xl animate-in fade-in zoom-in duration-200">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold">
                Deposit Funds
              </h2>

              <button
                onClick={() => setShowDepositModal(false)}
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
                  value={depositAmount}
                  onChange={(e) =>
                    setDepositAmount(e.target.value)
                  }
                  className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-500"
                />
              </div>

             <button
  onClick={handleDeposit}
  disabled={loading}
  className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all ${
    loading
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-gradient-to-r from-green-500 to-emerald-500 text-white active:scale-95"
  }`}
>
  {loading ? "Processing..." : "Continue Deposit"}
</button>

<p className="text-xs text-amber-500 text-center leading-5">
  ⚠️ Mobile Money operator charges may apply depending on MTN or Orange policies.
</p>
            </div>

          </div>

        </div>
     
         </div>
  );
}