"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { useHabits, useHabitStore, HabitData } from "../../lib/habit-store";
import Link from "next/link";

export default function Home() {
  const habits = useHabits();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Today's Habits</h1>
        <Link href="/habits">
          <Button variant="primary">+ New Habit</Button>
        </Link>
      </div>

      {habits.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 border border-gray-800 text-center">
          <p className="text-gray-400 text-lg mb-2">No habits yet.</p>
          <p className="text-gray-500 mb-4">Create your first habit to start tracking!</p>
          <Link href="/habits">
            <Button variant="secondary">Create Habit</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}

function HabitCard({ habit }: { habit: HabitData }) {
  const store = useHabitStore();
  const [completed, setCompleted] = useState(false);

  const handleToggle = () => {
    if (!completed) {
      store.incrementStreak(habit.id);
    }
    setCompleted(!completed);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-gray-800">
      <div>
        <p className={`text-lg font-semibold ${completed ? "text-gray-500 line-through" : "text-white"}`}>
          {habit.title}
        </p>
        <p className="text-gray-400 text-sm">🔥 {habit.currentStreak} day streak</p>
      </div>
      <button
        onClick={handleToggle}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
          completed ? "bg-primary border-primary" : "border-gray-600 hover:border-gray-500"
        }`}
      >
        {completed && <span className="text-white font-bold">✓</span>}
      </button>
    </div>
  );
}
