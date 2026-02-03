"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from "react";
import { useDatabase } from "./database-provider";
import { HabitRepository, Habit, sync } from "@repo/db";
import { Q } from "@nozbe/watermelondb";
import { createClient } from "./supabase/client";

// Helper to get today's date string (YYYY-MM-DD)
const getTodayString = () => new Date().toISOString().split('T')[0];

interface HabitStoreContextType {
  repository: ReturnType<typeof HabitRepository>;
  isCompletedToday: (habitId: string) => Promise<boolean>;
  toggleComplete: (habitId: string) => Promise<boolean>;
  delete: (habitId: string) => Promise<void>;
  sync: () => Promise<void>;
}

const StoreContext = createContext<HabitStoreContextType | null>(null);

export const HabitStoreProvider = ({ children }: { children: ReactNode }) => {
  const database = useDatabase();
  const supabase = useMemo(() => createClient(), []);
  
  const repository = useMemo(() => HabitRepository(database), [database]);

  const handleSync = async () => {
    try {
      await sync(database, supabase);
    } catch (e) {
      console.error("Sync failed", e);
    }
  };

  useEffect(() => {
    handleSync();
  }, [database, supabase]);

  const isCompletedToday = async (habitId: string) => {
    const today = getTodayString();
    if (!habitId) return false;
    
    const logs = await database.get('habit_logs').query(
      Q.where('habit_id', habitId),
      Q.where('date', today)
    ).fetch();
    return logs.length > 0;
  };

  const toggleComplete = async (habitId: string) => {
    const today = getTodayString();
    await repository.toggleComplete(habitId, today);
    return isCompletedToday(habitId);
  };

  const handleDelete = async (habitId: string) => {
    await database.write(async () => {
      const habit = await database.get<Habit>('habits').find(habitId);
      await habit.markAsDeleted();
    });
  };

  const value = {
    repository,
    isCompletedToday,
    toggleComplete,
    delete: handleDelete,
    sync: handleSync,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useHabitStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useHabitStore must be used within HabitStoreProvider");
  }
  return context;
};

// Hook to get habits with reactivity using WatermelonDB observability
export const useHabits = () => {
  const database = useDatabase();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const habitsCollection = database.get<Habit>('habits');
    const observable = habitsCollection.query().observe();
    
    const subscription = observable.subscribe((newHabits) => {
      setHabits(newHabits);
    });

    return () => subscription.unsubscribe();
  }, [database]);

  return habits;
};

// Export HabitData as an alias for Habit to minimize breaking changes in UI components
export type HabitData = Habit;
