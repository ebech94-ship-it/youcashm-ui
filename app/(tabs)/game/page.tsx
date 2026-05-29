"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import TopBar from "@/components/TopBar";
import BettingPanel from "@/components/BetPanel";
import Leaderboard, { LiveBetRow } from "@/components/Leaderboard";
import { useAuth } from "@/context/AuthProvider";

type OnlineUsersData = {
  count: number;
};

type PlayersBettingData = {
  count: number;
};

type RoundStartData = {
  roundId: string;
};

type MultiplierData = {
  multiplier: number;
};
type RoundWaitingData = {
  countdown?: number;
};
type Smoke = {
  x: number;
  y: number;
  id: string;
};
type RoundRevealData = {
  roundId: string;
  hash: string;
  serverSeed: string;
  nonce: number;
  crashPoint: number;
};
type RoundCrashData = {
  multiplier: number;
  crashPoint?: number;
  roundId?: string;

  // ✅ ADD THESE
  hash?: string;
  serverSeed?: string;
  nonce?: number;
};
type SyncStateData = {
  roundId: string | null;
  status: "WAITING" | "RUNNING" | "CRASHED";
  multiplier: number;
  crashPoint: number | null;
};

type HistorySyncData = {
  roundId: string;
  crashPoint: number;
  time: number;
}[];

export default function GameScreen() {
  // ======================
  // GAME STATE
  // ======================
const { user, roundHistory, setRoundHistory, setShowDepositModal } = useAuth();

  const [multiplier, setMultiplier] = useState(1);
    const [betAmount, setBetAmount] = useState("100");
   const [liveBoard, setLiveBoard] = useState<LiveBetRow[]>([]);

  const [roundId, setRoundId] = useState<string | null>(null);
  const [betId, setBetId] = useState<string | null>(null);
const [betState, setBetState] = useState<
  "IDLE" |
  "LOCKED" |
  "ACTIVE" |
  "CASHED_OUT" |
  "LOST"
>("IDLE");
const [lockedBetAmount, setLockedBetAmount] = useState(0);
const [betSlips, setBetSlips] = useState([
  { id: 1, amount: "100" }
]);
const [betIds, setBetIds] = useState<string[]>([]);
const [betHistory, setBetHistory] = useState<any[]>([]);

  const [onlineUsers, setOnlineUsers] = useState(0);
  const [playersBetting, setPlayersBetting] = useState(0);

  const [autoTab, setAutoTab] = useState(false);

  const [autoBetEnabled, setAutoBetEnabled] = useState(false);

  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(false);

  const [autoCashout, setAutoCashout] = useState<number | null>(null);

  const [status, setStatus] = useState<"WAITING" | "RUNNING" | "CRASHED">("WAITING");
const [nextRoundCountdown, setNextRoundCountdown] = useState(5);
const [isBettingPhase, setIsBettingPhase] = useState(true);
const [crashPoint, setCrashPoint] = useState<number | null>(null);
const [smoke, setSmoke] = useState<Smoke[]>([]);



  // ======================
  // REFS
  // ======================

  const cashoutLock = useRef(false);

  const isRunningRef = useRef(false);
  const [countdownStart, setCountdownStart] = useState(5);
 

  const planeX = useRef(0);
  const planeY = useRef(0);
  const planeRotate = useRef(0);

  const targetMultiplier = useRef(1);
  const displayedMultiplier = useRef(1);

  const frameRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const autoCashoutTriggered = useRef(false);
const smokeTimerRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
const gameWidth = useRef(0);
const countdownRef = useRef(0);
const countdownMaxRef = useRef(5);

  const isSyncedRef = useRef(false);
  // ======================
  // PLANE POSITION STATE
  // ======================
const [plane, setPlane] = useState({
  x: 0,
  y: 0,
  rot: 0,
});




  // ======================
  // CASHOUT
  // ======================

 const cashout = useCallback(async () => {
  if (!betId || cashoutLock.current) return;

  cashoutLock.current = true;

  try {
    const res = await fetch(
      "https://localhost:5000/api/cashout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ betId }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Cashout failed");
      cashoutLock.current = false;
      return;
    }

   if (data.success) {
  setBetId(null);

  setBetState("CASHED_OUT");

  setTimeout(() => {
    setBetState("IDLE");
  }, 2500);
}
  } catch {
    cashoutLock.current = false;
  }
}, [betId]);

