"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { HabitStoreProvider } from "../../lib/habit-store";
import { logout } from "../../lib/supabase/actions";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <HabitStoreProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar - Desktop */}
        <aside className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-primary">Habit Tracker</h1>
          <nav className="flex flex-col gap-2 flex-1">
            <NavLink href="/" label="Home" />
            <NavLink href="/habits" label="Habits" />
            <NavLink href="/stats" label="Analytics" />
            <NavLink href="/settings" label="Settings" />
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-800">
            <button 
              onClick={() => logout()}
              className="w-full px-4 py-2 rounded-lg hover:bg-red-900/20 text-gray-400 hover:text-red-400 transition-colors text-left"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden w-full border-b border-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Habit Tracker</h1>
          <button className="text-gray-400">Menu</button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </HabitStoreProvider>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
}
