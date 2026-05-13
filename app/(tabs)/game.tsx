import { useEffect, useRef, useState } from "react";
import {  View,  Text,  StyleSheet,  Pressable,  Animated,TextInput
} from "react-native";

import socket from "../services/socket";

export default function GameScreen() {
  const [multiplier, setMultiplier] = useState(1.0);
  const [status, setStatus] = useState("WAITING");
  const [crashPoint, setCrashPoint] = useState<number | null>(null);

  const [betAmount, setBetAmount] = useState("100");
  const [roundId, setRoundId] = useState<string | null>(null);
  const [betId, setBetId] = useState(null);
  // Plane animation
  const planeY = useRef(new Animated.Value(0)).current;
  const getPlaneOffset = (multiplier) => {
  // slow start → fast rise curve
  return Math.pow(multiplier, 1.6) * -15;
};
const targetMultiplier = useRef(1.0);

  useEffect(() => {
  socket.on("connect", () => {
    console.log("✅ SOCKET CONNECTED:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("❌ CONNECTION ERROR:", err.message);
  });

  socket.on("connected", (data) => {
    console.log("✅ BACKEND CONFIRMED:", data);
  });

  socket.on("roundStart", (data: any) => {
    setStatus("RUNNING");
    setMultiplier(1.0);

    setRoundId(data.roundId);
    setCrashPoint(data.crashPoint);

    Animated.timing(planeY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  });

  socket.on("multiplier", (data: any) => {
    const currentMultiplier = Number(data.multiplier);

    setMultiplier(currentMultiplier);
    targetMultiplier.current = currentMultiplier;

    // ✈️ SIMPLE SMOOTH ANIMATION (NO COMPLEX INTERVAL)
    Animated.spring(planeY, {
      toValue: getPlaneOffset(currentMultiplier),
      useNativeDriver: true,
      speed: 20,
      damping: 15,
      mass: 0.6,
    }).start();
  });

  socket.on("roundCrash", (data: any) => {
    setStatus("CRASHED");

    if (data?.crashPoint) {
      setCrashPoint(Number(data.crashPoint));
    }

    Animated.sequence([
      Animated.timing(planeY, {
        toValue: getPlaneOffset(multiplier) + 20,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(planeY, {
        toValue: getPlaneOffset(multiplier),
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  });

  return () => {
    socket.off("connect");
    socket.off("connect_error");
    socket.off("connected");
    socket.off("roundStart");
    socket.off("multiplier");
    socket.off("roundCrash");
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const placeBet = async () => {
  try {
    if (!roundId) {
      console.log("❌ No active round");
      return;
    }

    const response = await fetch(
      "https://youcashm-backend.onrender.com/api/bet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "player1",
          amount: Number(betAmount),
          roundId,
        }),
      }
    );

    const data = await response.json();

    if (data.success === false) {
      console.log("❌ BET REJECTED:", data.message);
      return;
    }

    console.log("✅ BET ACCEPTED:", data);

    // 🔥 STORE BET ID
    setBetId(data.id || data.bet?.id);

  } catch (error) {
    console.log("❌ BET ERROR:", error);
  }
};
const cashout = async () => {
  try {
    if (!betId) {
      console.log("❌ No bet to cashout");
      return;
    }

    const response = await fetch(
      "https://youcashm-backend.onrender.com/api/cashout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          betId,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      console.log("❌ CASHOUT FAILED:", data.message);
      return;
    }

    console.log("💰 CASHOUT SUCCESS:", data.bet);

    // reset bet
    setBetId(null);

  } catch (error) {
    console.log("❌ CASHOUT ERROR:", error);
  }
};

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>youCashM</Text>

      {/* STATUS */}
      <Text style={styles.status}>
        {status}
      </Text>

      {/* GAME AREA */}
      <View style={styles.gameArea}>
        {/* PLANE */}
        <Animated.View
          style={[
            styles.planeContainer,
            {
              transform: [{ translateY: planeY }],
            },
          ]}
        >
          <Text style={styles.plane}>✈️</Text>
        </Animated.View>

        {/* MULTIPLIER */}
        <Text style={styles.multiplier}>
          {multiplier.toFixed(2)}x
        </Text>

        {/* CRASH INFO */}
        {status === "CRASHED" && crashPoint && (
          <Text style={styles.crashText}>
            Crashed at {crashPoint.toFixed(2)}x
          </Text>
        )}
      </View>
<TextInput
  style={styles.input}
  value={betAmount}
  onChangeText={setBetAmount}
  keyboardType="numeric"
  placeholder="Enter Bet Amount"
  placeholderTextColor="#666"
/>
      {/* BUTTONS */}
      <View style={styles.buttonRow}>
       <Pressable style={styles.betButton} onPress={placeBet}>
          <Text style={styles.btnText}>BET</Text>
        </Pressable>

       <Pressable  style={styles.cashoutButton}
         onPress={cashout}>
          <Text style={styles.btnText}>CASHOUT</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 30,
    color: "#00ff88",
    fontWeight: "bold",
    marginBottom: 20,
  },

  status: {
    color: "#888",
    marginBottom: 20,
    fontSize: 14,
    letterSpacing: 2,
  },

  gameArea: {
    width: "100%",
    height: 320,
    borderRadius: 20,
    backgroundColor: "#12131a",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 40,
  },

  planeContainer: {
    position: "absolute",
    bottom: 80,
  },

  plane: {
    fontSize: 42,
  },

  multiplier: {
    fontSize: 64,
    fontWeight: "bold",
    color: "white",
  },

  crashText: {
    marginTop: 15,
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "bold",
  },

  input: {
  width: 220,
  backgroundColor: "#15151d",
  color: "white",
  paddingVertical: 12,
  paddingHorizontal: 15,
  borderRadius: 10,
  marginBottom: 25,
  fontSize: 18,
  borderWidth: 1,
  borderColor: "#222",
},
  buttonRow: {
    flexDirection: "row",
    gap: 20,
  },

  betButton: {
    backgroundColor: "#1f6fff",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 12,
  },

  cashoutButton: {
    backgroundColor: "#00ff88",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 12,
  },

  btnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});