const addBetSlip = () => {
  setBetSlips((prev) => [
    ...prev,
    { id: Date.now(), amount: "100" }
  ]);
};
const removeBetSlip = (id: number) => {
  setBetSlips((prev) => prev.filter(b => b.id !== id));
};
const updateBetSlip = (id: number, value: string) => {
  setBetSlips((prev) =>
    prev.map((b) =>
      b.id === id ? { ...b, amount: value } : b
    )
  );
};
  // ======================
  // SOCKET EVENTS
  // ======================
// ======================
// SOCKET EVENTS (FIXED)
// ======================
useEffect(() => {
  socket.off("onlineUsers");
  socket.off("playersBetting");
  socket.off("betUpdate");
  socket.off("roundStart");
  socket.off("multiplier");
  socket.off("roundCrash");
  socket.off("roundWaiting");

  socket.emit("syncRequest");

  // ======================
  // SYNC STATE (FIXED)
  // ======================
  socket.on("syncState", (data: SyncStateData) => {
    if (!data) return;

    setRoundId(data.roundId);
    setCrashPoint(data.crashPoint);

    setMultiplier(1);
    targetMultiplier.current = 1;
    displayedMultiplier.current = 1;

    isSyncedRef.current = true;

    if (data.status === "RUNNING") {
      setStatus("RUNNING");
      setIsBettingPhase(false);
      isRunningRef.current = true;
    }

    if (data.status === "CRASHED") {
      setStatus("CRASHED");
      setIsBettingPhase(true);
      isRunningRef.current = false;
    }
  });
 socket.on("onlineUsers", (data: { count: number }) => {
  setOnlineUsers(data.count);
});
  // ======================
  // ROUND START (FIXED)
  // ======================
  socket.on("roundStart", (data: RoundStartData) => {
  setStatus("RUNNING");

  setBetState((prev) => {
    if (prev === "LOCKED") {
      return "ACTIVE";
    }

    return prev;
  });

  setIsBettingPhase(false);

  autoCashoutTriggered.current = false;

  setRoundId(data.roundId);
  setCrashPoint(null);

  isRunningRef.current = true;

  targetMultiplier.current = 1;
  displayedMultiplier.current = 1;
  setMultiplier(1);

  planeX.current = 0;
  planeY.current = 0;
  planeRotate.current = 0;

  cashoutLock.current = false;
  frameCountRef.current = 0;
});
  // ======================
  // MULTIPLIER
  // ======================
  socket.on("multiplier", (data: MultiplierData) => {
    targetMultiplier.current = Number(data.multiplier);
  });

  // ======================
  // ROUND CRASH (FIXED)
  // ======================
  socket.on("roundCrash", (data: RoundCrashData) => {
    setStatus("CRASHED");
    setIsBettingPhase(true);

    isRunningRef.current = false;

    setBetId(null);
    setSmoke([]);

    const point = Number(data.crashPoint);

    setCrashPoint(point);
    setMultiplier(point);

    displayedMultiplier.current = point;
    targetMultiplier.current = point;

    setRoundHistory((prev) => [point, ...prev].slice(0, 20));

    cashoutLock.current = false;
    setBetState((prev) => {
  if (prev === "ACTIVE") {
    return "LOST";
  }

  return prev;
});

setTimeout(() => {
  setBetState("IDLE");
}, 2500);
  });

  // ======================
  // ROUND WAITING
  // ======================
 socket.on("roundWaiting", (data: RoundWaitingData) => {
  setStatus("WAITING");
  setIsBettingPhase(true);

  setSmoke([]);
  autoCashoutTriggered.current = false;

  const start = data?.countdown ?? 5;

  countdownMaxRef.current = start;
  countdownRef.current = start;

  setCountdownStart(start);
  setNextRoundCountdown(start);

  if ((window as any).__countdownInterval) {
    clearInterval((window as any).__countdownInterval);
  }

  (window as any).__countdownInterval = setInterval(() => {
    countdownRef.current -= 0.05; // 🔥 small step = smooth motion

    if (countdownRef.current <= 0) {
      countdownRef.current = 0;
      clearInterval((window as any).__countdownInterval);
      (window as any).__countdownInterval = null;
    }

    setNextRoundCountdown(countdownRef.current);
  }, 50); // 🔥 update 20 times per second
});

  return () => {
    socket.off("onlineUsers");
    socket.off("syncState");
    socket.off("playersBetting");
    socket.off("betUpdate");
    socket.off("roundStart");
    socket.off("multiplier");
    socket.off("roundCrash");
    socket.off("roundWaiting");
  };
}, []);

