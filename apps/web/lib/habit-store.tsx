"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

// Simple Habit type (no decorators needed)
export interface HabitData {
  id: string;
  title: string;
  frequency: "daily" | "weekly";
  categoryId: string;
  currentStreak: number;
  longestStreak: number;
  createdAt: number;
}

// Simple in-memory + localStorage store
class SimpleHabitStore {
  private habits: HabitData[] = [];
  private listeners: Set<() => void> = new Set();
  private storageKey = "habit-tracker-habits";

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.habits = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load habits from storage", e);
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.habits));
    } catch (e) {
      console.error("Failed to save habits to storage", e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getAll(): HabitData[] {
    return [...this.habits];
  }

  create(title: string, frequency: "daily" | "weekly" = "daily"): HabitData {
    const habit: HabitData = {
      id: crypto.randomUUID(),
      title,
      frequency,
      categoryId: "default",
      currentStreak: 0,
      longestStreak: 0,
      createdAt: Date.now(),
    };
    this.habits.push(habit);
    this.saveToStorage();
    this.notifyListeners();
    return habit;
  }

  delete(id: string): void {
    this.habits = this.habits.filter((h) => h.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  incrementStreak(id: string): void {
    const habit = this.habits.find((h) => h.id === id);
    if (habit) {
      habit.currentStreak++;
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  resetStreak(id: string): void {
    const habit = this.habits.find((h) => h.id === id);
    if (habit) {
      habit.currentStreak = 0;
      this.saveToStorage();
      this.notifyListeners();
    }
  }
}

const store = new SimpleHabitStore();

const StoreContext = createContext<SimpleHabitStore | null>(null);

export const HabitStoreProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useHabitStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useHabitStore must be used within HabitStoreProvider");
  }
  return context;
};

// Hook to get habits with reactivity
export const useHabits = () => {
  const store = useHabitStore();
  const [habits, setHabits] = useState<HabitData[]>([]);

  useEffect(() => {
    setHabits(store.getAll());
    return store.subscribe(() => {
      setHabits(store.getAll());
    });
  }, [store]);

  return habits;
};
