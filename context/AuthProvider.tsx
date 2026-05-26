"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { saveAuth, clearAuth } from "@/lib/auth";
import DepositModal from "@/components/DepositModal";


export type BetHistoryItem = {
  win: boolean;
  multiplier: number;
  amount: number;
  date: string;
};

export type TransactionItem = {
  type: "Deposit" | "Withdrawal";
  amount: number;
  date: string;
};

type User = {
  _id: string;

  phone: string;

  balance: number;

  totalBets: number;

  wins: number;

  bestMultiplier: number;

  profit: number;

  betHistory: BetHistoryItem[];

  transactions: TransactionItem[];
   publicId?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;

  setAuth: (token: string, user: User) => void;
  logout: () => void;

  updateUser: (user: User) => void;

  // 🔥 ADD THESE (IMPORTANT)
  setBalance: (amount: number) => void;
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => void;
  roundHistory: number[];
setRoundHistory: React.Dispatch<React.SetStateAction<number[]>>;
showDepositModal: boolean;
setShowDepositModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
const [roundHistory, setRoundHistory] = useState<number[]>([]);
const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
  const initAuth = () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) return;

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);
      setToken(storedToken);
    } catch (err) {
      console.error("Invalid stored user:", err);
    }
  };

  initAuth();
}, []);

  // LOGIN
  const setAuth = (token: string, user: User) => {
    saveAuth(token, user);
    setToken(token);
    setUser(user);
  };

  // LOGOUT
  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  // UPDATE FULL USER
  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // 🔥 BALANCE CONTROL (THIS IS WHAT YOU WERE MISSING)

  const setBalance = (amount: number) => {
    if (!user) return;
    const updated = { ...user, balance: amount };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const addBalance = (amount: number) => {
    if (!user) return;
    const updated = { ...user, balance: user.balance + amount };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const subtractBalance = (amount: number) => {
    if (!user) return;
    const updated = { ...user, balance: user.balance - amount };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setAuth,
        logout,
        updateUser,

        // 🔥 EXPOSE THEM
        setBalance,
        addBalance,
        subtractBalance,
        roundHistory,
setRoundHistory,
showDepositModal,
setShowDepositModal,
      }}
    >
       {children}

    {/* ✅ THIS IS THE EXACT PLACE */}
   {showDepositModal && <DepositModal />}

  </AuthContext.Provider>
);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth missing provider");
  return ctx;
}