// ======================
// ANIMATION LOOP (FIXED)
// ======================
useEffect(() => {
  const animate = () => {
    frameRef.current = requestAnimationFrame(animate);

    // ❌ ONLY THIS GUARD (IMPORTANT FIX)
    if (!isRunningRef.current) return;

    const SMOOTHNESS = 0.18;

    displayedMultiplier.current +=
      (targetMultiplier.current - displayedMultiplier.current) *
      SMOOTHNESS;

    const m = displayedMultiplier.current;

    if (autoTab && betId && autoCashout !== null && !autoCashoutTriggered.current && m >= autoCashout) {
      autoCashoutTriggered.current = true;
      cashout();
    }

    frameCountRef.current++;

    if (frameCountRef.current % 2 === 0) {
      setMultiplier(Number(m.toFixed(2)));
    }

    // ======================
    // PLANE
    // ======================
    const t = Math.max(0, m - 1);
    const maxX = gameWidth.current - 80;

    const progress = 1 - Math.exp(-t * 0.65);
    const x = progress * (maxX - 250);

    const climb = 1 - Math.exp(-t * 0.9);
    let y = -climb * 45;

    const swing =
      Math.sin(t * 1.6) * 15 +
      Math.sin(t * 0.7) * 7;

    const breath = 0.85 + Math.sin(t * 0.8) * 0.90;

    y += swing * breath;

    const targetAngle = 45;

    planeRotate.current +=
      (targetAngle - planeRotate.current) * 0.1;

    const angle = planeRotate.current;

    planeX.current = x;
    planeY.current = y;
    planeRotate.current = angle;

    if (frameCountRef.current % 2 === 0) {
      setPlane({ x, y, rot: angle });
    }

    smokeTimerRef.current++;

    if (smokeTimerRef.current % 5 === 0) {
      setSmoke((prev) => [
        ...prev,
        {
          x: planeX.current,
          y: planeY.current,
          id: crypto.randomUUID(),
        },
      ].slice(-25));
    }
  };

  frameRef.current = requestAnimationFrame(animate);

  return () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  };
}, []);

useEffect(() => {
  const update = () => {
    if (!gameAreaRef.current) return;
    gameWidth.current = gameAreaRef.current.offsetWidth;
  };

  update();
  window.addEventListener("resize", update);

  return () => window.removeEventListener("resize", update);
}, []);
useEffect(() => {

  const handler = (data: any) => {
    console.log("BET CONFIRMED:", data);
  };

  socket.on("betPlaced", handler);

  return () => {
    socket.off("betPlaced", handler);
  };

}, []);
  // ======================
  // PLACE BET
  // ======================
