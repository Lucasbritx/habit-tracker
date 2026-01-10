"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

import { createClient } from "./supabase/client";

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
  private supabase = createClient();
  private userId: string | null = null;

  constructor() {
    this.loadFromStorage();
    this.init();
  }

  async init() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (user) {
      this.userId = user.id;
      await this.fetchFromSupabase();
    }

    // Subscribe to auth changes
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      this.userId = session?.user?.id || null;
      if (this.userId) {
        await this.fetchFromSupabase();
      } else {
        this.habits = [];
        this.loadFromStorage();
        this.notifyListeners();
      }
    });
  }

  private async fetchFromSupabase() {
    if (!this.userId) return;

    try {
      // Fetch habits
      const { data: habitsData, error: habitsError } = await this.supabase
        .from('habits')
        .select('*');

      if (habitsError) throw habitsError;

      // Fetch all logs for these habits to populate completedDates
      const { data: logsData, error: logsError } = await this.supabase
        .from('habit_logs')
        .select('habit_id, date');

      if (logsError) throw logsError;

      // Map to our local format
      this.habits = (habitsData || []).map(h => ({
        id: h.id as string,
        title: h.title as string,
        frequency: (h.frequency || 'daily') as "daily" | "weekly",
        categoryId: (h.category_id || 'default') as string,
        currentStreak: (h.current_streak || 0) as number,
        longestStreak: (h.longest_streak || 0) as number,
        createdAt: h.created_at ? new Date(h.created_at).getTime() : Date.now(),
        completedDates: (logsData || [])
          .filter(l => l.habit_id === h.id)
          .map(l => l.date as string)
          .filter(Boolean)
      }));

      this.notifyListeners();
    } catch (e) {
      console.error("Failed to fetch from Supabase", e);
    }
  }

  private loadFromStorage() {
    if (typeof window === "undefined" || this.userId) return;
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.habits = JSON.parse(stored);
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
    if (typeof window === "undefined" || this.userId) return;
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

  async create(title: string, frequency: "daily" | "weekly" = "daily"): Promise<HabitData> {
    const habit: HabitData = {
      id: crypto.randomUUID() as string, // Cast to string to avoid potential type issues
      title,
      frequency,
      categoryId: "default",
      currentStreak: 0,
      longestStreak: 0,
      createdAt: Date.now(),
      completedDates: [],
    };

    // Optimistic update
    this.habits.push(habit);
    this.saveToStorage();
    this.notifyListeners();

    if (this.userId) {
      try {
        const { data, error } = await this.supabase
          .from('habits')
          .insert({
            title,
            frequency,
            category_id: habit.categoryId,
            current_streak: 0,
            longest_streak: 0
          })
          .select()
          .single();

        if (error) throw error;
        
        // Update local with real DB ID
        habit.id = data.id;
        this.notifyListeners();
      } catch (e) {
        console.error("Supabase create failed", e);
        // Fallback or handle error
      }
    }

    return habit;
  }

  async delete(id: string): Promise<void> {
    this.habits = this.habits.filter((h) => h.id !== id);
    this.saveToStorage();
    this.notifyListeners();

    if (this.userId) {
      const { error } = await this.supabase
        .from('habits')
        .delete()
        .eq('id', id);
      
      if (error) console.error("Supabase delete failed", error);
    }
  }

  async toggleComplete(id: string): Promise<boolean> {
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

      if (this.userId) {
        // Remove log
        await this.supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', id)
          .eq('date', today);
        
        // Update habit streaks
        await this.supabase
          .from('habits')
          .update({ 
            current_streak: updatedHabit.currentStreak,
            longest_streak: updatedHabit.longestStreak
          })
          .eq('id', id);
      }
    } else {
      // Complete
      updatedHabit = {
        ...habit,
        completedDates: [...habit.completedDates, today],
        currentStreak: habit.currentStreak + 1,
        longestStreak: Math.max(habit.longestStreak, habit.currentStreak + 1)
      };

      if (this.userId) {
        // Add log
        await this.supabase
          .from('habit_logs')
          .insert({ habit_id: id, date: today });
        
        // Update habit streaks
        await this.supabase
          .from('habits')
          .update({ 
            current_streak: updatedHabit.currentStreak,
            longest_streak: updatedHabit.longestStreak
          })
          .eq('id', id);
      }
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

  async resetStreak(id: string): Promise<void> {
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

      if (this.userId) {
        await this.supabase
          .from('habits')
          .update({ current_streak: 0 })
          .eq('id', id);
      }
    }
  }

  async update(id: string, updates: Partial<Omit<HabitData, 'id' | 'createdAt'>>): Promise<void> {
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

      if (this.userId) {
        const supabaseUpdates: any = {};
        if (updates.title) supabaseUpdates.title = updates.title;
        if (updates.frequency) supabaseUpdates.frequency = updates.frequency;
        if (updates.categoryId) supabaseUpdates.category_id = updates.categoryId;
        if (updates.currentStreak !== undefined) supabaseUpdates.current_streak = updates.currentStreak;
        if (updates.longestStreak !== undefined) supabaseUpdates.longest_streak = updates.longestStreak;

        await this.supabase
          .from('habits')
          .update(supabaseUpdates)
          .eq('id', id);
      }
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
