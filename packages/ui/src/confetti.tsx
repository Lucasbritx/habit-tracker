"use client";

import { useEffect, useState } from "react";
// react-confetti is DOM-based, so it only works on Web.
// For Mobile we would use something like `react-native-confetti-cannon`.
// This component handles the platform check or simple return null on native if not handled.

import ReactConfetti from "react-confetti";
import { Platform, View, StyleSheet } from "react-native";

export const Confetti = ({ trigger }: { trigger: boolean }) => {
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  if (Platform.OS !== "web") {
    // Mobile implementation placeholder
    return null; 
  }

  if (!trigger) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}>
       <ReactConfetti
         width={windowDimension.width}
         height={windowDimension.height}
         recycle={false}
         numberOfPieces={200}
       />
    </div>
  );
};
