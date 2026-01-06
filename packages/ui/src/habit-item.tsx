"use client";

import { View, Text, Pressable } from "react-native";
import { Button } from "./button";
import { clsx } from "clsx";

interface HabitItemProps {
  title: string;
  streak: number;
  completed: boolean;
  onToggle: () => void;
}

export const HabitItem = ({ title, streak, completed, onToggle }: HabitItemProps) => {
  return (
    <View className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3 border border-gray-800">
      <View className="flex-1">
        <Text className={clsx("text-lg font-semibold", completed ? "text-gray-500 line-through" : "text-white")}>
          {title}
        </Text>
        <Text className="text-gray-400 text-sm">
          🔥 {streak} day streak
        </Text>
      </View>

      <Pressable 
        onPress={onToggle}
        className={clsx(
          "w-8 h-8 rounded-full border-2 items-center justify-center",
          completed ? "bg-primary border-primary" : "border-gray-600"
        )}
      >
        {completed && <Text className="text-white font-bold">✓</Text>}
      </Pressable>
    </View>
  );
};
