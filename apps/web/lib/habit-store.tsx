"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

// Helper to get today's date string (YYYY-MM-DD)
const getTodayString = () => new Date().toISOString().split('T')[0];

// Simple Habit type (no decorators needed)
export interface HabitData {
  id: string;
  title: string;
  frequency: "daily" | "weekly";
  categoryId: string;
  currentStreak: number;
  longestStreak: number;
  createdAt: number;
  completedDates: string[]; // Array of date strings "YYYY-MM-DD"
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
        // Migration: ensure completedDates exists
        this.habits = this.habits.map(h => ({
          ...h,
          completedDates: h.completedDates || []
        }));
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

  isCompletedToday(id: string): boolean {
    const habit = this.habits.find((h) => h.id === id);
    if (!habit) return false;
    const today = getTodayString();
    return habit.completedDates.includes(today);
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
      completedDates: [],
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

  toggleComplete(id: string): boolean {
    const habitIndex = this.habits.findIndex((h) => h.id === id);
    if (habitIndex === -1) return false;
    
    const habit = this.habits[habitIndex]!;
    const today = getTodayString();
    const alreadyCompleted = habit.completedDates.includes(today);
    
    let updatedHabit: HabitData;
    
    if (alreadyCompleted) {
      // Uncomplete
      updatedHabit = {
        ...habit,
        completedDates: habit.completedDates.filter(d => d !== today),
        currentStreak: Math.max(0, habit.currentStreak - 1)
      };
    } else {
      // Complete
      updatedHabit = {
        ...habit,
        completedDates: [...habit.completedDates, today],
        currentStreak: habit.currentStreak + 1,
        longestStreak: Math.max(habit.longestStreak, habit.currentStreak + 1)
      };
    }
    
    this.habits = [
      ...this.habits.slice(0, habitIndex),
      updatedHabit,
      ...this.habits.slice(habitIndex + 1)
    ];
    
    this.saveToStorage();
    this.notifyListeners();
    return !alreadyCompleted;
  }

  incrementStreak(id: string): void {
    this.toggleComplete(id);
  }

  resetStreak(id: string): void {
    const habitIndex = this.habits.findIndex((h) => h.id === id);
    if (habitIndex !== -1) {
      const habit = this.habits[habitIndex]!;
      this.habits = [
        ...this.habits.slice(0, habitIndex),
        { ...habit, currentStreak: 0 },
        ...this.habits.slice(habitIndex + 1)
      ];
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  update(id: string, updates: Partial<Omit<HabitData, 'id' | 'createdAt'>>): void {
    const habitIndex = this.habits.findIndex((h) => h.id === id);
    if (habitIndex !== -1) {
      const habit = this.habits[habitIndex]!;
      this.habits = [
        ...this.habits.slice(0, habitIndex),
        { ...habit, ...updates },
        ...this.habits.slice(habitIndex + 1)
      ];
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
    const unsubscribe = store.subscribe(() => {
      setHabits(store.getAll());
    });
    return () => { unsubscribe(); };
  }, [store]);

  return habits;
};
