"use client";

import Link from "next/link";
import { Home, Wallet, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">

      {/* PAGE CONTENT */}
      <div className="flex-1">{children}</div>

          {/* BOTTOM TABS */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-yellow-700/30 bg-black/95 backdrop-blur-md flex justify-around py-3 shadow-[0_-2px_20px_rgba(255,215,0,0.15)]">

        <Link
          href="/game"
          className={`flex flex-col items-center transition-all duration-300 ${
            pathname === "/game"
              ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.9)] scale-110"
              : "text-yellow-700"
          }`}
        >
          <Home size={22} strokeWidth={2.4} />
          <span className="text-xs mt-1 font-medium">Home</span>
        </Link>

        <Link
          href="/wallet"
          className={`flex flex-col items-center transition-all duration-300 ${
            pathname === "/wallet"
              ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.9)] scale-110"
              : "text-yellow-700"
          }`}
        >
          <Wallet size={22} strokeWidth={2.4} />
          <span className="text-xs mt-1 font-medium">Wallet</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center transition-all duration-300 ${
            pathname === "/profile"
              ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.9)] scale-110"
              : "text-yellow-700"
          }`}
        >
          <User size={22} strokeWidth={2.4} />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </Link>

      </div>
    </div>
  );
} 