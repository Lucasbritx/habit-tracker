"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { schema, Habit, HabitLog, Category } from "@repo/db";

let database: Database | null = null;

const getDatabase = () => {
  if (database) return database;

  const adapter = new LokiJSAdapter({
    schema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    onSetUpError: (error) => {
      console.error("Database failed to load", error);
    },
  });

  database = new Database({
    adapter,
    modelClasses: [Habit, HabitLog, Category],
  });

  return database;
};

const DatabaseContext = createContext<Database | null>(null);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    setDb(getDatabase());
  }, []);

  if (!db) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading database...</p>
      </div>
    );
  }

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within DatabaseProvider");
  }
  return context;
};
