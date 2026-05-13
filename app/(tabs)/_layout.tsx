import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0b0b0f",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#00ff88",
        tabBarInactiveTintColor: "#666",
      }}
    >
      <Tabs.Screen
        name="game"
        options={{
          title: "Game",
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
        }}
      />
    </Tabs>
  );
}