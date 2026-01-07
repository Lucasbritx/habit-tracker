"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { useHabits, useHabitStore, HabitData } from "../../lib/habit-store";
import Link from "next/link";
import ReactConfetti from "react-confetti";

export default function Home() {
  const habits = useHabits();
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}>
          <ReactConfetti
            width={typeof window !== 'undefined' ? window.innerWidth : 800}
            height={typeof window !== 'undefined' ? window.innerHeight : 600}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}

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
            <HabitCard key={habit.id} habit={habit} onComplete={triggerConfetti} />
          ))}
        </div>
      )}
    </div>
  );
}

function HabitCard({ habit, onComplete }: { habit: HabitData; onComplete: () => void }) {
  const store = useHabitStore();
  const [completed, setCompleted] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleToggle = () => {
    if (!completed) {
      store.incrementStreak(habit.id);
      onComplete();
    }
    setCompleted(!completed);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${habit.title}"?`)) {
      store.delete(habit.id);
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-4 bg-surface rounded-xl border border-gray-800 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Link href={`/habits/${habit.id}`} className="flex-1">
        <p className={`text-lg font-semibold ${completed ? "text-gray-500 line-through" : "text-white"} hover:text-primary transition-colors`}>
          {habit.title}
        </p>
        <p className="text-gray-400 text-sm">🔥 {habit.currentStreak} day streak</p>
      </Link>

      {showActions && (
        <button
          onClick={handleDelete}
          className="mr-4 text-gray-500 hover:text-red-400 transition-colors"
          title="Delete habit"
        >
          🗑️
        </button>
      )}

      <button
        onClick={handleToggle}
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all transform hover:scale-110 ${
          completed ? "bg-primary border-primary" : "border-gray-600 hover:border-primary"
        }`}
      >
        {completed && <span className="text-white font-bold text-lg">✓</span>}
      </button>
    </div>
  );
}