const placeBet = async () => {
  if (!user?._id || !roundId) return;
  if (!isBettingPhase) return;
  if (!betSlips.length) return;

  socket.emit("placeBet", {
    userId: user._id,
    betSlips,
    autoCashout: autoCashoutEnabled ? autoCashout : null,
  });

  // UI immediately locks (optimistic UI)
  setBetState("LOCKED");
};

  // ======================
  // UI
  // ======================

  return (
    <div
      style={{
        background: "#0b0b0f",
        minHeight: "100vh",
        padding: 10,
      }}
    >
      <style jsx global>{`
  @keyframes spinWheel {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`}</style>
      <TopBar
        history={roundHistory}
        onlineUsers={onlineUsers}
        openDeposit={() => setShowDepositModal(true)}
      />

      {/* GAME AREA */}
     <div
      ref={gameAreaRef}
  style={{
    height: 420,
    background: "#0f1118",
    borderRadius: 20,
    position: "relative",
    overflow: "hidden",
    marginBottom: 15,
  }}
>
  <div style={{ position: "absolute", inset: 0 }} />
  {/* ===================== */}
{/* LIVE ROTATING BACKGROUND */}
{/* ===================== */}

<div
  style={{
    position: "absolute",
    width: 700,
    height: 700,
    borderRadius: "50%",
    border: "1px solid rgba(255,215,0,0.08)",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    animation: "spinWheel 40s linear infinite",
    boxShadow:
      "0 0 80px rgba(255,215,0,0.06), inset 0 0 80px rgba(255,215,0,0.04)",
  }}
>
  <div
    style={{
      position: "absolute",
      inset: 40,
      borderRadius: "50%",
      border: "1px dashed rgba(255,215,0,0.08)",
    }}
  />

  <div
    style={{
      position: "absolute",
      inset: 90,
      borderRadius: "50%",
      border: "1px solid rgba(0,255,180,0.06)",
    }}
  />

  <div
    style={{
      position: "absolute",
      left: "50%",
      top: 0,
      width: 1,
      height: "100%",
      background:
        "linear-gradient(to bottom, transparent, rgba(255,215,0,0.15), transparent)",
    }}
  />

  <div
    style={{
      position: "absolute",
      top: "50%",
      left: 0,
      height: 1,
      width: "100%",
      background:
        "linear-gradient(to right, transparent, rgba(255,215,0,0.15), transparent)",
    }}
  />
</div>

  {/* ===================== */}
  {/* WAITING SCREEN */}
  {/* ===================== */}
  {status === "WAITING" && (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 900, color: "#ff1744" }}>
        youCashM ✈️
      </div>

      <div style={{ color: "#00ff88", marginTop: 10 }}>
        GodSpeed Tech<br />Official Game
      </div>

      <div style={{ color: "#888", marginTop: 5 }}>
        Since 2026
      </div>

      {/* LIVE COUNTDOWN (IMPORTANT RN FEATURE) */}
      <div
  style={{
    width: 220,
    height: 6,
    background: "#222",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  }}
>
  <div
    style={{
      height: "100%",
     width: `${(nextRoundCountdown / countdownMaxRef.current) * 100}%`,
      background: "#00ff88",
      transition: "width 0.3s linear",
    }}
  />

</div>
      <div
        style={{
          marginTop: 15,
          color: "#00ff88",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        NEXT ROUND IN {(nextRoundCountdown ?? 0).toFixed(nextRoundCountdown < 1 ? 2 : 1)}s
      </div>

    </div>
  )}

  {/* ===================== */}
  {/* RUNNING SCREEN */}
  {/* ===================== */}
  {status === "RUNNING" && (
    <>
     
{smoke.map((s) => (
  <div
  key={s.id}
    style={{
      position: "absolute",
      left: s.x + 10,
      top: s.y + 110,
      width: 30,
      height: 10,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.6)",
      filter: "blur(4px)",
      opacity: 0.6,
    }}
  />
))}
      {/* PLANE */}
     <div
  style={{
    position: "absolute",
    fontSize: 60,
   transform: `translate(${plane.x + 20}px, ${plane.y + 70}px) rotate(${plane.rot}deg)`,
    willChange: "transform",
     filter: "drop-shadow(0 0 10px rgba(255, 200, 0, 0.8)) drop-shadow(0 0 25px rgba(255, 100, 0, 0.5))",
    textShadow: "0 0 10px rgba(255,255,255,0.8)",
  }}
>
  ✈️
</div>

      {/* MULTIPLIER */}
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          fontSize: 80,
          fontWeight: 900,
          position: "absolute",
top: "55%",
left: "50%",
transform: "translate(-50%, -50%)",
textShadow: "0 0 12px rgba(0,255,136,0.8), 0 0 25px rgba(0,255,136,0.4)",
        }}
      >
        {multiplier.toFixed(2)}x
      </h1>

      {/* STATUS */}
      <div
        style={{
          color: "#00ff88",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        RUNNING
      </div>
    </>
  )}

  {/* ===================== */}
  {/* CRASH SCREEN */}
  {/* ===================== */}
  {status === "CRASHED" && (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 900, color: "#ff1744" }}>
        youCashM ✈️
      </div>

      <div
        style={{
          color: "#ff3b3b",
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 10,
        }}
      >
        💥 CRASHED AT {crashPoint?.toFixed(2)}x
      </div>

      <div style={{ color: "#888", marginTop: 10 }}>
        NEXT ROUND STARTING IN {nextRoundCountdown}s
      </div>
    </div>
  )}
</div>

      <BettingPanel
        betSlips={betSlips}
addBetSlip={addBetSlip}
removeBetSlip={removeBetSlip}
updateBetSlip={updateBetSlip}
        placeBet={placeBet}
        cashout={cashout}
        betState={betState}
multiplier={multiplier}
lockedBetAmount={lockedBetAmount}
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
        <Leaderboard data={liveBoard} />
    </div>
  );
}