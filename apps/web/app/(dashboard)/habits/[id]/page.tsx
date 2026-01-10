"use client";

import { useParams, useRouter } from "next/navigation";
import { useHabits, useHabitStore, HabitData } from "../../../../lib/habit-store";
import { Button } from "@repo/ui/button";
import { useState, useEffect } from "react";

export default function HabitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const store = useHabitStore();
  const habits = useHabits();
  const [habit, setHabit] = useState<HabitData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const found = habits.find((h) => h.id === params.id);
    if (found) {
      setHabit(found);
      setTitle(found.title);
    }
  }, [habits, params.id]);

  if (!habit) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Habit not found</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (title.trim()) {
      await store.update(habit.id, { title: title.trim() });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Delete "${habit.title}"?`)) {
      await store.delete(habit.id);
      router.push("/");
    }
  };

  const completionRate = habit.longestStreak > 0 
    ? Math.round((habit.currentStreak / habit.longestStreak) * 100) 
    : 0;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <button 
        onClick={() => router.back()} 
        className="text-gray-400 hover:text-white flex items-center gap-2 w-fit"
      >
        ← Back
      </button>

      <div className="bg-surface rounded-xl p-6 border border-gray-800">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background text-white text-2xl font-bold p-3 rounded-xl border border-gray-700 focus:border-primary focus:outline-none"
            />
            <div className="flex gap-2">
              <Button variant="primary" onPress={handleSave}>Save</Button>
              <Button variant="secondary" onPress={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{habit.title}</h1>
              <p className="text-gray-400 capitalize">{habit.frequency} habit</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white p-2"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-400 p-2"
              >
                🗑️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Current Streak</p>
          <p className="text-3xl font-bold text-primary">🔥 {habit.currentStreak}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Best Streak</p>
          <p className="text-3xl font-bold text-yellow-400">🏆 {habit.longestStreak}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Performance</p>
          <p className="text-3xl font-bold text-green-400">{completionRate}%</p>
        </div>
      </div>

      {/* History Placeholder */}
      <div className="bg-surface rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">History</h2>
        <p className="text-gray-500 text-center py-8">
          Calendar view coming soon...
        </p>
      </div>
    </div>
  );
}
