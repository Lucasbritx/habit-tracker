"use client";

import { Button } from "@repo/ui/button";

export default function HabitsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Habits</h1>
        <Button variant="primary" onPress={() => alert("Create Habit")}>
          + New Habit
        </Button>
      </div>

      <div className="bg-surface rounded-xl p-8 border border-gray-800 text-center">
        <p className="text-gray-400 text-lg">No habits yet.</p>
        <p className="text-gray-500">Create your first habit to get started!</p>
      </div>
    </div>
  );
}
