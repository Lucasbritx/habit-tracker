"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { useHabitStore } from "../../../lib/habit-store";
import { useRouter } from "next/navigation";

export default function HabitsPage() {
  const store = useHabitStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Please enter a habit title");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      store.create(title, frequency);
      setTitle("");
      router.push("/");
    } catch (e) {
      console.error(e);
      setError("Failed to create habit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <h1 className="text-3xl font-bold text-white">Create New Habit</h1>

      <div className="bg-surface rounded-xl p-6 border border-gray-800 flex flex-col gap-4">
        {error && (
          <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-sm">Habit Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Read 10 pages"
            className="bg-background text-white p-4 rounded-xl border border-gray-700 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-sm">Frequency</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFrequency("daily")}
              className={`flex-1 py-3 rounded-lg border transition-colors ${
                frequency === "daily"
                  ? "bg-primary border-primary text-white"
                  : "border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setFrequency("weekly")}
              className={`flex-1 py-3 rounded-lg border transition-colors ${
                frequency === "weekly"
                  ? "bg-primary border-primary text-white"
                  : "border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Habit"}
        </Button>
      </div>
    </div>
  );
}
