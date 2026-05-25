"use client";

import { useEffect, useRef, useState } from "react";
import socket from "../services/socket";
import { useAuth } from "@/context/AuthProvider";

import TopBar from "../components/TopBar";
import BettingPanel from "../components/BettingPanel";

const BASE_URL = "https://youcashm-backend.onrender.com";

type TrailPoint = {
  x: number;
  y: number;
  opacity: number;
};

export default function GameScreen() {
  const [multiplier, setMultiplier] = useState(1);
  const [status, setStatus] = useState("WAITING");
  const [crashPoint, setCrashPoint] = useState<number | null>(null);

  const [betAmount, setBetAmount] = useState("100");
  const [roundId, setRoundId] = useState<string | null>(null);
  const [betId, setBetId] = useState<string | null>(null);

  const [roundHistory, setRoundHistory] = useState<number[]>([]);
  const [nextRoundCountdown, setNextRoundCountdown] = useState(5);
  const [isBettingPhase, setIsBettingPhase] = useState(true);

  const [onlineUsers, setOnlineUsers] = useState(0);
  const [playersBetting, setPlayersBetting] = useState(0);
const { setShowDepositModal } = useAuth();

  const [autoTab, setAutoTab] = useState(false);
  const [autoBetEnabled, setAutoBetEnabled] = useState(false);
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(false);
  const [autoCashout, setAutoCashout] = useState<number | null>(null);

  const cashoutLock = useRef(false);
  const isRunningRef = useRef(false);

  const trail = useRef<TrailPoint[]>([]);
  const frameRef = useRef<number | null>(null);

  const targetMultiplier = useRef(1);
  const displayedMultiplier = useRef(1);

  const plane = useRef({ x: 0, y: 0 });

  const [renderTick, setRenderTick] = useState(0);

  /* ================= SOCKET ================= */

  useEffect(() => {
    socket.off();

    socket.on("onlineUsers", (d: any) => setOnlineUsers(d.count || 0));
    socket.on("playersBetting", (d: any) =>
      setPlayersBetting(d.count || 0)
    );

    socket.on("roundStart", (d: any) => {
      setStatus("RUNNING");
      setRoundId(d.roundId);

      isRunningRef.current = true;
      displayedMultiplier.current = 1;
      targetMultiplier.current = 1;

      setMultiplier(1);
      cashoutLock.current = false;
      trail.current = [];
    });

    socket.on("multiplier", (d: any) => {
      targetMultiplier.current = d.multiplier;
    });

    socket.on("roundCrash", (d: any) => {
      setStatus("CRASHED");
      isRunningRef.current = false;

      const point = d.crashPoint || 1;

      setCrashPoint(point);
      setMultiplier(point);

      setRoundHistory((p) => [point, ...p].slice(0, 20));
    });

    socket.on("roundWaiting", (d: any) => {
      setStatus("WAITING");
      setIsBettingPhase(true);
      setNextRoundCountdown(d.countdown || 5);
      isRunningRef.current = false;
    });

    return () => socket.off();
  }, []);

  /* ================= ANIMATION ================= */

  useEffect(() => {
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (!isRunningRef.current) return;

      const SMOOTH = 0.15;

      displayedMultiplier.current +=
        (targetMultiplier.current - displayedMultiplier.current) * SMOOTH;

      const m = displayedMultiplier.current;

      setMultiplier(m);

      const x = (m - 1) * 120;
      const y = -((m - 1) ** 1.4) * 60;

      plane.current = { x, y };

      trail.current.push({ x, y, opacity: 1 });

      trail.current = trail.current
        .map((t) => ({ ...t, opacity: t.opacity - 0.03 }))
        .filter((t) => t.opacity > 0);

      setRenderTick((v) => v + 1);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* ================= BET ================= */

  const placeBet = async () => {
    if (!roundId) return;

    const res = await fetch(`${BASE_URL}/api/bet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "player1",
        amount: Number(betAmount),
        roundId,
      }),
    });

    const data = await res.json();
    setBetId(data.bet?.id);
  };

  const cashout = async () => {
    if (!betId || cashoutLock.current) return;

    cashoutLock.current = true;

    try {
      const res = await fetch(`${BASE_URL}/api/cashout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ betId }),
      });

      const data = await res.json();

      if (data.success) setBetId(null);
      else cashoutLock.current = false;
    } catch {
      cashoutLock.current = false;
    }
  };

  /* ================= UI ================= */

  return (
    <div style={{ background: "#0b0b0f", minHeight: "100vh", padding: 20 }}>
 <TopBar
  history={roundHistory}
  onlineUsers={onlineUsers}
  openDeposit={() => setShowDepositModal(true)}
/>

      <div
        style={{
          height: 420,
          background: "#0f1118",
          borderRadius: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {trail.current.map((t, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: t.x,
              top: t.y,
              width: 10,
              height: 4,
              background: "red",
              opacity: t.opacity,
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: plane.current.x,
            top: plane.current.y,
            fontSize: 40,
          }}
        >
          ✈️
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 60,
            color: "#fff",
          }}
        >
          {multiplier.toFixed(2)}x
        </div>
      </div>

      <BettingPanel
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        placeBet={placeBet}
        cashout={cashout}
        autoTab={autoTab}
        setAutoTab={setAutoTab}
        autoBetEnabled={autoBetEnabled}
        setAutoBetEnabled={setAutoBetEnabled}
        autoCashoutEnabled={autoCashoutEnabled}
        setAutoCashoutEnabled={setAutoCashoutEnabled}
        autoCashout={autoCashout}
        setAutoCashout={setAutoCashout}
        playersBetting={playersBetting}
      />
    </div>
  );
}